import React, { useState } from 'react';
import {
  Wind,
  Activity,
  Cpu,
  Database,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  HardDrive,
} from 'lucide-react';

export const InteractiveSystemArchitecture: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const layers = [
    {
      id: 'env',
      number: '01',
      name: 'Physical Environment',
      subtitle: 'Atmospheric & Gas Exposure Inputs',
      desc: 'Indoor toxic carbon monoxide, broadband VOC/solvent vapors, combustible LPG leaks, and ambient temperature & relative humidity.',
      metrics: [
        'Carbon Monoxide (CO)',
        'Broadband Air-Quality / VOC Trends',
        'Liquefied Petroleum Gas (LPG)',
        'Ambient Temp (°C) & RH (%) · Dual CT (Exp.)',
      ],
      icon: <Wind className="w-5 h-5 text-sky-600" />,
      delayMs: 'Continuous Exposure',
    },
    {
      id: 'sensors',
      number: '02',
      name: 'Sensor Transduction Layer',
      subtitle: 'Electrochemical & SnO2 Catalysis',
      desc: 'Chemical modules convert gas partial pressures and ambient conditions into electrical outputs. Note: Chemical T90 sensor response is distinct from MCU decision latency.',
      metrics: [
        'ZE07-CO (0–500 ppm · T90 <= 60s)',
        'MQ-135 (10–1000 ppm target · >=48h preheat)',
        'MQ-6 (300–10k ppm LPG · >=48h preheat)',
        'DHT11 (0–50°C ±2°C · Prop. Single-Wire)',
      ],
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
      delayMs: 'Sensor T90: up to 60 s',
    },
    {
      id: 'nano',
      number: '03',
      name: 'Arduino Nano Subsystem',
      subtitle: 'Deterministic ADC & Single-Wire Acquisition',
      desc: 'Executes 100 Hz analog acquisition on A0/A1 and DHT11 decoding on D2, streaming the Nano Acquisition Frame (MQ-135, MQ-6, DHT11) through a 1kΩ/2kΩ divider to ESP32.',
      metrics: [
        'ATmega328P 16 MHz Dedicated Loop',
        '100 Hz Oversampling Filter',
        'Nano Sensor Frame (A0, A1, D2)',
        '1kΩ / 2kΩ 5V->3.3V UART Divider',
      ],
      icon: <Cpu className="w-5 h-5 text-slate-800" />,
      delayMs: '500 ms Frame Cycle',
    },
    {
      id: 'esp32',
      number: '04',
      name: 'ESP32 DevKit Master Core',
      subtitle: 'Packet Fusion & Autonomous Local Safety',
      desc: 'Fuses direct ZE07-CO UART (GPIO 16/17) with Nano Frame (GPIO 23/22), evaluates Schmitt-trigger hysteresis, renders SSD1306 OLED, and switches the 5V buzzer via NPN/MOSFET driver.',
      metrics: [
        'Dual-Core 240 MHz Xtensa LX6',
        'Fuses ZE07-CO + Nano Telemetry',
        'GPIO 13 -> Transistor Driver -> 5V Siren',
        'Unified 16-Byte Master-to-CAM Frame',
      ],
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      delayMs: '< 10 ms Design Target',
    },
    {
      id: 'gateway',
      number: '05',
      name: 'ESP32-CAM Gateway & Local Data Logger',
      subtitle: 'Camera Disabled in Rev 2.8f · Wi-Fi + SD_MMC',
      desc: 'Receives Unified 16-Byte Master-to-Gateway Frame over dedicated Hardware Serial. Writes circular CSV logs to onboard MicroSD (SD_MMC) and posts to Supabase.',
      metrics: [
        '802.11 b/g/n 2.4 GHz Wi-Fi Stack',
        'MicroSD FAT32 Logging (SD_MMC)',
        'OV2640 Camera Disabled in Rev 2.8f',
        'Dedicated Gateway Serial (Avoid USB UART0)',
      ],
      icon: <HardDrive className="w-5 h-5 text-indigo-600" />,
      delayMs: 'Periodic Cloud Sync',
    },
    {
      id: 'supabase',
      number: '06',
      name: 'Supabase Cloud Persistence',
      subtitle: 'PostgreSQL Telemetry Ledger',
      desc: 'Persists sensor readings, sequence IDs, controller health flags (co_valid, voc_valid, lpg_valid, dht_valid, nano_online, ze07_online), and alarm states.',
      metrics: [
        'PostgreSQL Ledger Storage',
        'Realtime WebSocket Broadcast',
        'Audit History & CSV Export',
        'Read-Only Public Dashboard View',
      ],
      icon: <Database className="w-5 h-5 text-emerald-700" />,
      delayMs: 'Cloud Ingest (~150 ms)',
    },
    {
      id: 'mobile',
      number: '07',
      name: 'Android Companion App',
      subtitle: 'Remote Monitoring & Notification Client',
      desc: 'Displays synced environmental readings and node health flags. Remote push alert delivery requires backend FCM integration triggered from ingested hazard states.',
      metrics: [
        'Supabase Live Telemetry Sync',
        'CO / VOC Ind. / LPG / Climate Readouts',
        'FCM Client Support (Backend Push Req.)',
        'Direct Release APK Packaging',
      ],
      icon: <Smartphone className="w-5 h-5 text-purple-600" />,
      delayMs: 'Network-Dependent',
    },
  ];

  const current = layers[activeLayer];

  return (
    <div className="space-y-6">
      {/* Top 7-Stage Pipeline Ribbon */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4 sm:p-5 overflow-x-auto">
        <div className="flex items-center min-w-[680px] justify-between">
          {layers.map((layer, idx) => {
            const isSelected = activeLayer === idx;
            return (
              <React.Fragment key={layer.id}>
                <button
                  type="button"
                  onClick={() => setActiveLayer(idx)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl text-center transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border border-emerald-600 text-[#1D1D1F]'
                      : 'hover:bg-[#F5F5F7] border border-transparent'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white text-emerald-800 border border-emerald-200' : 'bg-[#F5F5F7] text-[#6E6E73]'
                    }`}
                  >
                    {layer.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-[#1D1D1F] whitespace-nowrap">
                    {layer.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-[#86868B]">STAGE {layer.number}</span>
                </button>

                {idx < layers.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-black/20 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Stage Details */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="font-bold text-emerald-700 uppercase tracking-wider">
              STAGE {current.number} OF 07
            </span>
            <span className="text-black/20">·</span>
            <span className="text-[#6E6E73] uppercase tracking-wider">{current.subtitle}</span>
          </div>

          <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{current.name}</h3>

          <p className="text-[#6E6E73] text-sm leading-relaxed">{current.desc}</p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-[#1D1D1F] uppercase tracking-wider block">
              Stage Specifications
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {current.metrics.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.05] text-xs font-mono text-[#1D1D1F]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#F5F5F7] rounded-2xl border border-black/[0.06] p-5 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06] text-[#6E6E73]">
            <span className="font-bold text-[#1D1D1F]">STAGE TIMING &amp; BOUNDARY</span>
            <span className="text-emerald-700 font-semibold">REV 2.8F</span>
          </div>

          <div className="space-y-2.5 text-[#6E6E73]">
            <div className="flex justify-between">
              <span>Stage Timing</span>
              <span className="font-bold text-[#1D1D1F]">{current.delayMs}</span>
            </div>
            <div className="flex justify-between">
              <span>Internet Dependent</span>
              <span
                className={`font-bold ${
                  ['env', 'sensors', 'nano', 'esp32'].includes(current.id)
                    ? 'text-emerald-700'
                    : 'text-[#1D1D1F]'
                }`}
              >
                {['env', 'sensors', 'nano', 'esp32'].includes(current.id)
                  ? 'NO (Autonomous Local)'
                  : 'YES (Auxiliary Sync)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frame Verification</span>
              <span className="text-[#1D1D1F]">CRC-16 Verified</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-black/[0.06] text-xs font-sans text-[#6E6E73] leading-relaxed">
            {current.id === 'esp32'
              ? 'Note: < 10 ms refers to MCU decision & GPIO 13 driver trigger latency once a valid sensor packet arrives; chemical gas reaction still depends on ZE07/MQ physical response curves (up to 60 s T90).'
              : 'Distinct timing layers prevent sensor chemical equilibration time from being confused with microcontroller alarm latency.'}
          </div>
        </div>
      </div>
    </div>
  );
};
