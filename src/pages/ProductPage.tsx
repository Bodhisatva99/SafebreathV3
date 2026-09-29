import React, { useRef, useState, useEffect } from 'react';
import { NavSection } from '../types';
import { 
  ShieldAlert, 
  ArrowRight, 
  Activity, 
  Cpu, 
  Radio, 
  Volume2, 
  HardDrive, 
  Wifi, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Layers,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Download,
  Flame,
  Wind,
  Thermometer,
  Droplets
} from 'lucide-react';
import { supabase, SensorLogRow, APP_DOWNLOAD_URL } from '../lib/supabase';
import { DownloadAppButton } from '../components/DownloadAppButton';
import { CircuitDiagramViewer } from '../components/CircuitDiagramViewer';
import { LiveTelemetryExperience } from '../components/LiveTelemetryExperience';
import { InteractiveHardwareExplorer } from '../components/InteractiveHardwareExplorer';
import { InteractiveSystemArchitecture } from '../components/InteractiveSystemArchitecture';
import { LocalSafetySection } from '../components/LocalSafetySection';
import { SafetyStateEngine } from '../components/SafetyStateEngine';
import { DataHistorySection } from '../components/DataHistorySection';
import { EcosystemSection } from '../components/EcosystemSection';
import { TechnicalSpecsSection } from '../components/TechnicalSpecsSection';
import { PrecisionHardwareSimulator } from '../components/PrecisionHardwareSimulator';

interface ProductPageProps {
  onNavigate: (section: NavSection) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ onNavigate }) => {
  const storyRef = useRef<HTMLDivElement>(null);
  const [liveReading, setLiveReading] = useState<SensorLogRow | null>(null);
  const [hardwareSubView, setHardwareSubView] = useState<'circuit' | 'topology'>('circuit');

  useEffect(() => {
    // Fetch latest live reading for the Hero Device preview
    const fetchLatest = async () => {
      const { data } = await supabase
        .from('sensor_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setLiveReading(data[0] as SensorLogRow);
      }
    };
    fetchLatest();

    const channel = supabase
      .channel('hero_telemetry')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_logs' }, (payload) => {
        setLiveReading(payload.new as SensorLogRow);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-28 py-10">
      
      {/* 1. Redesigned Premium Product Hero */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pb-20">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-medium tracking-tight">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">HARDWARE ATMOSPHERIC PLATFORM</span>
            <span className="text-slate-300">·</span>
            <span>RESEARCH & OPEN METROLOGY</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] text-balance">
              SAFE BREATH
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-emerald-800 tracking-tight">
              Smart Multi-Gas Detection & Air Quality Monitoring System
            </p>
          </div>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
            "Measure the invisible. Understand your environment. Respond before it becomes dangerous."
          </p>

          <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A low-cost, connected embedded safety system for detecting hazardous gases (CO, VOC, LPG) and monitoring environmental conditions in real time with autonomous physical local alarms.
          </p>

          {/* Primary & Secondary Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <DownloadAppButton variant="hero" />

            <button
              onClick={scrollToStory}
              className="px-6 py-3 rounded-full bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all shadow-sm hover:shadow flex items-center gap-2 group"
            >
              <span>Explore SafeBreath</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('technology')}
              className="px-6 py-3 rounded-full bg-white text-slate-800 font-medium text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm"
            >
              <span>Explore the Technology</span>
            </button>
          </div>
        </div>

        {/* Hero Product Hardware Presentation - CAD/Schematic Precision Device View */}
        <div className="mt-14 max-w-6xl mx-auto relative">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-7 shadow-xl relative overflow-hidden">
            
            {/* The SafeBreath Physical Instrument Chassis */}
            <div className="rounded-2xl border border-slate-800 bg-[#070b14] text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              
              {/* Subtle architectural circuit grid */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }} 
              />

              {/* Hardware Device Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                      <span>SAFEBREATH BENCH INSTRUMENT</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">MODEL V3.0</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      AUTONOMOUS MULTI-GAS DETECTOR & ATMOSPHERIC FLIGHT RECORDER
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-300">CORE STATUS:</span>
                    <span className="text-emerald-400 font-bold">{liveReading?.system_alarm ? 'ALARM ACTIVE' : 'NOMINAL / SAFE'}</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
                    <Radio className="w-3 h-3 text-sky-400" />
                    <span>SUPABASE LIVE</span>
                  </div>
                </div>
              </div>

              {/* Hardware Layout Interactive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 relative z-10 items-stretch">
                
                {/* Left: The 4 Physical Sensor Chambers (5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Physical Sensor Array</span>
                    <span className="text-emerald-400 text-[11px]">100Hz Oversampled</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono">
                    
                    {/* ZE07-CO */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="flex items-center gap-1 text-sky-400 font-semibold">
                          <Wind className="w-3.5 h-3.5" />
                          ZE07-CO
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">ELECTROCHEM</span>
                      </div>
                      <div className="text-2xl font-bold text-white tabular-nums">
                        {liveReading ? liveReading.co_ppm : '5'} <span className="text-xs font-sans text-slate-400">ppm</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Carbon Monoxide · UART</div>
                    </div>

                    {/* MQ-135 */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <Activity className="w-3.5 h-3.5" />
                          MQ-135
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">SnO2 SEMI</span>
                      </div>
                      <div className="text-2xl font-bold text-white tabular-nums">
                        {liveReading ? liveReading.voc_ppm : '13.6'} <span className="text-xs font-sans text-slate-400">ppm</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Air Quality & VOCs</div>
                    </div>

                    {/* MQ-6 */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Flame className="w-3.5 h-3.5" />
                          MQ-6
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">COMBUSTIBLE</span>
                      </div>
                      <div className="text-2xl font-bold text-white tabular-nums">
                        {liveReading ? liveReading.lpg_ppm : '1.2'} <span className="text-xs font-sans text-slate-400">ppm</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">LPG & Isobutane</div>
                    </div>

                    {/* DHT11 */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="flex items-center gap-1 text-rose-400 font-semibold">
                          <Thermometer className="w-3.5 h-3.5" />
                          DHT11
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">CLIMATE</span>
                      </div>
                      <div className="text-2xl font-bold text-white tabular-nums">
                        {liveReading ? liveReading.temp : '35.2'} <span className="text-xs font-sans text-slate-400">°C</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">RH: {liveReading ? liveReading.hum : '64'}% · Single-Wire</div>
                    </div>

                  </div>
                </div>

                {/* Center: OLED SSD1306 Real Screen & Piezo Alarm (4 Cols) */}
                <div className="lg:col-span-4 bg-slate-900/60 rounded-xl border border-slate-800 p-4 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/80">
                      <span className="text-slate-300">SSD1306 0.96" OLED</span>
                      <span className="text-[10px] text-emerald-400">128×64 I2C</span>
                    </div>

                    {/* Authentic Monochrome OLED Frame */}
                    <div className="mt-3 p-3.5 rounded-lg bg-black border border-slate-800 font-mono text-xs text-[#00f3ff] shadow-inner space-y-2">
                      <div className="flex justify-between items-center text-[11px] border-b border-[#00f3ff]/20 pb-1 font-bold">
                        <span>SAFEBREATH V3</span>
                        <span className="text-emerald-400">{liveReading?.system_alarm ? 'ALARM' : 'SAFE'}</span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">CO:</span>
                          <span className="font-bold text-white">{liveReading ? liveReading.co_ppm : '5'} ppm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">VOC:</span>
                          <span className="font-bold text-white">{liveReading ? liveReading.voc_ppm : '13.6'} ppm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">LPG:</span>
                          <span className="font-bold text-white">{liveReading ? liveReading.lpg_ppm : '1.2'} ppm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">T/RH:</span>
                          <span className="text-white">{liveReading ? liveReading.temp : '35.2'}°C / {liveReading ? liveReading.hum : '64'}%</span>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-[#00f3ff]/20 text-[9px] text-slate-400 flex justify-between">
                        <span>UPTIME: {liveReading ? Math.floor(liveReading.uptime_ms / 1000) : 460}s</span>
                        <span>SEQ: #{liveReading?.seq_id || 456}</span>
                      </div>
                    </div>
                  </div>

                  {/* Physical Piezo Buzzer & Latched Status */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>85dB Active Siren</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        liveReading?.system_alarm 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {liveReading?.system_alarm ? 'SOUNDING' : 'ARMED / SILENT'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      Autonomous local physical response. Triggers in &lt;10ms without requiring internet.
                    </div>
                  </div>
                </div>

                {/* Right: Controller Core & Gateway (3 Cols) */}
                <div className="lg:col-span-3 space-y-3 font-mono text-xs">
                  <div className="text-slate-400 uppercase tracking-wider text-[11px]">
                    Decoupled Cores
                  </div>

                  {/* Nano */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-sky-400" />
                        Arduino Nano
                      </span>
                      <span className="text-[9px] text-emerald-400 font-normal">16 MHz</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Analog acquisition, 100Hz filtering, load resistance compensation.
                    </div>
                  </div>

                  {/* ESP32 */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                        ESP32 DevKit
                      </span>
                      <span className="text-[9px] text-emerald-400 font-normal">240 MHz</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Safety state machine, Schmitt hysteresis, SSD1306 rendering.
                    </div>
                  </div>

                  {/* ESP32-CAM */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5 text-purple-400" />
                        ESP32-CAM
                      </span>
                      <span className="text-[9px] text-emerald-400 font-normal">Wi-Fi + SD</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Local MicroSD black-box ledger & Supabase cloud dispatch.
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Hardware Specification Strip Underneath */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 px-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Monitored Vectors</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">5 Parameters</div>
                <div className="text-[10px] text-slate-500">CO, VOC, LPG, Temp, RH</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Local Alarm Latency</div>
                <div className="text-base font-bold text-emerald-800 mt-0.5">&lt; 10 ms</div>
                <div className="text-[10px] text-slate-500">Zero Internet Delay</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Architecture</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">3 Controllers</div>
                <div className="text-[10px] text-slate-500">Nano + ESP32 + CAM</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Prototype BOM</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">~$42.50 USD</div>
                <div className="text-[10px] text-slate-500">COTS Accessible Parts</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. The Problem & Core Need */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">The Problem</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
            Hazardous gases accumulate without warning.
          </h2>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto">
            Carbon monoxide is completely odorless. Liquefied petroleum gas leaks can form an explosive air-fuel mix before occupants wake up. Volatile organic compounds silently degrade cognitive and respiratory health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Conventional Detector Limitations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard consumer devices track only a single gas, offer no data logging, lack diagnostic health checks, and provide only a local beep that cannot be recorded or investigated after an incident.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">The SafeBreath Solution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Combines concurrent multi-gas sensing (CO, VOC, LPG), climate monitoring, zero-latency physical alarms, black-box MicroSD flight recording, and cloud alerts into a single cohesive platform.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Product Storytelling Sequence: "THE AIR AROUND US" */}
      <section ref={storyRef} className="space-y-16">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
            Product Storytelling
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            The Journey of a Breath
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Follow how SafeBreath senses, understands, decides, responds, and connects every atmospheric variation in your environment.
          </p>
        </div>

        {/* 5 Story Chapters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm hover:border-slate-300 transition-colors">
            <span className="text-xs font-mono font-bold text-emerald-800">01 · SENSE</span>
            <h3 className="text-base font-bold text-slate-900">The Physical Sensors</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Electrochemical potentiostatic cell for CO, SnO2 semiconductor surfaces for VOC and LPG, plus digital climate thermistor.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm hover:border-slate-300 transition-colors">
            <span className="text-xs font-mono font-bold text-sky-800">02 · UNDERSTAND</span>
            <h3 className="text-base font-bold text-slate-900">Deterministic ADC</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Arduino Nano executes 100 Hz oversampling, digital filtering, and baseline resistance compensation across 1.0 kΩ RL.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm hover:border-slate-300 transition-colors">
            <span className="text-xs font-mono font-bold text-amber-800">03 · DECIDE</span>
            <h3 className="text-base font-bold text-slate-900">State Machine & Hysteresis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ESP32 evaluates SAFE, WARNING, and DANGER levels with Schmitt-trigger hysteresis to eliminate rapid alarm oscillation.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm hover:border-slate-300 transition-colors">
            <span className="text-xs font-mono font-bold text-rose-800">04 · RESPOND</span>
            <h3 className="text-base font-bold text-slate-900">Acoustic & OLED</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Triggers the 85 dB active piezo buzzer in &lt;10 ms and renders high-contrast monochrome telemetry to the SSD1306 screen.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm hover:border-slate-300 transition-colors">
            <span className="text-xs font-mono font-bold text-purple-800">05 · CONNECT</span>
            <h3 className="text-base font-bold text-slate-900">Cloud & Flight Log</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ESP32-CAM writes to local MicroSD flash and syncs to Supabase, dispatching emergency push alerts to the Android app.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Live Telemetry Experience */}
      <section className="space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
            Real-Time Observability
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Live Atmospheric Telemetry Stream
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Continuous atmospheric parameter monitoring demonstrating real-time concentration tracking, unit metrics, and safety baselines.
          </p>
        </div>

        <LiveTelemetryExperience />
      </section>

      {/* 5. Interactive Hardware Explorer & Official Circuit Diagram */}
      <section id="technology" className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
              Subsystem Engineering & Schematics
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              SafeBreath V3 Hardware Architecture
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Explore the complete physical circuitry, microcontroller inter-board serial interconnects, and atmospheric sensor topology.
            </p>
          </div>

          {/* Toggle between Circuit Diagram and Topology */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setHardwareSubView('circuit')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                hardwareSubView === 'circuit'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Official Circuit Diagram
            </button>
            <button
              onClick={() => setHardwareSubView('topology')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                hardwareSubView === 'topology'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Component Bus Topology
            </button>
          </div>
        </div>

        {hardwareSubView === 'circuit' ? (
          <CircuitDiagramViewer />
        ) : (
          <InteractiveHardwareExplorer />
        )}
      </section>

      {/* 6. System Architecture Flow */}
      <section id="system" className="space-y-6 pt-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
            End-to-End Pipeline
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Distributed System Architecture
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            From atmospheric gas interaction through microsecond-sensitive ADC acquisition to cloud telemetry dispatch.
          </p>
        </div>

        <InteractiveSystemArchitecture />
      </section>

      {/* 7. Local Safety vs Cloud Independence */}
      <section id="safety" className="pt-6">
        <LocalSafetySection />
      </section>

      {/* 8. Safety Logic & Threshold State Engine */}
      <section className="space-y-6 pt-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
            Onboard Intelligence
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Safety Logic, Thresholds & Hysteresis
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Inspect how the firmware evaluates safe, warning, and danger states across CO, VOC, LPG, and ambient temperature.
          </p>
        </div>

        <SafetyStateEngine />
      </section>

      {/* 9. Data Logging & Telemetry Record */}
      <section id="data" className="space-y-6 pt-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
            Realtime Telemetry Ledger
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Data Logging & Telemetry Traceability
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            SafeBreath records telemetry locally on MicroSD storage and synchronizes directly to Supabase <code className="text-emerald-800 font-mono text-xs">public.sensor_logs</code> for real-time verification and historical trend analysis.
          </p>
        </div>

        <DataHistorySection />
      </section>

      {/* 10. Connected Ecosystem */}
      <section id="app" className="pt-6">
        <EcosystemSection />
      </section>

      {/* 11. Technical Specifications, Metrology & Calibration */}
      <section className="space-y-6 pt-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
            Engineering Documentation
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Technical Specifications & Metrology
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Reproducible calibration baselines, mathematical formulas, UART packet specs, and prototype Bill of Materials.
          </p>
        </div>

        <TechnicalSpecsSection />
      </section>

      {/* 12. Interactive Hardware Test Bench & Simulator */}
      <section id="simulator" className="space-y-6 pt-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
            Live Instrument
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Interactive Hardware Test Bench
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Test the entire embedded loop in real time: adjust gas concentrations, inject sensor faults, listen to the 85dB buzzer, and inspect simulated cloud packets.
          </p>
        </div>

        <PrecisionHardwareSimulator />
      </section>

    </div>
  );
};
