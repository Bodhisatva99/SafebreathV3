import React, { useState } from 'react';
import { PageTab } from '../types';
import { 
  ShieldAlert, 
  Cpu, 
  Activity, 
  BellRing, 
  Database, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Wind,
  Thermometer,
  Layers,
  Sparkles,
  WifiOff
} from 'lucide-react';

interface OverviewPageProps {
  onSelectTab: (tab: PageTab) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onSelectTab }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const architectureSteps = [
    {
      title: "01. Physical Environment",
      badge: "Target Atmospheric Hazards",
      desc: "Hazardous gases and thermal shifts accumulate silently in closed spaces without human olfactory perception.",
      items: ["Carbon Monoxide (CO)", "Volatile Organic Compounds (VOC)", "Liquefied Petroleum Gas (LPG)", "Ambient Temp & Relative Humidity"],
      icon: <Wind className="w-5 h-5 text-sky-400" />
    },
    {
      title: "02. Sensor Acquisition",
      badge: "Arduino Nano",
      desc: "Dedicated real-time analog sampling (100 Hz filtered to 2 Hz) of SnO2 semiconductor sensors and DHT11 digital bus.",
      items: ["ZE07-CO Electrochemical Cell", "MQ-135 Broadband VOC Probe", "MQ-6 Combustible Gas Probe", "DHT11 Digital Thermistor/RH"],
      icon: <Activity className="w-5 h-5 text-emerald-400" />
    },
    {
      title: "03. Processing & Safety Logic",
      badge: "ESP32 DevKit (240MHz)",
      desc: "Autonomous safety decision core evaluating multi-gas thresholds with hysteresis. Controls physical buzzer and OLED display.",
      items: ["Threshold & Hysteresis State Machine", "Autonomous 85dB Buzzer Driver", "128x64 Monochrome OLED UI", "Sensor Validity & Fault Detection"],
      icon: <Cpu className="w-5 h-5 text-amber-400" />
    },
    {
      title: "04. Gateway & Persistence",
      badge: "ESP32-CAM",
      desc: "Dual-path bridge handling offline MicroSD black-box logging and 802.11 b/g/n Wi-Fi cloud synchronization.",
      items: ["MicroSD FAT32 Circular CSV Buffer", "Wi-Fi Reconnection & Retry Queue", "Supabase Telemetry Ingestion", "FCM Mobile Push Dispatcher"],
      icon: <Database className="w-5 h-5 text-indigo-400" />
    },
    {
      title: "05. Remote Companion App",
      badge: "SafeBreath Android App",
      desc: "Secondary awareness terminal receiving real-time push alerts, historical trend graphs, and fleet safety status.",
      items: ["Firebase Cloud Messaging (FCM)", "Multi-device Realtime Dashboards", "Historical Incident Audit Trail", "Sensor Calibration Diagnostics"],
      icon: <Smartphone className="w-5 h-5 text-purple-400" />
    }
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>EMBEDDED HARDWARE SYSTEM</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">RESEARCH & EDUCATION PROTOTYPE</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
                SAFE BREATH
              </h1>
              <p className="text-lg sm:text-xl font-medium text-emerald-400/90">
                Smart Multi-Gas Detection & Air Quality Monitoring System
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              A low-cost, connected atmospheric safety system for detecting hazardous gases and monitoring environmental conditions in real time. Designed to combine multi-gas sensing, autonomous local alarms, offline data logging, and remote notifications into one integrated embedded platform.
            </p>

            {/* Core Specs Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Monitored Hazards</div>
                <div className="text-xl font-bold font-mono text-white mt-1">5 Factors</div>
                <div className="text-[11px] text-slate-500 mt-0.5">CO, VOC, LPG, T, RH</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Local Alarm Latency</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">&lt; 10 ms</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Internet-independent</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Controllers</div>
                <div className="text-xl font-bold font-mono text-white mt-1">3 Distributed</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Nano + ESP32 + CAM</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Prototype BOM</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">~$42.50</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Off-the-shelf modules</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onSelectTab('simulator')}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
              >
                <span>Launch Hardware Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onSelectTab('architecture')}
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700 flex items-center gap-2"
              >
                <span>Explore Architecture & BOM</span>
              </button>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 p-6 shadow-2xl group space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE HARDWARE TELEMETRY
                </span>
                <span className="text-slate-400 font-mono text-[11px]">OLED SSD1306 ACTIVE</span>
              </div>

              {/* Hardware Bench Schematic Card */}
              <div className="rounded-lg bg-black/80 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3">
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-slate-800 text-emerald-400 font-bold">
                  <span>SAFEBREATH HW CHASSIS</span>
                  <span>AUTONOMOUS ALARM READY</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">ZE07-CO SENSOR</span>
                    <span className="font-bold text-white">UART 9600 8N1</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">MQ CLUSTER (135/6)</span>
                    <span className="font-bold text-white">100Hz OVERSAMPLED</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">LOCAL BUZZER</span>
                    <span className="font-bold text-amber-400">85 dB &lt;10ms LATENCY</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">GATEWAY & SD</span>
                    <span className="font-bold text-sky-400">ESP32-CAM REST/SPI</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg p-3 grid grid-cols-3 gap-2 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">CO LEVEL</div>
                  <div className="text-sm font-bold text-emerald-400">5.0 ppm</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">VOC LEVEL</div>
                  <div className="text-sm font-bold text-emerald-400">13.6 ppm</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">LPG LEVEL</div>
                  <div className="text-sm font-bold text-emerald-400">1.2 ppm</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-tight">
                SafeBreath physical bench unit with ZE07-CO, MQ-135, MQ-6, and dual microcontrollers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs The Solution */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Problem */}
        <div className="rounded-xl border border-rose-900/40 bg-rose-950/10 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 text-rose-400">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400/80">The Atmospheric Challenge</span>
              <h3 className="text-xl font-bold text-white">Silent & Invisible Hazard Accumulation</h3>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Hazardous gases can accumulate without being immediately visible or detectable by humans. Carbon monoxide, LPG and other airborne pollutants create dangerous conditions in homes, vehicles, workshops, laboratories, and industrial settings.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span><strong>Carbon Monoxide (CO):</strong> The "silent killer"—colorless and odorless, binds to hemoglobin 200x faster than oxygen.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span><strong>Liquefied Petroleum Gas (LPG):</strong> Combustible leak risks leading to asphyxiation or catastrophic explosions at lower explosive limits.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <span><strong>Conventional single-gas limits:</strong> Off-the-shelf detectors track only one gas, lack data logging, and offer only a localized beeper that is useless if the room is unattended.</span>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 text-emerald-400">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400/80">The Integrated Approach</span>
              <h3 className="text-xl font-bold text-white">SafeBreath Integrated Safety Platform</h3>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            SafeBreath unites electrochemical and semiconductor gas sensing, environmental climate tracking, zero-latency physical alarms, offline circular flight-recorder storage, and remote cloud notification into a single robust system.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Concurrent Multi-Gas Monitoring:</strong> Measures CO, VOC, LPG, Temperature, and Humidity continuously every 500 ms.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Two-Tiered Alert Architecture:</strong> Immediate physical acoustic alarm on-site + Firebase Cloud Messaging push to mobile for remote awareness.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Zero-Internet Dependency:</strong> If Wi-Fi fails or power fluctuates, the local ESP32 safety core and buzzer continue operating autonomously.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive System Flow Architecture */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">End-to-End Pipeline</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">SafeBreath Complete System Architecture</h2>
          <p className="text-slate-400 text-sm max-w-3xl">
            Click through the pipeline stages below to inspect how physical gas molecules transition from sensor excitation to local buzzer triggers and cloud telemetry.
          </p>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {architectureSteps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-3.5 rounded-lg border transition-all ${
                  isSelected 
                    ? 'bg-slate-800 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">STAGE 0{idx + 1}</span>
                </div>
                <div className="text-xs font-semibold text-white">{step.title}</div>
                <div className="text-[11px] font-mono text-emerald-400/90 truncate mt-0.5">{step.badge}</div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Details Panel */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {architectureSteps[activeStep].badge}
              </span>
              <h3 className="text-xl font-bold text-white">{architectureSteps[activeStep].title}</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {architectureSteps[activeStep].desc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {architectureSteps[activeStep].items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-3">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Bus & Protocol Specs</span>
              <span className="text-emerald-400">9600 BAUD</span>
            </div>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div><strong>Frame Rate:</strong> 2.0 Hz Sample Frequency</div>
              <div><strong>Data Aging:</strong> 3500 ms Stale Invalidation</div>
              <div><strong>CRC Checksum:</strong> 8-bit XOR Packet Verification</div>
              <div><strong>Transport:</strong> Hardware UART & I2C Bus</div>
            </div>
            <button
              onClick={() => onSelectTab('architecture')}
              className="w-full mt-2 text-center text-xs text-emerald-400 hover:text-emerald-300 py-1.5 border border-emerald-500/30 rounded hover:bg-emerald-500/10 transition-colors"
            >
              View Full Wiring & Pinouts →
            </button>
          </div>
        </div>
      </section>

      {/* The Fundamental Principle: Autonomous Local Safety */}
      <section className="rounded-2xl border border-amber-900/40 bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-slate-900/60 p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
              <WifiOff className="w-4 h-4" />
              <span>CORE ARCHITECTURAL PRINCIPLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Physical Safety Never Depends on the Internet
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              In safety-critical engineering, internet latency, DNS outages, router restarts, and dropped packets cannot be allowed to stand between a gas accumulation and an occupant waking up. SafeBreath is designed from the silicon up to execute all safety decisions locally.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-emerald-400 font-semibold block mb-1">Local Embedded Loop</span>
                <span className="text-slate-400">Continuous analog sampling, state-machine hysteresis evaluation, 85 dB Piezo buzzer trigger, and OLED update without network queries.</span>
              </div>
              <div className="p-3 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-sky-400 font-semibold block mb-1">Cloud As An Observability Layer</span>
                <span className="text-slate-400">Used for remote telemetry, historical trend analytics, post-incident investigations, and remote companion app alerts.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
                <BellRing className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-white">Dual-Tiered Alerting</div>
              <div className="text-xs text-slate-400">
                <strong className="text-slate-200">Local:</strong> Instant buzzer for nearby people.<br />
                <strong className="text-slate-200">Cloud:</strong> FCM push notification for remote property managers or emergency contacts.
              </div>
            </div>
            <button
              onClick={() => onSelectTab('safety-logic')}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center border border-slate-700 transition-colors"
            >
              Read Threshold & Hysteresis Logic →
            </button>
          </div>
        </div>
      </section>

      {/* Target Application Environments */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Deployment Versatility</div>
            <h2 className="text-2xl font-bold text-white mt-1">Real-World Operational Environments</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Engineered for high-risk enclosed spaces where gas accumulation is hazardous to life and property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="text-xs font-mono text-emerald-400">01 · RESIDENTIAL & RVs</div>
            <h4 className="text-base font-bold text-white">Homes, Kitchens & Caravans</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects gas stove LPG burner leaks, faulty water heaters generating CO, and VOCs from household finishes or space heaters.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="text-xs font-mono text-emerald-400">02 · AUTOMOTIVE & WORKSHOPS</div>
            <h4 className="text-base font-bold text-white">Garages & Service Bays</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitors dangerous internal combustion exhaust CO buildup and flammable fuel vapors with independent acoustic alerts.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="text-xs font-mono text-emerald-400">03 · RESEARCH & SCIENCE LABS</div>
            <h4 className="text-base font-bold text-white">Laboratories & Cleanrooms</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides constant VOC and solvent vapor monitoring, logging all data to MicroSD cards for rigorous regulatory traceability.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="text-xs font-mono text-emerald-400">04 · LIGHT INDUSTRIAL</div>
            <h4 className="text-base font-bold text-white">Warehouses & Boiler Rooms</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Early warning for heating plant exhaust leaks and thermal runaway before conditions exceed combustible or lethal limits.
            </p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 p-6 font-mono text-xs text-slate-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-white font-bold">ATMOSPHERIC SAFETY MONITORING ZONE</span>
            </div>
            <span className="text-slate-500 text-[11px]">WALL / BENCH MOUNTED RIGID ENCLOSURE</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-[11px]">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">ACOUSTIC RADIUS</span>
              <span className="text-white font-bold text-sm">85 dB @ 1 Meter</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">Audible across workshop</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">LOCAL LOG RETENTION</span>
              <span className="text-white font-bold text-sm">MicroSD FAT32</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">Continuous ring buffer</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">CLOUD LINK</span>
              <span className="text-white font-bold text-sm">Supabase Realtime</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">Auto-reconnect & replay</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
