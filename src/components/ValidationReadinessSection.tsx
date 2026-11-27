import React, { useState } from 'react';
import { ClipboardCheck, Camera, FileCode2, CheckCircle2, Clock } from 'lucide-react';

interface ValidationTestItem {
  id: string;
  category: 'Metrology' | 'Timing & Acoustics' | 'Fail-Safe & Cloud';
  title: string;
  apparatus: string;
  acceptanceTarget: string;
  status: 'Pending Physical Run';
}

const VALIDATION_PROTOCOLS: ValidationTestItem[] = [
  {
    id: 'VAL-01',
    category: 'Metrology',
    title: 'CO Reference Gas Accuracy',
    apparatus: 'ZE07-CO UART2 vs. certified CO span cylinders (0, 35, 70, 200 ppm)',
    acceptanceTarget: 'Within +/- 5% or +/- 5 ppm of reference gas after 3-min warm-up',
    status: 'Pending Physical Run',
  },
  {
    id: 'VAL-02',
    category: 'Metrology',
    title: 'MQ-6 LPG Step & Curve Fit',
    apparatus: 'Sealed test chamber with controlled propane/isobutane injection (0–2,000 ppm)',
    acceptanceTarget: 'Verified Rs/R0 log curve fit crossing 500 ppm warn & 1,500 ppm danger gates',
    status: 'Pending Physical Run',
  },
  {
    id: 'VAL-03',
    category: 'Metrology',
    title: 'MQ-135 Baseline Burn-In Stability',
    apparatus: '>= 48 h continuous heater preheat + 24 h clean-air ADC log at 2 Hz',
    acceptanceTarget: 'Clean-air Rs/R0 baseline drift < 5% over 24 h ambient stability run',
    status: 'Pending Physical Run',
  },
  {
    id: 'VAL-04',
    category: 'Timing & Acoustics',
    title: 'Exposure-to-Output T90 Timing',
    apparatus: 'ZE07-CO step exposure from clean air to 100 ppm reference gas',
    acceptanceTarget: 'Sensor reaches 90% steady-state reading within <= 60 s datasheet spec',
    status: 'Pending Physical Run',
  },
  {
    id: 'VAL-05',
    category: 'Timing & Acoustics',
    title: 'MCU Decision Latency Benchmark',
    apparatus: 'Dual-channel logic analyzer on UART2/Nano RX vs. ESP32 GPIO 13 gate drive',
    acceptanceTarget: 'Measured trigger-to-GPIO-13 rise time < 10 ms across 100 hazard trials',
    status: 'Pending Physical Run',
  },
  {
    id: 'VAL-06',
    category: 'Timing & Acoustics',
    title: 'Measured Enclosure SPL @ Distance',
    apparatus: 'Calibrated Class-2 SPL meter placed at 10 cm and 1 m from enclosure vent',
    acceptanceTarget: 'Document measured dBA through physical grille vs. 85 dB @ 10 cm bare rating',
    status: 'Pending Physical Run',
  },
  {
    id: 'VAL-07',
    category: 'Fail-Safe & Cloud',
    title: 'Wi-Fi-Disabled Local Alarm & Touch UI Run',
    apparatus: 'Router powered off; inject CO > 70 ppm / LPG > 1,500 ppm at sensor head',
    acceptanceTarget: 'GPIO 13 buzzer latches, 1.3" ST7789 IPS shows DANGER & 5x TTP223 MUTE/menu responds offline',
    status: 'Pending Physical Run',
  },
  {
    id: 'VAL-08',
    category: 'Fail-Safe & Cloud',
    title: 'SD_MMC Buffering & Cloud Replay',
    apparatus: '60 s Wi-Fi cut during active sampling -> reconnect & inspect Supabase ledger',
    acceptanceTarget: 'Zero lost seq_id rows between MicroSD CSV & public.sensor_logs replay',
    status: 'Pending Physical Run',
  },
  {
    id: 'VAL-09',
    category: 'Fail-Safe & Cloud',
    title: 'Fault & Open-Circuit Injection',
    apparatus: 'Unplug Nano A0/A1, pull ZE07 RX/TX, and inject corrupt DHT22 checksum',
    acceptanceTarget: '1.3" ST7789 IPS & dashboard report SENSOR FAULT; never misclassify as NORMAL',
    status: 'Pending Physical Run',
  },
  {
    id: 'VAL-10',
    category: 'Fail-Safe & Cloud',
    title: 'Multi-Unit device_id Isolation',
    apparatus: 'Two active gateway payloads with distinct device_id tags on same project',
    acceptanceTarget: 'Live & history UI filters isolate per-node telemetry without cross-talk',
    status: 'Pending Physical Run',
  },
];

const MEDIA_CHECKLIST = [
  {
    title: '1. Completed Assembly Photo',
    detail: 'High-resolution photograph of vented physical enclosure, 1.3" ST7789 IPS readout, 5x TTP223 touch bezel, and external gas inlets.',
  },
  {
    title: '2. Internal Wiring Harness Photo',
    detail: 'Clear view of ESP32 DevKit V1, Arduino Nano (1k/2k divider), ESP32-CAM SD_MMC bus, ST7789 SPI harness, and sensor headers.',
  },
  {
    title: '3. 60-Second Continuous Proof Video',
    detail: 'Uncut clip demonstrating Wi-Fi disabled, live 1.3" ST7789 IPS updates, 5-key TTP223 menu/mute control, alarm latching, and SD logging.',
  },
];

export const ValidationReadinessSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'Metrology' | 'Timing & Acoustics' | 'Fail-Safe & Cloud'>('all');

  const items =
    filter === 'all'
      ? VALIDATION_PROTOCOLS
      : VALIDATION_PROTOCOLS.filter((item) => item.category === filter);

  return (
    <div id="validation-matrix" className="bg-white rounded-[28px] border border-black/[0.06] p-6 sm:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-black/[0.06]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-700">
            <ClipboardCheck className="w-4 h-4 shrink-0" />
            <span>Bench Validation Matrix · No Unverified Claims</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight">
            10-Point Physical Proof &amp; Bench Test Protocol
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
            Every threshold and timing specification above separates datasheet ratings from physical bench proof. Protocols below track physical certification runs prior to national judging submission.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F5F5F7] rounded-full border border-black/[0.06] self-start lg:self-auto">
          {(['all', 'Metrology', 'Timing & Acoustics', 'Fail-Safe & Cloud'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                filter === cat ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {cat === 'all' ? 'All (10)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Matrix Table */}
      <div className="overflow-x-auto border border-black/[0.06] rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F5F7] text-[#6E6E73] font-mono text-[11px] border-b border-black/[0.06]">
            <tr>
              <th className="py-3 px-4 font-semibold">ID</th>
              <th className="py-3 px-4 font-semibold">Test Protocol</th>
              <th className="py-3 px-4 font-semibold">Apparatus / Condition</th>
              <th className="py-3 px-4 font-semibold">Pass / Acceptance Target</th>
              <th className="py-3 px-4 font-semibold">Bench Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#F5F5F7]/50">
                <td className="py-3 px-4 font-mono font-bold text-[#1D1D1F] whitespace-nowrap">{item.id}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-[#1D1D1F]">{item.title}</div>
                  <div className="text-[11px] font-mono text-[#86868B]">{item.category}</div>
                </td>
                <td className="py-3 px-4 text-[#6E6E73]">{item.apparatus}</td>
                <td className="py-3 px-4 text-[#1D1D1F]">{item.acceptanceTarget}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[11px] font-semibold">
                    <Clock className="w-3 h-3" />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Physical Evidence Package Checklist */}
      <div className="rounded-2xl bg-[#F5F5F7] border border-black/[0.05] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1D1D1F]">
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Physical Prototype Media Evidence Checklist</span>
          </div>
          <span className="text-[11px] font-mono text-amber-800 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
            Upload Hardware Photos &amp; Demo Video Before Judging
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MEDIA_CHECKLIST.map((m) => (
            <div key={m.title} className="bg-white rounded-xl p-4 border border-black/[0.05] space-y-1.5">
              <div className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#86868B] shrink-0" />
                <span>{m.title}</span>
              </div>
              <p className="text-[11px] text-[#6E6E73] leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integrity Notice */}
      <div className="flex items-start gap-2.5 text-[11px] font-mono text-[#6E6E73]">
        <FileCode2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <span>
          Zero simulated metrics are presented as bench results. Once physical lab logs and photos are captured, attach calibrated CSV artifacts directly to these protocol IDs.
        </span>
      </div>
    </div>
  );
};
