import React from 'react';
import { Wifi, CheckCircle2 } from 'lucide-react';

export const LocalSafetySection: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="text-sm font-medium text-emerald-700">
          Autonomous Failsafe Architecture
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#1D1D1F] leading-[1.08] text-balance">
          Local alarms never wait for an internet connection.
        </h2>

        <p className="text-[#6E6E73] text-sm sm:text-base leading-relaxed">
          Cloud notifications deliver remote peace of mind, but a dropped router or ISP outage must never silence a hazard alarm. SafeBreath executes two decoupled operational loops in hardware.
        </p>
      </div>

      {/* Dual Loops Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loop A */}
        <div className="bg-white border border-black/[0.07] rounded-[24px] p-6 sm:p-9 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
            <span className="text-xs font-mono font-semibold text-emerald-700">
              Loop A · Local Safety Core
            </span>
            <span className="text-xs font-mono text-emerald-700 font-semibold tabular-nums">
              &lt; 10 ms Design Target
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#1D1D1F]">Autonomous Physical Alarm</h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
              Hardwired directly into the ESP32 DevKit core. Evaluates Schmitt-trigger hysteresis and sensor faults locally with zero network dependency.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04] space-y-1">
              <div className="text-[10px] text-[#86868B]">01</div>
              <div className="font-bold text-[#1D1D1F]">Sensing</div>
              <div className="text-[10px] text-emerald-700">Multi-Gas</div>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04] space-y-1">
              <div className="text-[10px] text-[#86868B]">02</div>
              <div className="font-bold text-[#1D1D1F]">Filtering</div>
              <div className="text-[10px] text-emerald-700">100 Hz ADC</div>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04] space-y-1">
              <div className="text-[10px] text-[#86868B]">03</div>
              <div className="font-bold text-[#1D1D1F]">Hysteresis</div>
              <div className="text-[10px] text-emerald-700">ESP32 Core</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="text-[10px] text-emerald-700 font-bold">04</div>
              <div className="font-bold text-emerald-950">85 dB @10cm</div>
              <div className="text-[10px] text-emerald-700">Datasheet · GPIO 13</div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.06] text-xs text-[#6E6E73] leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#1D1D1F]">Zero Internet Dependency:</strong> Continues sounding the local acoustic siren, updating the 1.3&quot; ST7789 IPS display, and staying responsive to the 5x TTP223 capacitive touch mute/nav keys even if Wi-Fi is completely offline.
            </span>
          </div>
        </div>

        {/* Loop B */}
        <div className="bg-white border border-black/[0.07] rounded-[24px] p-6 sm:p-9 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
            <span className="text-xs font-mono font-semibold text-sky-700">
              Loop B · Cloud &amp; Archive
            </span>
            <span className="text-xs font-mono text-[#6E6E73] font-semibold tabular-nums">
              1–3 s Sync
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#1D1D1F]">Remote Observability &amp; Audit Trail</h3>
            <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
              Managed asynchronously by the ESP32-CAM gateway and onboard MicroSD card. Archives incident logs locally and streams telemetry to Supabase and the Android client.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04] space-y-1">
              <div className="text-[10px] text-[#86868B]">01</div>
              <div className="font-bold text-[#1D1D1F]">Frame</div>
              <div className="text-[10px] text-sky-700">UART Sync</div>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04] space-y-1">
              <div className="text-[10px] text-[#86868B]">02</div>
              <div className="font-bold text-[#1D1D1F]">MicroSD</div>
              <div className="text-[10px] text-sky-700">SD_MMC</div>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.04] space-y-1">
              <div className="text-[10px] text-[#86868B]">03</div>
              <div className="font-bold text-[#1D1D1F]">Supabase</div>
              <div className="text-[10px] text-sky-700">PostgreSQL</div>
            </div>

            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
              <div className="text-[10px] text-sky-700 font-bold">04</div>
              <div className="font-bold text-sky-950">Mobile Client</div>
              <div className="text-[10px] text-sky-700">FCM Req. Backend</div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.06] text-xs text-[#6E6E73] leading-relaxed flex items-start gap-2.5">
            <Wifi className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#1D1D1F]">Store-and-Forward Architecture:</strong> Gateway firmware commits telemetry continuously to MicroSD flash during outages and replays queued records when Wi-Fi connectivity resumes.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
