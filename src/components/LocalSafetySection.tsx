import React from 'react';
import { Volume2, Smartphone, Wifi, WifiOff, ShieldCheck, CheckCircle2, ArrowRight, Zap, BellRing } from 'lucide-react';

export const LocalSafetySection: React.FC = () => {
  return (
    <div className="bg-slate-900 rounded-3xl text-white p-8 sm:p-12 lg:p-16 space-y-12 relative overflow-hidden">
      {/* Decorative engineering subtle background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Core Engineering Principle</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          "The internet should never be the only thing standing between a sensor and a local alarm."
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Cloud notifications are invaluable for off-site awareness, but in safety-critical atmospheric detection, a Wi-Fi drop, DNS hiccup, or router reboot cannot be allowed to silence a life-saving alarm. SafeBreath runs two completely independent operational loops.
        </p>
      </div>

      {/* Dual Loops Comparison Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Loop A: Local Autonomous Safety Response */}
        <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                LOOP A: LOCAL LIFE-SAFETY LOOP
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-800">
              Latency: &lt; 10 ms
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">Autonomous Physical Response</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Completely hardwired into the ESP32 DevKit core. Continuously samples gas concentrations and evaluates threshold hysteresis without issuing a single network call.
            </p>
          </div>

          {/* Flow nodes */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500">STAGE 1</div>
              <div className="font-bold text-white">Sensor</div>
              <div className="text-[9px] text-emerald-400">SnO2 / Cell</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500">STAGE 2</div>
              <div className="font-bold text-white">Processing</div>
              <div className="text-[9px] text-emerald-400">Dual-Core</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500">STAGE 3</div>
              <div className="font-bold text-white">Decision</div>
              <div className="text-[9px] text-emerald-400">Hysteresis</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 space-y-1">
              <div className="text-[10px] text-emerald-400 font-bold">STAGE 4</div>
              <div className="font-bold text-emerald-300">Buzzer</div>
              <div className="text-[9px] text-emerald-400 font-bold">85 dB Siren</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Internet Dependency:</strong> If Wi-Fi is lost, power cuts to your home router, or cloud APIs fail, nearby occupants are awakened immediately.
            </span>
          </div>
        </div>

        {/* Loop B: Remote Cloud & Observability Loop */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                LOOP B: REMOTE OBSERVABILITY LOOP
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
              Latency: 1–3 seconds
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">Remote Awareness & Historical Logging</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Handled by the secondary ESP32-CAM controller and MicroSD buffer. Safely transmits incident events and telemetry curves to Supabase and the Android application.
            </p>
          </div>

          {/* Flow nodes */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500">STAGE 1</div>
              <div className="font-bold text-white">Event</div>
              <div className="text-[9px] text-sky-400">Threshold</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500">STAGE 2</div>
              <div className="font-bold text-white">Wi-Fi</div>
              <div className="text-[9px] text-sky-400">ESP32-CAM</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500">STAGE 3</div>
              <div className="font-bold text-white">Cloud</div>
              <div className="text-[9px] text-sky-400">Supabase</div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-500 space-y-1">
              <div className="text-[10px] text-indigo-400 font-bold">STAGE 4</div>
              <div className="font-bold text-indigo-200">Alert</div>
              <div className="text-[9px] text-indigo-400 font-bold">FCM Push</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
            <Wifi className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              <strong>Store-and-Forward Resilience:</strong> If connectivity is interrupted, records are committed to local MicroSD flash and replayed automatically once Wi-Fi re-establishes.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
