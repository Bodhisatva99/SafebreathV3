import React from 'react';
import { Smartphone, Cloud, Database, Wifi, ShieldAlert, Bell, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DownloadAppButton } from './DownloadAppButton';

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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
          
          {/* Step 1: Device */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-900">SafeBreath Device</div>
            <div className="text-[10px] text-slate-500 font-mono">Sensors + ESP32</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-300">
            <ChevronRight className="w-5 h-5" />
          </div>

          {/* Step 2: Gateway */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center mx-auto border border-sky-200">
              <Wifi className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-900">ESP32-CAM Gateway</div>
            <div className="text-[10px] text-slate-500 font-mono">802.11 b/g/n + SD</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-300">
            <ChevronRight className="w-5 h-5" />
          </div>

          {/* Step 3: Supabase Cloud */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center mx-auto border border-indigo-200">
              <Database className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-900">Supabase Cloud</div>
            <div className="text-[10px] text-slate-500 font-mono">Telemetry & Events</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-300">
            <ChevronRight className="w-5 h-5" />
          </div>

          {/* Step 4: Companion Mobile App */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto border border-purple-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-slate-900">Android Companion</div>
            <div className="text-[10px] text-purple-700 font-mono font-semibold">FCM Push Alert</div>
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
            <h4 className="text-lg font-bold text-slate-900">The Android Application</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A window into the system when you are away from the room. Receives Firebase Cloud Messaging notifications, displays live concentration gauges, and provides historical trend views.
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
