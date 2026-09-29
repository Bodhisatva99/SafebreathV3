import React, { useState } from 'react';
import { PageTab } from '../types';
import { 
  Cloud, 
  Smartphone, 
  Database, 
  HardDrive, 
  Bell, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Server,
  Terminal,
  Activity,
  WifiOff
} from 'lucide-react';
import { DownloadAppButton } from '../components/DownloadAppButton';

interface CloudAndAppPageProps {
  onSelectTab: (tab: PageTab) => void;
}

export const CloudAndAppPage: React.FC<CloudAndAppPageProps> = ({ onSelectTab }) => {
  const [selectedSchema, setSelectedSchema] = useState<'telemetry' | 'alerts' | 'sessions' | 'diagnostics'>('telemetry');

  const schemas = {
    telemetry: {
      table: "telemetry_logs",
      purpose: "High-resolution time-series ingestion of atmospheric conditions every 3 seconds.",
      columns: [
        { name: "id", type: "BIGSERIAL PRIMARY KEY", desc: "Monotonic unique log identifier" },
        { name: "device_id", type: "UUID NOT NULL", desc: "Unique hardware identity (ESP32 MAC address)" },
        { name: "seq_number", type: "BIGINT NOT NULL", desc: "Hardware sequence number for packet loss tracking" },
        { name: "co_ppm", type: "NUMERIC(5,2)", desc: "Carbon monoxide reading from ZE07-CO" },
        { name: "voc_ppm", type: "NUMERIC(6,2)", desc: "Volatile organic compounds from MQ-135" },
        { name: "lpg_ppm", type: "NUMERIC(6,2)", desc: "Combustible LPG reading from MQ-6" },
        { name: "temp_c", type: "NUMERIC(4,2)", desc: "Ambient temperature in Celsius from DHT11" },
        { name: "humidity_pct", type: "NUMERIC(4,2)", desc: "Relative humidity percentage" },
        { name: "safety_state", type: "TEXT CHECK(state IN ('SAFE','WARNING','DANGER'))", desc: "Firmware evaluated safety state" },
        { name: "buzzer_triggered", type: "BOOLEAN", desc: "Acoustic alarm active state" },
        { name: "recorded_at", type: "TIMESTAMPTZ DEFAULT NOW()", desc: "Hardware or edge server timestamp" }
      ]
    },
    alerts: {
      table: "safety_alerts",
      purpose: "Dedicated ledger for hazardous threshold breaches and dispatch records.",
      columns: [
        { name: "alert_id", type: "UUID PRIMARY KEY DEFAULT gen_random_uuid()", desc: "Unique alert GUID" },
        { name: "device_id", type: "UUID NOT NULL", desc: "Target SafeBreath device identifier" },
        { name: "hazard_type", type: "TEXT NOT NULL", desc: "CO_SPIKE | LPG_LEAK | VOC_SURGE | THERMAL_RUNAWAY" },
        { name: "peak_value", type: "NUMERIC(6,2)", desc: "Highest recorded concentration during incident" },
        { name: "fcm_dispatched", type: "BOOLEAN DEFAULT FALSE", desc: "Delivery confirmation from Firebase Cloud Messaging" },
        { name: "acknowledged_by_user", type: "BOOLEAN DEFAULT FALSE", desc: "Companion app occupant clearance confirmation" },
        { name: "duration_seconds", type: "INTEGER", desc: "Time elapsed before concentration returned below hysteresis clear" }
      ]
    },
    sessions: {
      table: "device_sessions",
      purpose: "Tracks hardware boot cycles, warm-up completions, and firmware build revisions.",
      columns: [
        { name: "session_id", type: "BIGSERIAL PRIMARY KEY", desc: "Session ID assigned at boot" },
        { name: "device_mac", type: "TEXT NOT NULL", desc: "Hardware MAC address" },
        { name: "boot_timestamp", type: "TIMESTAMPTZ DEFAULT NOW()", desc: "RTC or NTP boot timestamp" },
        { name: "warmup_completed", type: "BOOLEAN", desc: "MQ preheating cycle completion status (180s)" },
        { name: "firmware_version", type: "TEXT NOT NULL", desc: "Firmware tag (e.g. SafeBreath-ESP32-v1.2.4)" },
        { name: "sd_card_present", type: "BOOLEAN", desc: "Local MicroSD flash card mounted status" }
      ]
    },
    diagnostics: {
      table: "sensor_diagnostics",
      purpose: "Sensor health audit logs, baseline drift tracking, and disconnect flags.",
      columns: [
        { name: "diag_id", type: "BIGSERIAL PRIMARY KEY", desc: "Diagnostic event identifier" },
        { name: "sensor_name", type: "TEXT", desc: "ZE07-CO | MQ-135 | MQ-6 | DHT11" },
        { name: "baseline_adc", type: "NUMERIC(5,2)", desc: "Calculated clean-air baseline resistance ADC" },
        { name: "drift_delta", type: "NUMERIC(5,2)", desc: "Deviation from factory calibration constant" },
        { name: "status_flag", type: "TEXT", desc: "HEALTHY | STALE | OUT_OF_BOUNDS | FAULT" }
      ]
    }
  };

  return (
    <div className="space-y-20 py-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
          Cloud Telemetry & Companion Ecosystem
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cloud Connectivity & Remote Companion App
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          The SafeBreath hardware is the foundation and standalone physical guardian. The cloud functions as the persistent analytical backbone, and the Android companion app acts as the remote human notification terminal.
        </p>
      </div>

      {/* System Relationship Hierarchy */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 space-y-6">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">System Role Definitions</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">The Core Relationship Model</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">The Hardware Core</div>
            <h4 className="text-base font-bold text-white">The Embedded Project</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Carries the sensors, autonomous logic, and physical buzzer. Never depends on the cloud to sound the alarm during an active hazard.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-sky-500/30 bg-sky-950/10 space-y-3">
            <div className="text-xs font-mono text-sky-400 font-bold uppercase">The Physical Alarm</div>
            <h4 className="text-base font-bold text-white">Zero-Latency Siren</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              85 dB piezo buzzer alerting occupants within audible earshot in under 10 milliseconds of a threshold breach.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-indigo-500/30 bg-indigo-950/10 space-y-3">
            <div className="text-xs font-mono text-indigo-400 font-bold uppercase">The Cloud Layer</div>
            <h4 className="text-base font-bold text-white">Supabase Persistence</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provides long-term data logging, queryable incident histories, device fleet telemetry, and dispatch routing.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-950/10 space-y-3">
            <div className="text-xs font-mono text-purple-400 font-bold uppercase">The Android App</div>
            <h4 className="text-base font-bold text-white">Remote Awareness</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Companion mobile client delivering push notifications via FCM, real-time charts, and incident post-mortems for off-site users.
            </p>
          </div>
        </div>
      </section>

      {/* Cloud Persistence & Supabase Schema Explorer */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Cloud Data Model</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Supabase Telemetry & Event Storage</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Stores readings, alert events, sequence counters, and sensor validity for post-incident audits.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg w-fit border border-slate-800">
          <button
            onClick={() => setSelectedSchema('telemetry')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              selectedSchema === 'telemetry' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            telemetry_logs
          </button>
          <button
            onClick={() => setSelectedSchema('alerts')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              selectedSchema === 'alerts' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            safety_alerts
          </button>
          <button
            onClick={() => setSelectedSchema('sessions')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              selectedSchema === 'sessions' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            device_sessions
          </button>
          <button
            onClick={() => setSelectedSchema('diagnostics')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              selectedSchema === 'diagnostics' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            sensor_diagnostics
          </button>
        </div>

        {/* Schema Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden space-y-4 p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">Table: {schemas[selectedSchema].table}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400">PostgreSQL / Supabase</span>
            </div>
            <p className="text-xs text-slate-400">{schemas[selectedSchema].purpose}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Column Name</th>
                  <th className="py-2.5 px-3">Data Type</th>
                  <th className="py-2.5 px-3">Field Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {schemas[selectedSchema].columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/30">
                    <td className="py-2.5 px-3 font-semibold text-emerald-400">{col.name}</td>
                    <td className="py-2.5 px-3 text-sky-300">{col.type}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-xs">{col.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Offline Resilience & Flight Recorder */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded">
              <HardDrive className="w-3.5 h-3.5" />
              <span>OFFLINE FLIGHT RECORDER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Local MicroSD Resilience & Store-and-Forward
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              When internet connectivity drops or power fluctuations knock out residential Wi-Fi, SafeBreath switches into offline black-box flight recorder mode:
            </p>
            
            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Zero Lost Samples:</strong> Continuous FAT32 logging stores every 2-second telemetry sample to local flash memory.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Automatic Store-and-Forward:</strong> The ESP32-CAM queues unacknowledged records; upon Wi-Fi restoration, backlogged records are safely transmitted to Supabase.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Forensic Post-Mortem:</strong> In the event of a fire, explosion, or chemical leak investigation, the physical MicroSD card can be extracted and analyzed directly.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs space-y-3">
            <div className="text-[11px] text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>LOCAL FILE BUFFER</span>
              <span className="text-emerald-400">16GB CLASS 10</span>
            </div>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <div><strong>Format:</strong> FAT32 Circular CSV</div>
              <div><strong>File Naming:</strong> <code>/LOGS/SB_YYYYMMDD.CSV</code></div>
              <div><strong>Write Cycle:</strong> 512-byte buffered sector writes</div>
              <div><strong>Capacity:</strong> &gt; 18 months continuous data retention</div>
            </div>
            <button
              onClick={() => onSelectTab('simulator')}
              className="w-full text-center py-2 rounded bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs transition-colors mt-2"
            >
              Test Live CSV Stream in Simulator →
            </button>
          </div>
        </div>
      </section>

      {/* Companion Android Application Role */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider">Remote Client</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">SafeBreath Companion Android Application</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Android SDK 34 · Jetpack Compose</span>
            <DownloadAppButton variant="hero" />
          </div>
        </div>

        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          The SafeBreath mobile app is designed strictly as a remote monitoring interface and push alert receiver. It does not replace the hardware detector, but bridges critical telemetry to property managers, homeowners, and safety personnel when they are off-site.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Bell className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Firebase Cloud Messaging</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-priority push channels bypass system battery optimizations to deliver audio alarms on user phones during active hazards.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Real-Time Atmosphere Gauges</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Streams live CO, VOC, and LPG PPM levels with animated gauges and instantaneous status transitions matching the physical OLED.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Server className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Historical Incident Trends</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Allows users to zoom into previous days or hours to diagnose gas buildup curves, heater anomalies, or periodic ventilation failures.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
