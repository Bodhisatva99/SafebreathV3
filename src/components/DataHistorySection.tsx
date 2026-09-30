import React, { useState, useEffect } from 'react';
import { Database, Filter, RefreshCw, CheckCircle2, AlertTriangle, ShieldAlert, Clock, ArrowUpDown } from 'lucide-react';
import { supabase, SensorLogRow } from '../lib/supabase';

export const DataHistorySection: React.FC = () => {
  const [logs, setLogs] = useState<SensorLogRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<SensorLogRow | null>(null);
  const [filterState, setFilterState] = useState<'all' | 'alerts' | 'safe'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchRealLogs = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('sensor_logs')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .limit(30);

      if (filterState === 'alerts') {
        query = query.or('alert_flag.eq.true,system_alarm.eq.true,state_co.gt.0,state_voc.gt.0,state_lpg.gt.0');
      } else if (filterState === 'safe') {
        query = query.eq('alert_flag', false).eq('system_alarm', false);
      }

      const { data, count, error } = await query;
      if (error) {
        console.error("Error fetching logs:", error);
        return;
      }

      if (data) {
        setLogs(data as SensorLogRow[]);
        if (data.length > 0 && !selectedRow) {
          setSelectedRow(data[0] as SensorLogRow);
        }
      }
      if (count !== null) {
        setTotalCount(count);
      }
    } catch (err) {
      console.error("Failed to query sensor_logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealLogs();

    // Subscribe to new rows
    const channel = supabase
      .channel('history_sensor_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_logs' }, (payload) => {
        const newLog = payload.new as SensorLogRow;
        setLogs(prev => [newLog, ...prev.slice(0, 29)]);
        setTotalCount(c => c + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterState]);

  const getStateBadge = (log: SensorLogRow) => {
    if (log.system_alarm || log.alert_flag || log.state_co === 2 || log.state_voc === 2 || log.state_lpg === 2) {
      return { label: 'DANGER', badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' };
    }
    if (log.state_co === 1 || log.state_voc === 1 || log.state_lpg === 1 || log.temp >= 40) {
      return { label: 'WARNING', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-bold' };
    }
    return { label: 'SAFE', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium' };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-800 font-semibold uppercase tracking-wider mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>AUTHENTIC DATABASE TELEMETRY LEDGER</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Historical Telemetry & Alert History
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Querying authentic historical records directly from <code>public.sensor_logs</code> on Supabase, ordered newest to oldest.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilterState('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterState === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Logs
            </button>
            <button
              onClick={() => setFilterState('alerts')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterState === 'alerts' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alerts & Warnings
            </button>
            <button
              onClick={() => setFilterState('safe')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterState === 'safe' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nominal Only
            </button>
          </div>

          <button
            onClick={fetchRealLogs}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0"
            title="Refresh database records"
            aria-label="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Real Logs Table (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-50/60 rounded-2xl border border-slate-200 overflow-hidden space-y-2 p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-2 px-1">
            <span>SHOWING LAST {logs.length} RECORDS</span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">TOTAL RECORDED: {totalCount}</span>
              <span className="sm:hidden text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">← Swipe Table →</span>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[380px] overflow-y-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-600 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Record ID</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">CO (ppm)</th>
                  <th className="py-2.5 px-3">VOC (ppm)</th>
                  <th className="py-2.5 px-3">LPG (ppm)</th>
                  <th className="py-2.5 px-3">Packet</th>
                  <th className="py-2.5 px-3">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      {isLoading ? 'Loading records from Supabase...' : 'No records match this filter.'}
                    </td>
                  </tr>
                ) : (
                  logs.map((row) => {
                    const isSelected = selectedRow?.id === row.id;
                    const st = getStateBadge(row);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedRow(row)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/80 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-900 font-bold whitespace-nowrap">
                          #{row.id}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                          {new Date(row.created_at).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums">{row.co_ppm}</td>
                        <td className="py-2.5 px-3 tabular-nums">{row.voc_ppm}</td>
                        <td className="py-2.5 px-3 tabular-nums">{row.lpg_ppm}</td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          pkt #{row.seq_id}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${st.badgeClass}`}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Row Detailed Telemetry Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          {selectedRow ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">RECORD ID #{selectedRow.id}</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {new Date(selectedRow.created_at).toLocaleString()}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono border ${getStateBadge(selectedRow).badgeClass}`}>
                  {getStateBadge(selectedRow).label}
                </span>
              </div>

              {/* Gas Metrics */}
              <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">CO LEVEL</span>
                  <span className="text-base font-bold text-slate-900 mt-0.5 block">{selectedRow.co_ppm} ppm</span>
                  <span className="text-[9px] text-emerald-700">{selectedRow.co_valid ? 'Valid' : 'Fault'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">VOC LEVEL</span>
                  <span className="text-base font-bold text-slate-900 mt-0.5 block">{selectedRow.voc_ppm} ppm</span>
                  <span className="text-[9px] text-emerald-700">{selectedRow.voc_valid ? 'Valid' : 'Fault'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">LPG LEVEL</span>
                  <span className="text-base font-bold text-slate-900 mt-0.5 block">{selectedRow.lpg_ppm} ppm</span>
                  <span className="text-[9px] text-emerald-700">{selectedRow.lpg_valid ? 'Valid' : 'Fault'}</span>
                </div>
              </div>

              {/* Climate & Alarm State */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block">Temperature</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">{selectedRow.temp} °C</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase block">Humidity</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">{selectedRow.hum} %</span>
                </div>
              </div>

              {/* Hardware Diagnostic Ledger */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Session ID:</span>
                  <span className="font-bold text-slate-900">{selectedRow.session_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sequence / Dev Seq:</span>
                  <span className="text-slate-900">#{selectedRow.seq_id} / #{selectedRow.dev_seq_id || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Age / Uptime:</span>
                  <span className="text-slate-900">{selectedRow.data_age_ms}ms / {Math.floor(selectedRow.uptime_ms / 1000)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">System Alarm / Latched:</span>
                  <span className={selectedRow.system_alarm ? 'text-rose-700 font-bold' : 'text-emerald-700'}>
                    {selectedRow.system_alarm ? 'ACTIVE' : 'NO'} / {selectedRow.thermal_latched ? 'YES' : 'NO'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Controllers Online:</span>
                  <span className="text-slate-900">
                    Nano: {selectedRow.nano_online ? 'YES' : 'NO'} · ZE07: {selectedRow.ze07_online ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select a row from the ledger to inspect full telemetry diagnostics.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
