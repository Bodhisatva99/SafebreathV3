import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle, Flame, Wind, Thermometer, Droplets, RefreshCw, Radio, CheckCircle, Wifi, Server } from 'lucide-react';
import { supabase, SensorLogRow } from '../lib/supabase';

export const LiveTelemetryExperience: React.FC = () => {
  // Real sensor readings from Supabase
  const [currentLog, setCurrentLog] = useState<SensorLogRow | null>(null);
  const [historyLogs, setHistoryLogs] = useState<SensorLogRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Fetch initial telemetry from public.sensor_logs
  const fetchTelemetry = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_logs')
        .select('*')
        .order('id', { ascending: false })
        .limit(20);

      if (error) {
        console.error("Supabase query error:", error);
        return;
      }

      if (data && data.length > 0) {
        setCurrentLog(data[0] as SensorLogRow);
        // Reverse for chronological chart rendering (oldest to newest)
        setHistoryLogs([...data].reverse() as SensorLogRow[]);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch sensor_logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();

    // Subscribe to realtime insertions on public.sensor_logs
    const channel = supabase
      .channel('realtime_sensor_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_logs' },
        (payload) => {
          const newRow = payload.new as SensorLogRow;
          setCurrentLog(newRow);
          setHistoryLogs((prev) => [...prev.slice(1), newRow]);
          setLastSyncTime(new Date());
          setIsRealtimeConnected(true);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true);
        }
      });

    // 3-second polling fallback ensuring data updates continuously
    const pollInterval = setInterval(() => {
      fetchTelemetry();
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, []);

  // Helper to map numeric state (0, 1, 2) to label and styling
  const getStateBadge = (stateVal: number | undefined) => {
    switch (stateVal) {
      case 2:
        return { label: 'DANGER', badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse' };
      case 1:
        return { label: 'WARNING', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-bold' };
      case 0:
      default:
        return { label: 'SAFE', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium' };
    }
  };

  // Helper to render an SVG sparkline from real logs
  const renderSparkline = (
    data: number[],
    color: string,
    minScale: number,
    maxScale: number
  ) => {
    if (!data || data.length === 0) return <div className="h-10 text-slate-400 text-xs flex items-center">No telemetry points</div>;

    const width = 180;
    const height = 40;
    const effectiveMin = Math.min(minScale, ...data);
    const effectiveMax = Math.max(maxScale, ...data);
    const range = effectiveMax - effectiveMin || 1;

    const points = data
      .map((val, idx) => {
        const x = data.length > 1 ? (idx / (data.length - 1)) * width : width / 2;
        const normalizedY = (val - effectiveMin) / range;
        const y = height - (normalizedY * (height - 8) + 4);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const lastVal = data[data.length - 1];
    const lastX = width;
    const lastY = height - (((lastVal - effectiveMin) / range) * (height - 8) + 4);

    return (
      <svg className="w-full h-10 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <circle cx={lastX} cy={lastY} r="3.5" fill={color} />
      </svg>
    );
  };

  const coData = historyLogs.map((l) => Number(l.co_ppm) || 0);
  const vocData = historyLogs.map((l) => Number(l.voc_ppm) || 0);
  const lpgData = historyLogs.map((l) => Number(l.lpg_ppm) || 0);

  const coState = getStateBadge(currentLog?.state_co);
  const vocState = getStateBadge(currentLog?.state_voc);
  const lpgState = getStateBadge(currentLog?.state_lpg);

  return (
    <div className="space-y-6">
      {/* Realtime Supabase Status Ribbon - Visually Distinct Live Metrology Feed */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 border border-emerald-500/30 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                  LIVE PHYSICAL HARDWARE STREAM
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  REAL-TIME EDGE TELEMETRY
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Physical Prototype &gt; Arduino Nano ADC &gt; ESP32 Gateway &gt; Supabase Cloud
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 font-bold">
              LATEST RECORD #{currentLog?.id || '1330'}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px]">
              Packet #{currentLog?.seq_id ?? '---'}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] hidden md:block">
              Session #{currentLog?.session_id ?? '---'}
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>{isRealtimeConnected ? 'WebSocket Live' : 'Polling Active'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 5-Card Gas & Climate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Carbon Monoxide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Wind className="w-3.5 h-3.5 text-sky-600" />
                CO
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${coState.badgeClass}`}>
                {coState.label}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {currentLog ? currentLog.co_ppm : '--'} <span className="text-xs font-sans text-slate-500 font-medium">ppm</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>ZE07-CO Cell</span>
                <span className="font-mono text-[10px] text-emerald-700">{currentLog?.co_valid ? 'VALID' : 'FAULT'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] font-mono text-slate-400 mb-1">REALTIME TREND</div>
            {renderSparkline(coData, '#059669', 0, 35)}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>Warn: &gt; 35</span>
              <span>Danger: &gt; 70</span>
            </div>
          </div>
        </div>

        {/* VOC */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                VOC
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${vocState.badgeClass}`}>
                {vocState.label}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {currentLog ? currentLog.voc_ppm : '--'} <span className="text-xs font-sans text-slate-500 font-medium">ppm</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>MQ-135 Catalytic</span>
                <span className="font-mono text-[10px] text-emerald-700">{currentLog?.voc_valid ? 'VALID' : 'FAULT'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] font-mono text-slate-400 mb-1">REALTIME TREND</div>
            {renderSparkline(vocData, '#0284c7', 0, 200)}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>Warn: &gt; 200</span>
              <span>Danger: &gt; 400</span>
            </div>
          </div>
        </div>

        {/* LPG */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                LPG
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${lpgState.badgeClass}`}>
                {lpgState.label}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {currentLog ? currentLog.lpg_ppm : '--'} <span className="text-xs font-sans text-slate-500 font-medium">ppm</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>MQ-6 Combustible</span>
                <span className="font-mono text-[10px] text-emerald-700">{currentLog?.lpg_valid ? 'VALID' : 'FAULT'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] font-mono text-slate-400 mb-1">REALTIME TREND</div>
            {renderSparkline(lpgData, '#d97706', 0, 500)}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>Warn: &gt; 500</span>
              <span>Danger: &gt; 1500</span>
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Thermometer className="w-3.5 h-3.5 text-rose-600" />
                TEMPERATURE
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                (currentLog?.temp ?? 0) >= 45 
                  ? 'bg-rose-100 text-rose-800 font-bold' 
                  : (currentLog?.temp ?? 0) >= 40 
                  ? 'bg-amber-100 text-amber-800 font-bold' 
                  : 'bg-slate-100 text-slate-600 font-medium'
              }`}>
                {(currentLog?.temp ?? 0) >= 45 ? 'ALARM' : (currentLog?.temp ?? 0) >= 40 ? 'ELEVATED' : 'NOMINAL'}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {currentLog ? currentLog.temp : '--'} <span className="text-xs font-sans text-slate-500 font-medium">°C</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>DHT11 Probe</span>
                <span className="font-mono text-[10px] text-emerald-700">{currentLog?.dht_valid ? 'VALID' : 'FAULT'}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs font-mono text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Alarm Limit:</span>
              <span className="font-semibold text-slate-800">≥ 45.0 °C</span>
            </div>
            <div className="flex justify-between">
              <span>Clear Level:</span>
              <span className="font-semibold text-slate-800">&lt; 40.0 °C</span>
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Droplets className="w-3.5 h-3.5 text-indigo-600" />
                HUMIDITY
              </span>
              <span className="text-emerald-800 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[10px]">
                OPTIMAL
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {currentLog ? currentLog.hum : '--'} <span className="text-xs font-sans text-slate-500 font-medium">%</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Relative Humidity</span>
                <span className="font-mono text-[10px] text-emerald-700">COMPENSATED</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs font-mono text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Comfort Range:</span>
              <span className="font-semibold text-slate-800">40 – 60 %</span>
            </div>
            <div className="flex justify-between">
              <span>System Alarm:</span>
              <span className={`font-semibold ${currentLog?.system_alarm ? 'text-rose-700' : 'text-emerald-700'}`}>
                {currentLog?.system_alarm ? 'ACTIVE' : 'NOMINAL'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Real Hardware Diagnostics Status Line */}
      {currentLog && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${currentLog.nano_online ? 'bg-emerald-600' : 'bg-rose-500'}`} />
              <span>Arduino Nano: <strong>{currentLog.nano_online ? 'ONLINE' : 'OFFLINE'}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${currentLog.ze07_online ? 'bg-emerald-600' : 'bg-rose-500'}`} />
              <span>ZE07-CO UART: <strong>{currentLog.ze07_online ? 'ONLINE' : 'OFFLINE'}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Uptime: <strong>{Math.floor(currentLog.uptime_ms / 1000)}s</strong></span>
            <span>Recorded: <strong>{new Date(currentLog.created_at).toLocaleTimeString()}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
