import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RefreshCw, Download, AlertCircle, Clock } from 'lucide-react';
import { supabase, SensorLogRow } from '../lib/supabase';
import {
  evaluateTelemetrySafety,
  formatUtcAndLocalDateTime,
  getSafetyBadgeClasses,
} from '../lib/safetyConfig';

type HistoryFilter = 'all' | 'alerts' | 'normal';
type TimeRangeFilter = 'all' | '1h' | '24h' | '7d';

const PAGE_SIZE = 50;

function mergeHistoryRows(existing: SensorLogRow[], incoming: SensorLogRow[]): SensorLogRow[] {
  const byId = new Map<number, SensorLogRow>();
  for (const row of existing) byId.set(row.id, row);
  for (const row of incoming) byId.set(row.id, row);
  return Array.from(byId.values()).sort((a, b) => b.id - a.id);
}

export const DataHistorySection: React.FC = () => {
  const [logs, setLogs] = useState<SensorLogRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<SensorLogRow | null>(null);
  const [filterState, setFilterState] = useState<HistoryFilter>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('all');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [hasMoreOlder, setHasMoreOlder] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [totalLedgerCount, setTotalLedgerCount] = useState<number>(0);

  const logsRef = useRef<SensorLogRow[]>([]);
  logsRef.current = logs;

  const matchesActiveFilter = useCallback(
    (log: SensorLogRow): boolean => {
      if (deviceFilter !== 'all' && log.device_id !== deviceFilter) {
        return false;
      }
      if (sessionFilter !== 'all' && String(log.session_id) !== sessionFilter) {
        return false;
      }
      if (timeRange !== 'all') {
        const ms = Date.parse(log.created_at);
        if (Number.isFinite(ms)) {
          const cutoffMs =
            timeRange === '1h'
              ? 3600 * 1000
              : timeRange === '24h'
              ? 24 * 3600 * 1000
              : 7 * 24 * 3600 * 1000;
          if (Date.now() - ms > cutoffMs) return false;
        }
      }

      const evaluation = evaluateTelemetrySafety(log, { checkCloudAge: false });
      if (filterState === 'alerts') {
        return evaluation.status !== 'NORMAL';
      }
      if (filterState === 'normal') {
        return evaluation.status === 'NORMAL';
      }
      return true;
    },
    [filterState, timeRange, sessionFilter, deviceFilter]
  );

  const buildBaseQuery = useCallback(() => {
    let query = supabase
      .from('sensor_logs')
      .select('*')
      .order('id', { ascending: false })
      .limit(PAGE_SIZE);

    if (deviceFilter !== 'all') {
      query = query.eq('device_id', deviceFilter);
    }

    if (sessionFilter !== 'all') {
      query = query.eq('session_id', Number(sessionFilter));
    }

    if (timeRange !== 'all') {
      const cutoffMs =
        timeRange === '1h'
          ? 3600 * 1000
          : timeRange === '24h'
          ? 24 * 3600 * 1000
          : 7 * 24 * 3600 * 1000;
      query = query.gte('created_at', new Date(Date.now() - cutoffMs).toISOString());
    }
    return query;
  }, [deviceFilter, sessionFilter, timeRange]);

  const fetchRealLogs = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [{ data, error }, { count, error: countError }] = await Promise.all([
        buildBaseQuery(),
        supabase.from('sensor_logs').select('id', { count: 'exact', head: true }),
      ]);

      if (error) {
        setErrorMsg(error.message || 'Failed to query telemetry history from Supabase.');
        return;
      }

      if (!countError && count !== null) {
        setTotalLedgerCount(count);
      }

      const fetched = (data ?? []) as SensorLogRow[];
      setLogs((prev) => mergeHistoryRows(prev.filter(matchesActiveFilter), fetched));
      setHasMoreOlder(fetched.length === PAGE_SIZE);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error reading telemetry history.');
    } finally {
      setIsLoading(false);
    }
  }, [buildBaseQuery, matchesActiveFilter]);

  const loadOlderLogs = async () => {
    const current = logsRef.current;
    if (current.length === 0 || isLoadingOlder) return;
    const oldestId = current[current.length - 1].id;
    setIsLoadingOlder(true);
    setErrorMsg(null);
    try {
      const { data, error } = await buildBaseQuery().lt('id', oldestId);
      if (error) {
        setErrorMsg(error.message || 'Failed to load older records.');
        return;
      }
      const older = (data ?? []) as SensorLogRow[];
      setLogs((prev) => mergeHistoryRows(prev, older));
      setHasMoreOlder(older.length === PAGE_SIZE);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error loading older rows.');
    } finally {
      setIsLoadingOlder(false);
    }
  };

  useEffect(() => {
    setLogs([]);
    fetchRealLogs();

    const uniqueName = `history_sensor_logs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const channel = supabase
      .channel(uniqueName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_logs' }, (payload) => {
        const newLog = payload.new as SensorLogRow;
        setTotalLedgerCount((c) => c + 1);
        setLogs((prev) => mergeHistoryRows(prev, [newLog]));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sensor_logs' }, (payload) => {
        const updatedLog = payload.new as SensorLogRow;
        setLogs((prev) => mergeHistoryRows(prev, [updatedLog]));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRealLogs]);

  const availableSessions = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.session_id))).sort((a, b) => b - a);
  }, [logs]);

  const availableDevices = useMemo(() => {
    const ids = new Set<string>();
    for (const l of logs) {
      if (l.device_id && typeof l.device_id === 'string') ids.add(l.device_id);
    }
    return Array.from(ids).sort();
  }, [logs]);

  const visibleLogs = useMemo(() => {
    return logs.filter(matchesActiveFilter);
  }, [logs, matchesActiveFilter]);

  const incidentTimeline = useMemo(() => {
    return logs
      .filter((r) => {
        const ev = evaluateTelemetrySafety(r, { checkCloudAge: false });
        return ev.status === 'DANGER' || ev.status === 'WARNING' || ev.status === 'SENSOR FAULT';
      })
      .slice(0, 6);
  }, [logs]);

  // Keep Inspector synchronized with active visible filter results
  useEffect(() => {
    if (visibleLogs.length === 0) {
      setSelectedRow(null);
      return;
    }
    if (!selectedRow || !visibleLogs.some((r) => r.id === selectedRow.id)) {
      setSelectedRow(visibleLogs[0]);
    }
  }, [visibleLogs, selectedRow]);

  const handleExportCsv = () => {
    if (visibleLogs.length === 0) return;
    const headers = [
      'id',
      'device_id',
      'created_at',
      'session_id',
      'seq_id',
      'co_ppm',
      'voc_indicator',
      'lpg_ppm',
      'temp_c',
      'humidity_pct',
      'classified_status',
      'co_valid',
      'voc_valid',
      'lpg_valid',
      'dht_valid',
      'nano_online',
      'ze07_online',
      'system_fault',
      'system_degraded',
      'data_age_ms',
    ];
    const rows = visibleLogs.map((r) => {
      const ev = evaluateTelemetrySafety(r, { checkCloudAge: false });
      return [
        r.id,
        r.device_id ?? 'unscoped',
        r.created_at,
        r.session_id,
        r.seq_id,
        r.co_ppm,
        r.voc_ppm,
        r.lpg_ppm,
        r.temp,
        r.hum,
        ev.status,
        r.co_valid ?? 'null',
        r.voc_valid ?? 'null',
        r.lpg_valid ?? 'null',
        r.dht_valid ?? 'null',
        r.nano_online ?? 'null',
        r.ze07_online ?? 'null',
        r.system_fault ?? 'null',
        r.system_degraded ?? 'null',
        r.data_age_ms,
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safebreath-loaded-logs-${filterState}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderValidBadge = (flag: boolean | undefined) => {
    if (flag === true) {
      return <span className="text-[10px] font-semibold text-emerald-700">Valid</span>;
    }
    if (flag === false) {
      return <span className="text-[10px] font-semibold text-rose-700">Fault</span>;
    }
    return <span className="text-[10px] font-semibold text-amber-700">Unknown</span>;
  };

  const formatSubsystemText = (flag: boolean | undefined) => {
    if (flag === true) return 'Online';
    if (flag === false) return 'Offline';
    return 'Unknown';
  };

  const selectedEvaluation = selectedRow
    ? evaluateTelemetrySafety(selectedRow, { checkCloudAge: false })
    : null;

  return (
    <div className="bg-[#F5F5F7] rounded-[28px] border border-black/[0.06] p-5 sm:p-8 space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-black/[0.08]">
        <div className="text-xs font-mono text-[#6E6E73] space-y-1">
          <div>
            Showing <strong className="text-[#1D1D1F] tabular-nums">{visibleLogs.length}</strong>{' '}
            matching rows (from {logs.length} loaded ·{' '}
            <strong className="text-[#1D1D1F] tabular-nums">{totalLedgerCount.toLocaleString()}</strong>{' '}
            total ledger records)
          </div>
          <div className="text-[11px] text-[#86868B]">
            {availableDevices.length > 0
              ? `Multi-device stream active (${availableDevices.length} device_id values detected).`
              : 'Schema currently logs shared node stream (`session_id` tracking); optional `device_id` column supported when populated.'}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-black/[0.08]">
            <button
              type="button"
              onClick={() => setFilterState('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                filterState === 'all' ? 'bg-[#1D1D1F] text-white font-semibold' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterState('alerts')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                filterState === 'alerts' ? 'bg-[#1D1D1F] text-white font-semibold' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Alerts &amp; Faults
            </button>
            <button
              type="button"
              onClick={() => setFilterState('normal')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                filterState === 'normal' ? 'bg-[#1D1D1F] text-white font-semibold' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Verified Normal
            </button>
          </div>

          {/* Time Range Selector */}
          <select
            aria-label="Filter by date range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRangeFilter)}
            className="px-3 py-2 rounded-full border border-black/[0.08] bg-white text-xs font-medium text-[#1D1D1F] cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>

          {/* Device Filter (when device_id column is populated) */}
          {availableDevices.length > 0 && (
            <select
              aria-label="Filter by device ID"
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="px-3 py-2 rounded-full border border-black/[0.08] bg-white text-xs font-mono text-[#1D1D1F] cursor-pointer"
            >
              <option value="all">All Devices</option>
              {availableDevices.map((did) => (
                <option key={did} value={did}>
                  {did}
                </option>
              ))}
            </select>
          )}

          {/* Session Filter */}
          <select
            aria-label="Filter by session ID"
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="px-3 py-2 rounded-full border border-black/[0.08] bg-white text-xs font-mono text-[#1D1D1F] cursor-pointer"
          >
            <option value="all">All Sessions</option>
            {availableSessions.map((sid) => (
              <option key={sid} value={String(sid)}>
                Session #{sid}
              </option>
            ))}
          </select>

          {/* Export Loaded Records */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={visibleLogs.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-black/[0.08] bg-white text-xs font-semibold text-[#1D1D1F] hover:bg-black/5 disabled:opacity-40 transition-colors cursor-pointer"
            title="Export loaded visible Supabase database rows to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Loaded CSV</span>
          </button>

          <button
            type="button"
            onClick={fetchRealLogs}
            disabled={isLoading}
            className="p-2 rounded-full border border-black/[0.08] bg-white text-[#1D1D1F] hover:bg-black/5 transition-colors shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            title="Refresh records"
            aria-label="Refresh records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Explicit Query Error Banner */}
      {errorMsg && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Database query error: {errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={fetchRealLogs}
            className="px-3 py-1.5 rounded-full bg-rose-700 text-white font-semibold hover:bg-rose-800 cursor-pointer"
          >
            Retry Query
          </button>
        </div>
      )}

      {/* Recent Incident Timeline Strip */}
      {incidentTimeline.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.06] p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-[#6E6E73]">
            <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Recent Elevated / Fault Incident Timeline
            </span>
            <span>{incidentTimeline.length} events in loaded window</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {incidentTimeline.map((inc) => {
              const ev = evaluateTelemetrySafety(inc, { checkCloudAge: false });
              return (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => {
                    setFilterState('all');
                    setSelectedRow(inc);
                  }}
                  className="text-left px-3 py-1.5 rounded-xl bg-[#F5F5F7] hover:bg-black/[0.06] border border-black/[0.05] text-[11px] font-mono transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#1D1D1F]">#{inc.id}</span>{' '}
                  <span className="text-[#6E6E73]">{formatUtcAndLocalDateTime(inc.created_at)}</span>{' '}
                  <span className="text-rose-700 font-semibold">· {ev.status}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Table + Row Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 border border-black/[0.06] rounded-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-[#FBFBFD] border-b border-black/[0.06] text-[#6E6E73] text-[11px]">
                <tr>
                  <th className="py-3 px-3.5 font-semibold">ID</th>
                  <th className="py-3 px-3.5 font-semibold">Date &amp; Time</th>
                  <th className="py-3 px-3.5 font-semibold">CO</th>
                  <th className="py-3 px-3.5 font-semibold">VOC ind.</th>
                  <th className="py-3 px-3.5 font-semibold">LPG</th>
                  <th className="py-3 px-3.5 font-semibold">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-[#1D1D1F]">
                {visibleLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#86868B]">
                      {isLoading ? 'Querying telemetry ledger…' : 'No records match the active filter criteria.'}
                    </td>
                  </tr>
                ) : (
                  visibleLogs.map((row) => {
                    const isSelected = selectedRow?.id === row.id;
                    const ev = evaluateTelemetrySafety(row, { checkCloudAge: false });
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedRow(row)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-[#F5F5F7]/70'
                        }`}
                      >
                        <td className="py-2.5 px-3.5 font-bold whitespace-nowrap tabular-nums">
                          #{row.id}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#6E6E73] whitespace-nowrap tabular-nums">
                          {formatUtcAndLocalDateTime(row.created_at)}
                        </td>
                        <td className="py-2.5 px-3.5 tabular-nums">{row.co_ppm}</td>
                        <td className="py-2.5 px-3.5 tabular-nums">{row.voc_ppm}</td>
                        <td className="py-2.5 px-3.5 tabular-nums">{row.lpg_ppm}</td>
                        <td className="py-2.5 px-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border whitespace-nowrap ${getSafetyBadgeClasses(ev.status)}`}>
                            {ev.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {hasMoreOlder && logs.length > 0 && (
            <div className="p-3 bg-[#FBFBFD] border-t border-black/[0.06] flex justify-center">
              <button
                type="button"
                onClick={loadOlderLogs}
                disabled={isLoading || isLoadingOlder}
                className="px-4 py-1.5 rounded-full bg-white border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] hover:bg-black/5 cursor-pointer disabled:opacity-50"
              >
                {isLoadingOlder ? 'Loading Older Page…' : 'Load Older Records (+50 Cursor)'}
              </button>
            </div>
          )}
        </div>

        {/* Row Inspector */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-black/[0.06] p-6 space-y-5">
          {selectedRow && selectedEvaluation ? (
            <>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-black/[0.06]">
                <div>
                  <span className="text-xs font-mono text-[#6E6E73] block">
                    Record #{selectedRow.id} · Seq #{selectedRow.seq_id} · Node {selectedRow.device_id || 'Unscoped'}
                  </span>
                  <div className="text-sm font-bold text-[#1D1D1F] mt-0.5">
                    {formatUtcAndLocalDateTime(selectedRow.created_at)}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono border shrink-0 ${getSafetyBadgeClasses(selectedEvaluation.status)}`}>
                  {selectedEvaluation.status}
                </span>
              </div>

              <div className="text-xs text-[#6E6E73] bg-[#F5F5F7] rounded-xl px-3.5 py-2.5 border border-black/[0.04]">
                {selectedEvaluation.reason}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04]">
                  <span className="text-[10px] text-[#6E6E73] block">CO</span>
                  <span className="text-base font-bold text-[#1D1D1F] mt-0.5 block tabular-nums">
                    {selectedRow.co_ppm} ppm
                  </span>
                  {renderValidBadge(selectedRow.co_valid)}
                </div>

                <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04]">
                  <span className="text-[10px] text-[#6E6E73] block">VOC ind.</span>
                  <span className="text-base font-bold text-[#1D1D1F] mt-0.5 block tabular-nums">
                    {selectedRow.voc_ppm}
                  </span>
                  {renderValidBadge(selectedRow.voc_valid)}
                </div>

                <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04]">
                  <span className="text-[10px] text-[#6E6E73] block">LPG</span>
                  <span className="text-base font-bold text-[#1D1D1F] mt-0.5 block tabular-nums">
                    {selectedRow.lpg_ppm} ppm
                  </span>
                  {renderValidBadge(selectedRow.lpg_valid)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#6E6E73] block">Ambient Temp</span>
                    <span className="text-sm font-bold text-[#1D1D1F] block mt-0.5 tabular-nums">{selectedRow.temp} °C</span>
                  </div>
                  {renderValidBadge(selectedRow.dht_valid)}
                </div>
                <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#6E6E73] block">Humidity</span>
                    <span className="text-sm font-bold text-[#1D1D1F] block mt-0.5 tabular-nums">{selectedRow.hum} %</span>
                  </div>
                  {renderValidBadge(selectedRow.dht_valid)}
                </div>
              </div>

              <div className="pt-3 border-t border-black/[0.06] text-xs font-mono space-y-2 text-[#6E6E73]">
                <div className="flex justify-between">
                  <span>Session / Dev Seq</span>
                  <span className="font-bold text-[#1D1D1F] tabular-nums">
                    #{selectedRow.session_id} / #{selectedRow.dev_seq_id || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Data Age / Uptime</span>
                  <span className="text-[#1D1D1F] tabular-nums">
                    {selectedRow.data_age_ms ?? '—'} ms / {Math.floor((selectedRow.uptime_ms || 0) / 1000)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Alarm / Fault / Degraded</span>
                  <span className="text-[#1D1D1F]">
                    {selectedRow.system_alarm ? 'Alarm' : 'No'} · {selectedRow.system_fault === true ? 'Fault' : selectedRow.system_fault === false ? 'No' : 'Unknown'} · {selectedRow.system_degraded ? 'Degraded' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Event Loss / Dropped</span>
                  <span className="text-[#1D1D1F] tabular-nums">
                    {selectedRow.ev_loss ? 'Yes' : 'No'} ({selectedRow.dropped_events ?? 0})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Controllers</span>
                  <span className="text-[#1D1D1F]">
                    Nano: {formatSubsystemText(selectedRow.nano_online)} · ZE07: {formatSubsystemText(selectedRow.ze07_online)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-[#86868B] text-xs">
              Select any log entry to inspect device telemetry details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
