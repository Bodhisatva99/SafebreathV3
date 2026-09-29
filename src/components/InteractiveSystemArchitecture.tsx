import React, { useState } from 'react';
import { 
  Wind, 
  Activity, 
  Cpu, 
  Wifi, 
  Database, 
  Smartphone, 
  ChevronRight, 
  ArrowDown, 
  ShieldCheck, 
  Clock, 
  Volume2, 
  HardDrive 
} from 'lucide-react';

export const InteractiveSystemArchitecture: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const layers = [
    {
      id: "env",
      number: "01",
      name: "Physical Environment",
      subtitle: "Hazard Source",
      desc: "Hazardous toxic gases, volatile organic vapors, combustible fuel leaks, and thermal changes accumulate in ambient air without sensory detection by occupants.",
      metrics: ["Carbon Monoxide (CO)", "Broadband VOCs & Solvents", "Liquefied Petroleum Gas (LPG)", "Ambient Temp (°C) & Humidity (%RH)"],
      icon: <Wind className="w-5 h-5 text-sky-600" />,
      delayMs: "Continuous"
    },
    {
      id: "sensors",
      number: "02",
      name: "Sensor Transduction Layer",
      subtitle: "Electrochemical & SnO2 Catalysis",
      desc: "Four specialized physical probes convert chemical gas concentrations into standardized electrical signals. ZE07-CO outputs digital UART frames; MQ-135 and MQ-6 modulate analog resistance; DHT11 delivers serialized 1-wire pulses.",
      metrics: ["ZE07-CO (0–500 ppm, 0.1 ppm resolution)", "MQ-135 (0–1023 ADC on 1.0kΩ RL)", "MQ-6 (0–1023 ADC on 1.0kΩ RL)", "DHT11 (0–50°C, 20–90% RH)"],
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
      delayMs: "< 350 ms"
    },
    {
      id: "nano",
      number: "03",
      name: "Arduino Nano V3 Subsystem",
      subtitle: "Deterministic ADC Oversampling",
      desc: "Dedicated to continuous 100 Hz analog acquisition and microsecond-sensitive 1-wire pulse timing. Applies moving-average smoothing filters to suppress heater coil noise, packaging values into CRC-verified 16-byte serial frames.",
      metrics: ["ATmega328P 16MHz Dedicated Loop", "100 Hz Oversampling Filter", "16-Byte Binary Frame Packaging", "CRC-16 Error Verification"],
      icon: <Cpu className="w-5 h-5 text-slate-800" />,
      delayMs: "500 ms Cycle"
    },
    {
      id: "esp32",
      number: "04",
      name: "ESP32 DevKit Processing Core",
      subtitle: "Autonomous Safety & State Machine",
      desc: "The central life-safety brain. Runs dual Xtensa cores at 240 MHz. Core 1 evaluates multi-gas thresholds and hysteresis (SAFE, WARNING, DANGER), driving the local 85 dB Piezo buzzer within 10 ms. Core 0 renders telemetry to the 128x64 OLED.",
      metrics: ["Dual-Core 240 MHz Xtensa LX6", "Hysteresis Schmitt-Trigger Logic", "Autonomous 85dB Siren (GPIO23 PWM)", "0.96\" SSD1306 OLED Framebuffer (10 FPS)"],
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      delayMs: "< 10 ms (Local Alarm)"
    },
    {
      id: "gateway",
      number: "05",
      name: "ESP32-CAM Gateway & Storage",
      subtitle: "Wi-Fi & FAT32 Black-Box Logger",
      desc: "Operates as a communications gateway completely decoupled from local life-safety timing. If the internet or Wi-Fi drops, it stores records into a circular MicroSD CSV buffer and queues cloud dispatches until connectivity returns.",
      metrics: ["802.11 b/g/n 2.4 GHz Wi-Fi Stack", "MicroSD Class 10 FAT32 CSV Logging", "Store-and-Forward Retry Buffer", "Non-Blocking Serial Bridge"],
      icon: <HardDrive className="w-5 h-5 text-indigo-600" />,
      delayMs: "1–3 s Transmission"
    },
    {
      id: "supabase",
      number: "06",
      name: "Supabase Cloud Persistence",
      subtitle: "Managed PostgreSQL Telemetry & Audit",
      desc: "Ingests environmental data, sequence counters, and alarm events. Provides time-series queries for post-incident audits and triggers automated push dispatch via edge functions.",
      metrics: ["PostgreSQL Row-Level Security", "Realtime WebSockets Stream", "Incident Post-Mortem Logging", "Fleet Multi-Device Management"],
      icon: <Database className="w-5 h-5 text-emerald-700" />,
      delayMs: "~150 ms Ingest"
    },
    {
      id: "mobile",
      number: "07",
      name: "Remote Companion Application",
      subtitle: "Android Client & Push Awareness",
      desc: "Receives high-priority push alerts delivered via Firebase Cloud Messaging (FCM). Enables remote property owners, lab managers, and family members to view real-time gas graphs and acknowledge warnings off-site.",
      metrics: ["Firebase Cloud Messaging (FCM) Push", "Live Atmospheric Trend Gauges", "Historical Timeline Exploration", "Multi-Device Alert Clearance"],
      icon: <Smartphone className="w-5 h-5 text-purple-600" />,
      delayMs: "< 2 s Global Push"
    }
  ];

  const current = layers[activeLayer];

  return (
    <div className="space-y-8">
      {/* Top Architecture Flow Ribbon */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-x-auto">
        <div className="flex items-center min-w-[700px] justify-between relative">
          {layers.map((layer, idx) => {
            const isSelected = activeLayer === idx;
            return (
              <React.Fragment key={layer.id}>
                <button
                  onClick={() => setActiveLayer(idx)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center transition-all group focus:outline-none ${
                    isSelected 
                      ? 'bg-white shadow-sm border border-emerald-600/60 ring-1 ring-emerald-600' 
                      : 'hover:bg-white/80'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'bg-emerald-50 text-emerald-800' 
                      : 'bg-slate-100 text-slate-600 group-hover:text-slate-900'
                  }`}>
                    {layer.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800 whitespace-nowrap">
                    {layer.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    STAGE {layer.number}
                  </span>
                </button>

                {idx < layers.length - 1 && (
                  <div className="flex items-center justify-center text-slate-300">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Layer Detailed Inspector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              STAGE {current.number} OF 07
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {current.subtitle}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {current.name}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed">
            {current.desc}
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
              Key Architecture Specifications:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {current.metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-slate-500">
            <span className="font-semibold text-slate-700">TRANSMISSION METRICS</span>
            <span className="text-emerald-700">ACTIVE PIPELINE</span>
          </div>

          <div className="space-y-2.5 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Processing Latency:</span>
              <span className="font-bold text-slate-900">{current.delayMs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Internet Dependent:</span>
              <span className={`font-bold ${['env', 'sensors', 'nano', 'esp32'].includes(current.id) ? 'text-emerald-700' : 'text-slate-700'}`}>
                {['env', 'sensors', 'nano', 'esp32'].includes(current.id) ? 'NO (Autonomous Local)' : 'YES (Auxiliary)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Packet Integrity:</span>
              <span className="text-slate-900">CRC-16 Verified</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white border border-slate-200 text-[11px] font-sans text-slate-600 leading-relaxed">
            {current.id === 'esp32' ? (
              <span className="text-amber-800 font-medium">
                ★ Critical safety checkpoint: If the internet fails, the local 85 dB alarm and OLED display continue functioning autonomously with zero reliance on external servers.
              </span>
            ) : (
              <span>
                Standardized modular boundaries allow each subsystem to be inspected, tested, and calibrated independently without cross-system side effects.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
