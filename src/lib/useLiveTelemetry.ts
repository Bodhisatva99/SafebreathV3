import { useState, useEffect, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, SensorLogRow } from './supabase';

export interface LiveTelemetryState {
  currentLog: SensorLogRow | null;
  historyLogs: SensorLogRow[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  /** Latest timestamp a browser DB fetch completed successfully */
  lastFetchedAt: Date | null;
  /** Latest timestamp a Realtime event OR DB fetch delivered a packet to the browser */
  lastReceivedAt: Date | null;
  /** Parsed cloud insert / gateway / sample timestamp from the latest row */
  cloudCreatedAt: Date | null;
  /** True only when the row provides an explicit hardware sampled_at timestamp */
  hasTrueSampleTimestamp: boolean;
  /** Available distinct device_ids seen in the active stream (empty if schema lacks device_id) */
  availableDeviceIds: string[];
  activeDeviceFilter: string;
  setActiveDeviceFilter: (deviceId: string) => void;
  isRealtimeConnected: boolean;
  refresh: () => Promise<void>;
}

interface TelemetrySnapshot {
  currentLog: SensorLogRow | null;
  historyLogs: SensorLogRow[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastFetchedAt: Date | null;
  lastReceivedAt: Date | null;
  cloudCreatedAt: Date | null;
  hasTrueSampleTimestamp: boolean;
  availableDeviceIds: string[];
  activeDeviceFilter: string;
  isRealtimeConnected: boolean;
}

const HISTORY_LIMIT = 40;
const BASE_FALLBACK_POLL_MS = 5000;
const MAX_BACKOFF_POLL_MS = 30000;

let snapshot: TelemetrySnapshot = {
  currentLog: null,
  historyLogs: [],
  isLoading: true,
  isRefreshing: false,
  error: null,
  lastFetchedAt: null,
  lastReceivedAt: null,
  cloudCreatedAt: null,
  hasTrueSampleTimestamp: false,
  availableDeviceIds: [],
  activeDeviceFilter: 'all',
  isRealtimeConnected: false,
};

const listeners = new Set<(next: TelemetrySnapshot) => void>();
let activeChannel: RealtimeChannel | null = null;
let fallbackPollTimeout: ReturnType<typeof setTimeout> | null = null;
let visibilityHandlerAttached = false;
let channelSequence = 0;
let inFlightRequest = false;
let consecutiveFailures = 0;

function notifyListeners() {
  const current = snapshot;
  listeners.forEach((listener) => listener(current));
}

function updateSnapshot(patch: Partial<TelemetrySnapshot>) {
  snapshot = { ...snapshot, ...patch };
  notifyListeners();
}

function parseRowTimestamp(row: SensorLogRow | null): {
  date: Date | null;
  hasTrueSample: boolean;
} {
  if (!row) return { date: null, hasTrueSample: false };
  if (row.sampled_at) {
    const d = new Date(row.sampled_at);
    if (!Number.isNaN(d.getTime())) return { date: d, hasTrueSample: true };
  }
  const fallbackStr = row.gateway_received_at || row.created_at;
  const d = new Date(fallbackStr);
  return {
    date: Number.isNaN(d.getTime()) ? null : d,
    hasTrueSample: false,
  };
}

function mergeAndSortHistory(
  existing: SensorLogRow[],
  incoming: SensorLogRow[],
  deviceFilter: string
): SensorLogRow[] {
  const byId = new Map<number, SensorLogRow>();
  for (const r of existing) {
    if (deviceFilter === 'all' || r.device_id === deviceFilter) {
      byId.set(r.id, r);
    }
  }
  for (const r of incoming) {
    if (deviceFilter === 'all' || r.device_id === deviceFilter) {
      byId.set(r.id, r);
    }
  }
  return Array.from(byId.values())
    .sort((a, b) => a.id - b.id)
    .slice(-HISTORY_LIMIT);
}

function collectDeviceIds(rows: SensorLogRow[]): string[] {
  const set = new Set<string>(snapshot.availableDeviceIds);
  for (const r of rows) {
    if (r.device_id && typeof r.device_id === 'string') {
      set.add(r.device_id);
    }
  }
  return Array.from(set).sort();
}

function clearFallbackPoll() {
  if (fallbackPollTimeout) {
    clearTimeout(fallbackPollTimeout);
    fallbackPollTimeout = null;
  }
}

function scheduleFallbackPollIfNeeded() {
  clearFallbackPoll();
  if (listeners.size === 0 || snapshot.isRealtimeConnected) return;

  const delay = Math.min(
    MAX_BACKOFF_POLL_MS,
    BASE_FALLBACK_POLL_MS * Math.pow(2, Math.min(consecutiveFailures, 3))
  );
  fallbackPollTimeout = setTimeout(() => {
    fetchTelemetry(false);
  }, delay);
}

async function fetchTelemetry(manual = false) {
  if (inFlightRequest) return;
  inFlightRequest = true;

  if (manual) {
    updateSnapshot({ isRefreshing: true });
  }

  try {
    let query = supabase
      .from('sensor_logs')
      .select('*')
      .order('id', { ascending: false })
      .limit(HISTORY_LIMIT);

    if (snapshot.activeDeviceFilter !== 'all') {
      query = query.eq('device_id', snapshot.activeDeviceFilter);
    }

    const { data, error: queryError } = await query;

    if (queryError) {
      consecutiveFailures += 1;
      updateSnapshot({
        error: queryError.message || 'Unable to query telemetry stream.',
        isLoading: false,
        isRefreshing: false,
      });
      return;
    }

    consecutiveFailures = 0;
    const now = new Date();

    if (data && data.length > 0) {
      const rows = data as SensorLogRow[];
      const mergedHistory = mergeAndSortHistory(
        snapshot.historyLogs,
        rows,
        snapshot.activeDeviceFilter
      );
      const newestFromMerge = mergedHistory[mergedHistory.length - 1] ?? rows[0];
      const chosenCurrent =
        snapshot.currentLog &&
        (snapshot.activeDeviceFilter === 'all' ||
          snapshot.currentLog.device_id === snapshot.activeDeviceFilter) &&
        snapshot.currentLog.id > newestFromMerge.id
          ? snapshot.currentLog
          : newestFromMerge;

      const parsedTime = parseRowTimestamp(chosenCurrent);

      updateSnapshot({
        currentLog: chosenCurrent,
        historyLogs: mergedHistory,
        availableDeviceIds: collectDeviceIds(rows),
        error: null,
        lastFetchedAt: now,
        lastReceivedAt: now,
        cloudCreatedAt: parsedTime.date,
        hasTrueSampleTimestamp: parsedTime.hasTrueSample,
        isLoading: false,
        isRefreshing: false,
      });
    } else {
      updateSnapshot({
        currentLog: null,
        historyLogs: [],
        error: null,
        lastFetchedAt: now,
        lastReceivedAt: now,
        cloudCreatedAt: null,
        hasTrueSampleTimestamp: false,
        isLoading: false,
        isRefreshing: false,
      });
    }
  } catch (err) {
    consecutiveFailures += 1;
    updateSnapshot({
      error: err instanceof Error ? err.message : 'Network error reading telemetry.',
      isLoading: false,
      isRefreshing: false,
    });
  } finally {
    inFlightRequest = false;
    scheduleFallbackPollIfNeeded();
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    fetchTelemetry(false);
  }
}

function startTelemetryEngine() {
  if (activeChannel) return;

  fetchTelemetry(false);

  const uniqueChannelName = `safebreath_live_telemetry_${++channelSequence}`;
  const channel = supabase.channel(uniqueChannelName);

  channel
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'sensor_logs' },
      (payload) => {
        const newRow = payload.new as SensorLogRow;
        const deviceIds = collectDeviceIds([newRow]);

        if (
          snapshot.activeDeviceFilter !== 'all' &&
          newRow.device_id !== snapshot.activeDeviceFilter
        ) {
          updateSnapshot({ availableDeviceIds: deviceIds });
          return;
        }

        const mergedHistory = mergeAndSortHistory(
          snapshot.historyLogs,
          [newRow],
          snapshot.activeDeviceFilter
        );

        const nextCurrent =
          snapshot.currentLog && snapshot.currentLog.id > newRow.id
            ? snapshot.currentLog
            : newRow;

        const parsedTime = parseRowTimestamp(nextCurrent);
        consecutiveFailures = 0;

        updateSnapshot({
          currentLog: nextCurrent,
          historyLogs: mergedHistory,
          availableDeviceIds: deviceIds,
          lastReceivedAt: new Date(),
          cloudCreatedAt: parsedTime.date,
          hasTrueSampleTimestamp: parsedTime.hasTrueSample,
          isLoading: false,
          error: null,
          isRealtimeConnected: true,
        });
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'sensor_logs' },
      (payload) => {
        const updatedRow = payload.new as SensorLogRow;
        if (
          snapshot.activeDeviceFilter !== 'all' &&
          updatedRow.device_id !== snapshot.activeDeviceFilter
        ) {
          return;
        }

        const mergedHistory = mergeAndSortHistory(
          snapshot.historyLogs,
          [updatedRow],
          snapshot.activeDeviceFilter
        );
        const nextCurrent =
          !snapshot.currentLog || updatedRow.id >= snapshot.currentLog.id
            ? updatedRow
            : snapshot.currentLog;

        const parsedTime = parseRowTimestamp(nextCurrent);
        updateSnapshot({
          currentLog: nextCurrent,
          historyLogs: mergedHistory,
          lastReceivedAt: new Date(),
          cloudCreatedAt: parsedTime.date,
          hasTrueSampleTimestamp: parsedTime.hasTrueSample,
          isRealtimeConnected: true,
        });
      }
    )
    .subscribe((status) => {
      const connected = status === 'SUBSCRIBED';
      updateSnapshot({ isRealtimeConnected: connected });
      if (connected) {
        clearFallbackPoll();
      } else {
        scheduleFallbackPollIfNeeded();
      }
    });

  activeChannel = channel;

  if (!visibilityHandlerAttached && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    visibilityHandlerAttached = true;
  }
}

function stopTelemetryEngine() {
  if (activeChannel) {
    const channelToRemove = activeChannel;
    activeChannel = null;
    supabase.removeChannel(channelToRemove);
  }
  clearFallbackPoll();
  if (visibilityHandlerAttached && typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    visibilityHandlerAttached = false;
  }
}

export function useLiveTelemetry(): LiveTelemetryState {
  const [state, setState] = useState<TelemetrySnapshot>(snapshot);

  useEffect(() => {
    listeners.add(setState);
    setState(snapshot);

    if (listeners.size === 1) {
      startTelemetryEngine();
    }

    return () => {
      listeners.delete(setState);
      if (listeners.size === 0) {
        stopTelemetryEngine();
      }
    };
  }, []);

  const refresh = useCallback(async () => {
    await fetchTelemetry(true);
  }, []);

  const setActiveDeviceFilter = useCallback((deviceId: string) => {
    updateSnapshot({
      activeDeviceFilter: deviceId,
      currentLog: null,
      historyLogs: [],
      isLoading: true,
    });
    fetchTelemetry(true);
  }, []);

  return {
    ...state,
    refresh,
    setActiveDeviceFilter,
  };
}
