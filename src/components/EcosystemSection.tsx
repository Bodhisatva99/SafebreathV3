import React from 'react';
import { Smartphone, Cloud, Database, Wifi, ShieldAlert, Bell, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DownloadAppButton } from './DownloadAppButton';
import { SafeBreathShieldSymbol, SafeBreathAndroidAppIcon } from './SafeBreathLogo';

export const EcosystemSection: React.FC = () => {
  return (
    <div className="bg-slate-50/70 rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
          <Cloud className="w-3.5 h-3.5" />
          <span>Connected Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          The SafeBreath Connected Ecosystem
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          The physical detector is the master system. The cloud functions as the persistent analytical spine, and the Android companion application provides remote observation and emergency push awareness when you are away.
        </p>
      </div>

      {/* Ecosystem Visual Chain */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          
          {/* Step 1: Device */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 relative flex flex-col items-center justify-center">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full mb-1">
              Step 01 · Acquisition
            </span>
            <div className="w-11 h-11 rounded-xl bg-emerald-50/80 text-emerald-800 flex items-center justify-center border border-emerald-200/80 p-1.5 shadow-xs">
              <SafeBreathShieldSymbol size={26} />
            </div>
            <div className="font-bold text-xs text-slate-900">SafeBreath Device</div>
            <div className="text-[10px] text-slate-500 font-mono">Sensors + Nano + ESP32</div>
          </div>

          {/* Step 2: Gateway */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 relative flex flex-col items-center justify-center">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded-full mb-1">
              Step 02 · Bridge
            </span>
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center border border-sky-200 shadow-xs">
              <Wifi className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-900">ESP32-CAM Gateway</div>
            <div className="text-[10px] text-slate-500 font-mono">802.11 b/g/n + MicroSD</div>
          </div>

          {/* Step 3: Supabase Cloud */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 relative flex flex-col items-center justify-center">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded-full mb-1">
              Step 03 · Persistence
            </span>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center border border-indigo-200 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-900">Supabase Cloud</div>
            <div className="text-[10px] text-slate-500 font-mono">Telemetry & Events Ledger</div>
          </div>

          {/* Step 4: Companion Mobile App */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-center space-y-2 relative flex flex-col items-center justify-center">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full mb-1">
              Step 04 · Alerting
            </span>
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center border border-purple-300 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-900">Android Companion</div>
            <div className="text-[10px] text-purple-700 font-mono font-semibold">FCM Push Notification</div>
          </div>

        </div>
      </div>

      {/* Role Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="text-xs font-mono font-bold text-emerald-800 uppercase">
            PRIMARY FOUNDATION
          </div>
          <h4 className="text-lg font-bold text-slate-900">The Physical Hardware</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            The actual product is the SafeBreath bench device. It houses the calibrated sensors, executes the safety algorithms, sounds the buzzer, and records data locally without requiring any account login or internet connection.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="text-xs font-mono font-bold text-sky-800 uppercase">
            CONNECTIVITY LAYER
          </div>
          <h4 className="text-lg font-bold text-slate-900">The Supabase Cloud</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Acts as the persistent time-series ledger. Stores every gas sample, warm-up event, and alarm sequence so you can examine what happened leading up to an incident rather than just relying on a fleeting beep.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-purple-800 uppercase">
              REMOTE INTERFACE
            </div>

            {/* Installed Android Product Identity Lockup */}
            <div className="flex items-center gap-3.5 pt-1">
              <SafeBreathAndroidAppIcon size={52} className="shrink-0 shadow-md" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">SafeBreath V3 for Android</h4>
                <div className="text-[11px] text-slate-500">Real-time monitoring and remote alerts</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              A companion window into the system when away from the room. Receives Firebase Cloud Messaging notifications, displays live concentration gauges, and provides historical trend views.
            </p>
          </div>

          <div className="pt-2">
            <DownloadAppButton variant="card" />
          </div>
        </div>
      </div>
    </div>
  );
};
