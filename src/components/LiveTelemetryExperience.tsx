import React from 'react';
import {
  Activity,
  Flame,
  Wind,
  Thermometer,
  Droplets,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Cpu,
} from 'lucide-react';
import { useLiveTelemetry, LiveTelemetryState } from '../lib/useLiveTelemetry';
import {
  evaluateTelemetrySafety,
  formatUtcAndLocalDateTime,
  getSafetyBadgeClasses,
} from '../lib/safetyConfig';

interface LiveTelemetryExperienceProps {
  telemetry?: LiveTelemetryState;
}

export const LiveTelemetryExperience: React.FC<LiveTelemetryExperienceProps> = ({
  telemetry,
}) => {
  const internalTelemetry = useLiveTelemetry();
  const activeTelemetry = telemetry ?? internalTelemetry;

  const {
    currentLog,
    historyLogs,
    isLoading,
    isRefreshing,
    error,
    lastFetchedAt,
    lastReceivedAt,
    cloudCreatedAt,
    hasTrueSampleTimestamp,
    availableDeviceIds,
    activeDeviceFilter,
    setActiveDeviceFilter,
    isRealtimeConnected,
    refresh,
  } = activeTelemetry;

  const evaluation = evaluateTelemetrySafety(currentLog, { checkCloudAge: true });
  const hasData = Boolean(currentLog);

  const getChannelBadge = (
    stateVal: number | undefined,
    validFlag: boolean | undefined,
    hasRow: boolean
  ) => {
    if (!hasRow) {
      return {
        label: isLoading ? 'Loading' : 'Unknown',
        textClass: 'text-[#6E6E73] bg-[#F5F5F7] border-black/[0.08] font-medium',
      };
    }
    if (validFlag === false) {
      return {
        label: 'Fault',
        textClass: 'text-rose-800 bg-rose-50 border-rose-300 font-semibold',
      };
    }
    if (validFlag !== true) {
      return {
        label: 'Unknown',
        textClass: 'text-amber-900 bg-amber-50/70 border-amber-200 font-semibold',
      };
    }
    if (evaluation.isStale) {
      return {
        label: 'Stale',
        textClass: 'text-amber-800 bg-amber-50 border-amber-300 font-semibold',
      };
    }
    switch (stateVal) {
      case 2:
        return {
          label: 'Danger',
          textClass: 'text-rose-700 bg-rose-50 border-rose-200 font-semibold',
        };
      case 1:
        return {
          label: 'Warning',
          textClass: 'text-amber-700 bg-amber-50 border-amber-200 font-semibold',
        };
      case 0:
        return {
          label: 'Normal',
          textClass: 'text-emerald-700 bg-emerald-50 border-emerald-200 font-medium',
        };
      default:
        return {
          label: 'Unknown',
          textClass: 'text-amber-900 bg-amber-50/70 border-amber-200 font-semibold',
        };
    }
  };

  const renderValidityChip = (validFlag: boolean | undefined) => {
    if (!currentLog) {
      return <span className="font-mono text-[10px] font-semibold text-[#86868B]">Pending</span>;
    }
    if (validFlag === true) {
      return <span className="font-mono text-[10px] font-semibold text-emerald-700">Valid</span>;
    }
    if (validFlag === false) {
      return <span className="font-mono text-[10px] font-semibold text-rose-700">Fault</span>;
    }
    return <span className="font-mono text-[10px] font-semibold text-amber-700">Unknown</span>;
  };

  const renderSubsystemLabel = (flag: boolean | undefined) => {
    if (!currentLog) return <strong className="text-[#6E6E73]">—</strong>;
    if (flag === true) return <strong className="text-emerald-700">Online</strong>;
    if (flag === false) return <strong className="text-rose-700">Offline</strong>;
    return <strong className="text-amber-700">Unknown</strong>;
  };

  const renderAreaChart = (
    id: string,
    data: number[],
    color: string,
    minScale: number,
    maxScale: number
  ) => {
    if (isLoading && data.length === 0) {
      return <div className="h-14 rounded-lg bg-[#F5F5F7] animate-pulse" aria-label="Loading chart" />;
    }

    if (!data || data.length === 0) {
      return (
        <div className="h-14 text-[#86868B] text-xs flex items-center">
          No telemetry samples yet
        </div>
      );
    }

    const width = 220;
    const height = 56;
    const effectiveMin = Math.min(minScale, ...data);
    const effectiveMax = Math.max(maxScale, ...data);
    const range = effectiveMax - effectiveMin || 1;

    const coords = data.map((val, idx) => {
      const x = data.length > 1 ? (idx / (data.length - 1)) * width : width / 2;
      const normalizedY = (val - effectiveMin) / range;
      const y = height - (normalizedY * (height - 12) + 6);
      return { x, y };
    });

    const linePoints = coords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPath =
      coords.length > 1
        ? `M ${coords[0].x.toFixed(1)},${height} ` +
          coords.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
          ` L ${coords[coords.length - 1].x.toFixed(1)},${height} Z`
        : '';

    const last = coords[coords.length - 1];

    return (
      <svg className="w-full h-14 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill={`url(#grad-${id})`} />}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={linePoints}
        />
        <circle cx={last.x} cy={last.y} r="3.5" fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
    );
  };

  const coData = historyLogs.map((l) => Number(l.co_ppm) || 0);
  const vocData = historyLogs.map((l) => Number(l.voc_ppm) || 0);
  const lpgData = historyLogs.map((l) => Number(l.lpg_ppm) || 0);

  const coState = getChannelBadge(currentLog?.state_co, currentLog?.co_valid, hasData);
  const vocState = getChannelBadge(currentLog?.state_voc, currentLog?.voc_valid, hasData);
  const lpgState = getChannelBadge(currentLog?.state_lpg, currentLog?.lpg_valid, hasData);

  const formattedLastFetch = lastFetchedAt ? lastFetchedAt.toLocaleTimeString() : 'Pending';
  const formattedLastReceived = lastReceivedAt ? lastReceivedAt.toLocaleTimeString() : 'Pending';
  const formattedCloudTimestamp = cloudCreatedAt
    ? formatUtcAndLocalDateTime(cloudCreatedAt.toISOString())
    : '—';

  const renderMetricValue = (val: number | undefined) => {
    if (isLoading && !currentLog) {
      return (
        <span className="inline-block h-9 w-20 rounded-lg bg-[#F5F5F7] animate-pulse align-middle" />
      );
    }
    if (val === undefined || val === null || !Number.isFinite(val)) {
      return '—';
    }
    return val;
  };

  return (
    <div className="bg-[#F5F5F7] rounded-[28px] border border-black/[0.06] p-5 sm:p-8 space-y-5">
      {/* Live Cloud Stream & Fail-Safe Status Bar */}
      <div className="rounded-2xl bg-white border border-black/[0.06] px-5 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          {evaluation.status === 'NORMAL' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          ) : evaluation.status === 'STALE' ? (
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          ) : (
            <ShieldAlert
              className={`w-5 h-5 shrink-0 mt-0.5 sm:mt-0 ${
                evaluation.status === 'DANGER' || evaluation.status === 'SENSOR FAULT'
                  ? 'text-rose-600'
                  : 'text-amber-600'
              }`}
            />
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                  isLoading && !currentLog
                    ? 'bg-[#F5F5F7] text-[#6E6E73] border-black/[0.08]'
                    : getSafetyBadgeClasses(evaluation.status)
                }`}
              >
                {isLoading && !currentLog ? 'Syncing Telemetry…' : evaluation.headline}
              </span>
              <span className="text-[11px] font-mono text-[#6E6E73]">
                {error
                  ? 'Stream error'
                  : isRealtimeConnected
                  ? 'Supabase Realtime Active'
                  : 'Fallback Polling Active'}
              </span>
            </div>
            <div className="text-xs text-[#6E6E73] mt-1">
              {isLoading && !currentLog
                ? 'Establishing Supabase Realtime subscription to public.sensor_logs…'
                : evaluation.reason}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-mono text-[#6E6E73] tabular-nums">
          {availableDeviceIds.length > 0 ? (
            <label className="inline-flex items-center gap-1.5 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-[#6E6E73]" />
              <select
                aria-label="Filter live stream by hardware device ID"
                value={activeDeviceFilter}
                onChange={(e) => setActiveDeviceFilter(e.target.value)}
                className="px-2.5 py-1 rounded-full border border-black/[0.08] bg-[#F5F5F7] text-[#1D1D1F] font-mono text-[11px] cursor-pointer"
              >
                <option value="all">All Devices</option>
                {availableDeviceIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-[#86868B]" />
              <span>Node: <strong className="text-[#1D1D1F]">{currentLog?.device_id || 'Unscoped Single-Node'}</strong></span>
            </span>
          )}

          <span className="text-black/15" aria-hidden="true">/</span>
          <span>
            Record <strong className="text-[#1D1D1F]">{currentLog ? `#${currentLog.id}` : '—'}</strong>
          </span>
          <span className="text-black/15" aria-hidden="true">/</span>
          <span>
            Packet <strong className="text-[#1D1D1F]">{currentLog ? `#${currentLog.seq_id}` : '—'}</strong>
          </span>
          <span className="hidden md:inline text-black/15" aria-hidden="true">/</span>
          <span className="hidden md:inline">
            Session <strong className="text-[#1D1D1F]">{currentLog ? `#${currentLog.session_id}` : '—'}</strong>
          </span>

          <button
            type="button"
            onClick={refresh}
            disabled={isLoading || isRefreshing}
            className="ml-auto sm:ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.06] text-[#1D1D1F] font-sans font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Refresh telemetry stream"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading || isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Explicit Error Notice (if query failed) */}
      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="px-3 py-1.5 rounded-full bg-rose-700 text-white font-semibold hover:bg-rose-800 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* 5-Channel Crisp Instrumentation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* CO */}
        <div className="rounded-2xl bg-white border border-black/[0.06] p-5 flex flex-col justify-between space-y-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
                <Wind className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                Carbon Monoxide
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${coState.textClass}`}>
                {coState.label}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1D1D1F] tabular-nums tracking-tight">
                {renderMetricValue(currentLog?.co_ppm)}{' '}
                <span className="text-xs font-sans text-[#6E6E73] font-normal">ppm</span>
              </div>
              <div className="text-[11px] text-[#6E6E73] mt-1.5 flex items-center justify-between">
                <span>ZE07-CO (T90 &le;60s)</span>
                {renderValidityChip(currentLog?.co_valid)}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/[0.06]">
            {renderAreaChart('co', coData, '#0284c7', 0, 35)}
            <div className="flex justify-between text-[10px] font-mono text-[#86868B] mt-1.5">
              <span>Warn &gt; 35</span>
              <span>Danger &gt; 70</span>
            </div>
          </div>
        </div>

        {/* VOC Broadband Air Quality Indicator */}
        <div className="rounded-2xl bg-white border border-black/[0.06] p-5 flex flex-col justify-between space-y-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
                <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Air Quality / VOC
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${vocState.textClass}`}>
                {vocState.label}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1D1D1F] tabular-nums tracking-tight">
                {renderMetricValue(currentLog?.voc_ppm)}{' '}
                <span className="text-xs font-sans text-[#6E6E73] font-normal">ind.</span>
              </div>
              <div className="text-[11px] text-[#6E6E73] mt-1.5 flex items-center justify-between">
                <span>MQ-135 Broad-Resp.</span>
                {renderValidityChip(currentLog?.voc_valid)}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/[0.06]">
            {renderAreaChart('voc', vocData, '#059669', 0, 200)}
            <div className="flex justify-between text-[10px] font-mono text-[#86868B] mt-1.5">
              <span>Warn &gt; 200</span>
              <span>Danger &gt; 400</span>
            </div>
          </div>
        </div>

        {/* LPG */}
        <div className="rounded-2xl bg-white border border-black/[0.06] p-5 flex flex-col justify-between space-y-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
                <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                LPG Gas
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${lpgState.textClass}`}>
                {lpgState.label}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1D1D1F] tabular-nums tracking-tight">
                {renderMetricValue(currentLog?.lpg_ppm)}{' '}
                <span className="text-xs font-sans text-[#6E6E73] font-normal">ppm</span>
              </div>
              <div className="text-[11px] text-[#6E6E73] mt-1.5 flex items-center justify-between">
                <span>MQ-6 Propane/LPG</span>
                {renderValidityChip(currentLog?.lpg_valid)}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/[0.06]">
            {renderAreaChart('lpg', lpgData, '#d97706', 0, 500)}
            <div className="flex justify-between text-[10px] font-mono text-[#86868B] mt-1.5">
              <span>Warn &gt; 500</span>
              <span>Danger &gt; 1500</span>
            </div>
          </div>
        </div>

        {/* Ambient Temperature */}
        <div className="rounded-2xl bg-white border border-black/[0.06] p-5 flex flex-col justify-between space-y-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
                <Thermometer className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                Ambient Temp
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${
                  !currentLog
                    ? 'bg-[#F5F5F7] text-[#6E6E73] border-black/[0.08] font-medium'
                    : currentLog.dht_valid === false
                    ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                    : currentLog.dht_valid !== true
                    ? 'bg-amber-50/70 text-amber-900 border-amber-200 font-semibold'
                    : evaluation.isStale
                    ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                    : currentLog.temp >= 45
                    ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                    : currentLog.temp >= 40
                    ? 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
                    : 'bg-[#F5F5F7] text-[#6E6E73] border-black/[0.06] font-medium'
                }`}
              >
                {!currentLog
                  ? isLoading
                    ? 'Loading'
                    : 'Unknown'
                  : currentLog.dht_valid === false
                  ? 'Fault'
                  : currentLog.dht_valid !== true
                  ? 'Unknown'
                  : evaluation.isStale
                  ? 'Stale'
                  : currentLog.temp >= 45
                  ? 'High Heat'
                  : currentLog.temp >= 40
                  ? 'Elevated'
                  : 'Nominal'}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1D1D1F] tabular-nums tracking-tight">
                {renderMetricValue(currentLog?.temp)}{' '}
                <span className="text-xs font-sans text-[#6E6E73] font-normal">°C</span>
              </div>
              <div className="text-[11px] text-[#6E6E73] mt-1.5 flex items-center justify-between">
                <span>DHT11 (±2 °C)</span>
                {renderValidityChip(currentLog?.dht_valid)}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/[0.06] text-xs font-mono text-[#6E6E73] space-y-1.5">
            <div className="flex justify-between">
              <span>High Heat Alert</span>
              <span className="font-semibold text-[#1D1D1F]">&ge; 45.0 °C</span>
            </div>
            <div className="flex justify-between">
              <span>Clear Band</span>
              <span className="font-semibold text-[#1D1D1F]">&lt; 40.0 °C</span>
            </div>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="rounded-2xl bg-white border border-black/[0.06] p-5 flex flex-col justify-between space-y-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
                <Droplets className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                Humidity
              </span>
              <span
                className={`font-medium px-2 py-0.5 rounded-full border text-[11px] shrink-0 ${
                  !currentLog
                    ? 'bg-[#F5F5F7] text-[#6E6E73] border-black/[0.08]'
                    : currentLog.dht_valid === false
                    ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                    : currentLog.dht_valid !== true
                    ? 'bg-amber-50/70 text-amber-900 border-amber-200 font-semibold'
                    : evaluation.isStale
                    ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                    : 'text-emerald-700 border-emerald-200 bg-emerald-50'
                }`}
              >
                {!currentLog
                  ? isLoading
                    ? 'Loading'
                    : 'Unknown'
                  : currentLog.dht_valid === false
                  ? 'Fault'
                  : currentLog.dht_valid !== true
                  ? 'Unknown'
                  : evaluation.isStale
                  ? 'Stale'
                  : 'Valid'}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#1D1D1F] tabular-nums tracking-tight">
                {renderMetricValue(currentLog?.hum)}{' '}
                <span className="text-xs font-sans text-[#6E6E73] font-normal">%</span>
              </div>
              <div className="text-[11px] text-[#6E6E73] mt-1.5 flex items-center justify-between">
                <span>DHT11 RH (±5 %)</span>
                {renderValidityChip(currentLog?.dht_valid)}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/[0.06] text-xs font-mono text-[#6E6E73] space-y-1.5">
            <div className="flex justify-between">
              <span>Event Loss</span>
              <span
                className={`font-semibold ${
                  !currentLog
                    ? 'text-[#6E6E73]'
                    : currentLog.ev_loss || (currentLog.dropped_events ?? 0) > 0
                    ? 'text-amber-700'
                    : 'text-[#1D1D1F]'
                }`}
              >
                {!currentLog ? '—' : `${currentLog.dropped_events ?? 0} dropped`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Overall State</span>
              <span className="font-semibold text-[#1D1D1F]">{evaluation.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Diagnostics & Honest Separated Timestamps */}
      <div className="px-5 py-3.5 rounded-2xl bg-white border border-black/[0.06] text-xs font-mono text-[#6E6E73] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <span>
            Nano: {renderSubsystemLabel(currentLog?.nano_online)}
          </span>
          <span>
            ZE07-CO: {renderSubsystemLabel(currentLog?.ze07_online)}
          </span>
          <span>
            Sys Fault:{' '}
            <strong
              className={
                !currentLog
                  ? 'text-[#6E6E73]'
                  : currentLog.system_fault === true
                  ? 'text-rose-700'
                  : currentLog.system_fault === false
                  ? 'text-[#1D1D1F]'
                  : 'text-amber-700'
              }
            >
              {!currentLog
                ? '—'
                : currentLog.system_fault === true
                ? 'Active'
                : currentLog.system_fault === false
                ? 'None'
                : 'Unknown'}
            </strong>
          </span>
          <span>
            Degraded:{' '}
            <strong
              className={
                !currentLog
                  ? 'text-[#6E6E73]'
                  : currentLog.system_degraded === true
                  ? 'text-amber-700'
                  : 'text-[#1D1D1F]'
              }
            >
              {!currentLog ? '—' : currentLog.system_degraded ? 'Yes' : 'No'}
            </strong>
          </span>
          <span>
            Data Age:{' '}
            <strong
              className={`tabular-nums ${
                !currentLog || typeof currentLog.data_age_ms !== 'number'
                  ? 'text-amber-700'
                  : currentLog.data_age_ms > 15000
                  ? 'text-amber-700'
                  : 'text-[#1D1D1F]'
              }`}
            >
              {currentLog && typeof currentLog.data_age_ms === 'number' ? `${currentLog.data_age_ms} ms` : '—'}
            </strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#6E6E73] text-[11px] tabular-nums">
          <span>
            {hasTrueSampleTimestamp ? 'Hardware Sampled' : 'Cloud Insert'}:{' '}
            <strong className="text-[#1D1D1F]">{formattedCloudTimestamp}</strong>
          </span>
          <span>
            Realtime Recv: <strong className="text-[#1D1D1F]">{formattedLastReceived}</strong>
          </span>
          <span>
            Last DB Fetch: <strong className="text-[#1D1D1F]">{formattedLastFetch}</strong>
          </span>
          <span>
            Dual-CT: <strong className="text-[#6E6E73]">Experimental (Schema Pending)</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
