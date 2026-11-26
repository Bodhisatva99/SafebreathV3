import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NavSection } from '../types';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Cpu,
  Wind,
  Activity,
  Flame,
  Thermometer,
  Droplets,
  Volume2,
  HardDrive,
  RefreshCw,
  FileDown,
} from 'lucide-react';
import { useLiveTelemetry } from '../lib/useLiveTelemetry';
import { evaluateTelemetrySafety, getSafetyBadgeClasses } from '../lib/safetyConfig';
import {
  SYSTEM_SPECS,
  ECONOMICS_SUMMARY,
  BILL_OF_MATERIALS,
  HARDWARE_PINS,
} from '../data/hardwareData';
import { DownloadAppButton } from '../components/DownloadAppButton';
import { SafeBreathShieldSymbol } from '../components/SafeBreathLogo';
import { CircuitDiagramViewer } from '../components/CircuitDiagramViewer';
import { LiveTelemetryExperience } from '../components/LiveTelemetryExperience';
import { InteractiveHardwareExplorer } from '../components/InteractiveHardwareExplorer';
import { InteractiveSystemArchitecture } from '../components/InteractiveSystemArchitecture';
import { LocalSafetySection } from '../components/LocalSafetySection';
import { SafetyStateEngine } from '../components/SafetyStateEngine';
import { DataHistorySection } from '../components/DataHistorySection';
import { EcosystemSection } from '../components/EcosystemSection';
import { TechnicalSpecsSection } from '../components/TechnicalSpecsSection';
import { ValidationReadinessSection } from '../components/ValidationReadinessSection';
import { PrecisionHardwareSimulator } from '../components/PrecisionHardwareSimulator';
import { WhyItMattersSection } from '../components/WhyItMattersSection';

interface ProductPageProps {
  onNavigate: (section: NavSection) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ onNavigate }) => {
  const telemetry = useLiveTelemetry();
  const {
    currentLog: liveReading,
    isLoading,
    isRefreshing,
    lastFetchedAt,
    cloudCreatedAt,
    hasTrueSampleTimestamp,
    isRealtimeConnected,
    error: telemetryError,
    refresh,
  } = telemetry;

  const [engineeringTab, setEngineeringTab] = useState<'explorer' | 'pipeline' | 'circuit'>('explorer');
  const [dataTab, setDataTab] = useState<'live' | 'history'>('live');

  const safety = evaluateTelemetrySafety(liveReading, { checkCloudAge: true });
  const cloudClock = cloudCreatedAt ? cloudCreatedAt.toLocaleTimeString() : '—';
  const heroFetchClock = lastFetchedAt ? lastFetchedAt.toLocaleTimeString() : 'Syncing…';

  const statusDotColor = !liveReading
    ? 'bg-slate-400'
    : safety.status === 'DANGER' || safety.status === 'SENSOR FAULT'
    ? 'bg-rose-600'
    : safety.status === 'WARNING' || safety.status === 'STALE' || safety.status === 'UNKNOWN'
    ? 'bg-amber-500'
    : 'bg-emerald-600';

  const renderHeroValue = (val: number | undefined, isValid?: boolean) => {
    if (isLoading && !liveReading) {
      return <span className="inline-block h-8 w-14 rounded-lg bg-black/[0.08] animate-pulse align-middle" />;
    }
    if (liveReading && isValid === false) {
      return <span className="text-rose-700 text-lg sm:text-xl font-bold">FAULT</span>;
    }
    if (val === undefined || val === null || !Number.isFinite(val)) {
      return '—';
    }
    return (
      <span className={liveReading && isValid !== true ? 'text-amber-700' : 'text-[#1D1D1F]'}>
        {val}
      </span>
    );
  };

  const downloadJsonSpec = (filename: string, payload: unknown) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full overflow-x-hidden bg-white text-[#1D1D1F]">
      {/* BAND 1: Flagship Product Hero (Zero AI Stock Images — Real-Time Supabase Telemetry) */}
      <section className="relative bg-[#F5F5F7] pt-14 sm:pt-20 pb-14 sm:pb-20 overflow-hidden border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Headline & Primary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                <SafeBreathShieldSymbol size={20} />
                <span>SafeBreath V3 · Hardware Revision 2.8f</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.035em] leading-[1.05] text-[#1D1D1F] text-balance">
                Detect hidden gas hazards. Alert locally. Preserve the evidence.
              </h1>

              <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed max-w-xl">
                Autonomous multi-gas safety and atmospheric telemetry uniting electrochemical Carbon Monoxide (ZE07-CO), broad-response VOC trend sensing (MQ-135), combustible LPG detection (MQ-6), and ambient climate tracking (DHT11) with an offline &lt; 10 ms MCU decision target.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('data')}
                  className="px-6 py-3.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap min-h-[48px] cursor-pointer shadow-sm"
                >
                  <span>Explore Live Telemetry &amp; Proof</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('simulator')}
                  className="px-5 py-3.5 rounded-full bg-white hover:bg-black/[0.03] text-[#1D1D1F] font-semibold text-sm border border-black/[0.12] transition-colors flex items-center justify-center gap-2 whitespace-nowrap min-h-[48px] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-emerald-600 shrink-0" />
                  <span>Logic Simulator</span>
                </button>

                <DownloadAppButton variant="hero" />
              </div>
            </motion.div>

            {/* Right Real-Time Hardware Node Card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
              className="lg:col-span-6"
            >
              <div className="bg-white rounded-[28px] border border-black/[0.08] p-6 sm:p-8 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.08)] space-y-5">
                {/* Instrument Top Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <SafeBreathShieldSymbol size={24} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1D1D1F]">
                          SafeBreath Live Node {liveReading?.device_id ? `(${liveReading.device_id})` : ''}
                        </span>
                        {!isLoading && liveReading && (
                          <span className={`inline-flex h-2 w-2 rounded-full ${statusDotColor}`} title={safety.headline} />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-[#6E6E73] tabular-nums">
                        {liveReading
                          ? `#${liveReading.id} · ${hasTrueSampleTimestamp ? 'Sampled' : 'Cloud'} ${cloudClock} · Fetch ${heroFetchClock}`
                          : isLoading
                          ? 'Connecting to public.sensor_logs…'
                          : telemetryError
                          ? 'Telemetry unavailable'
                          : 'Awaiting telemetry'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={refresh}
                      disabled={isLoading || isRefreshing}
                      className="p-2 rounded-full bg-[#F5F5F7] hover:bg-black/[0.06] text-[#1D1D1F] border border-black/[0.06] transition-colors disabled:opacity-50 cursor-pointer"
                      aria-label="Refresh live hero readings"
                      title="Refresh live readings"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading || isRefreshing ? 'animate-spin' : ''}`} />
                    </button>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono border ${
                        isLoading && !liveReading
                          ? 'bg-[#F5F5F7] text-[#6E6E73] border-black/[0.08]'
                          : !liveReading
                          ? 'bg-[#F5F5F7] text-[#6E6E73] border-black/[0.08]'
                          : getSafetyBadgeClasses(safety.status)
                      }`}
                    >
                      {isLoading && !liveReading
                        ? 'Syncing…'
                        : !liveReading
                        ? 'No Signal'
                        : safety.status === 'NORMAL'
                        ? isRealtimeConnected
                          ? 'Live: Normal'
                          : 'Verified Normal'
                        : safety.badgeText}
                    </span>
                  </div>
                </div>

                {/* Non-normal diagnostic notice if stale, fault, unknown, warning, or danger */}
                {!isLoading && liveReading && safety.status !== 'NORMAL' && (
                  <div
                    className={`rounded-xl px-3.5 py-2 text-[11px] font-mono border ${
                      safety.status === 'DANGER' || safety.status === 'SENSOR FAULT'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    <span className="font-bold">{safety.headline}:</span> {safety.reason}
                  </div>
                )}

                {/* Live 3 Primary Gas Readouts */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/[0.04]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6E73]">
                      <span>CO</span>
                      <Wind className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums mt-2">
                      {renderHeroValue(liveReading?.co_ppm, liveReading?.co_valid)}
                    </div>
                    <div className="text-[11px] font-mono text-[#86868B] mt-0.5">ppm · ZE07</div>
                  </div>

                  <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/[0.04]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6E73]">
                      <span>VOC Ind.</span>
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums mt-2">
                      {renderHeroValue(liveReading?.voc_ppm, liveReading?.voc_valid)}
                    </div>
                    <div className="text-[11px] font-mono text-[#86868B] mt-0.5">idx · MQ-135</div>
                  </div>

                  <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/[0.04]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6E73]">
                      <span>LPG</span>
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums mt-2">
                      {renderHeroValue(liveReading?.lpg_ppm, liveReading?.lpg_valid)}
                    </div>
                    <div className="text-[11px] font-mono text-[#86868B] mt-0.5">ppm · MQ-6</div>
                  </div>
                </div>

                {/* Climate Summary */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="rounded-xl bg-[#F5F5F7] px-4 py-3 flex items-center justify-between border border-black/[0.04]">
                    <span className="flex items-center gap-1.5 text-[#6E6E73]">
                      <Thermometer className="w-3.5 h-3.5 text-rose-600" />
                      Ambient
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        liveReading?.dht_valid === false
                          ? 'text-rose-700'
                          : liveReading && liveReading.dht_valid !== true
                          ? 'text-amber-700'
                          : 'text-[#1D1D1F]'
                      }`}
                    >
                      {isLoading && !liveReading
                        ? '—'
                        : liveReading
                        ? liveReading.dht_valid === false
                          ? 'Fault'
                          : `${liveReading.temp} °C`
                        : '— °C'}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#F5F5F7] px-4 py-3 flex items-center justify-between border border-black/[0.04]">
                    <span className="flex items-center gap-1.5 text-[#6E6E73]">
                      <Droplets className="w-3.5 h-3.5 text-indigo-600" />
                      Humidity
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        liveReading?.dht_valid === false
                          ? 'text-rose-700'
                          : liveReading && liveReading.dht_valid !== true
                          ? 'text-amber-700'
                          : 'text-[#1D1D1F]'
                      }`}
                    >
                      {isLoading && !liveReading
                        ? '—'
                        : liveReading
                        ? liveReading.dht_valid === false
                          ? 'Fault'
                          : `${liveReading.hum} %`
                        : '— %'}
                    </span>
                  </div>
                </div>

                {/* 3-Node Architecture Strip */}
                <div className="pt-4 border-t border-black/[0.06] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1D1D1F]">3-Node Embedded Topology</span>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('pinout');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        else onNavigate('technology');
                      }}
                      className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View GPIO Pinout &amp; CAD</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="rounded-xl border border-black/[0.06] bg-white p-2.5">
                      <div className="font-bold text-[#1D1D1F] flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span>Nano ADC</span>
                      </div>
                      <div className="text-[#6E6E73] text-[10px] mt-0.5 truncate">A0 · A1 · D2</div>
                    </div>
                    <div className="rounded-xl border border-black/[0.06] bg-white p-2.5">
                      <div className="font-bold text-[#1D1D1F] flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>ESP32 Master</span>
                      </div>
                      <div className="text-[#6E6E73] text-[10px] mt-0.5 truncate">GPIO 4/15 · 13 · 33/32</div>
                    </div>
                    <div className="rounded-xl border border-black/[0.06] bg-white p-2.5">
                      <div className="font-bold text-[#1D1D1F] flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-sky-600 shrink-0" />
                        <span>CAM Gateway</span>
                      </div>
                      <div className="text-[#6E6E73] text-[10px] mt-0.5 truncate">Wi-Fi · SD_MMC</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full-Width Key Specs Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 bg-white rounded-2xl border border-black/[0.06] divide-y lg:divide-y-0 lg:divide-x divide-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="p-5 sm:p-6">
              <div className="text-xs font-mono text-[#6E6E73]">Multi-Channel Array</div>
              <div className="text-lg sm:text-xl font-bold text-[#1D1D1F] mt-1">CO · VOC Ind. · LPG · Temp</div>
              <div className="text-xs text-[#86868B] mt-0.5">Plus exp. SCT-013-030 CT ports</div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="text-xs font-mono text-[#6E6E73]">MCU Decision Loop Target</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-700 mt-1 tabular-nums">&lt; 10 ms Design Target</div>
              <div className="text-xs text-[#86868B] mt-0.5">85 dB @ 10 cm (datasheet) via GPIO 13</div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="text-xs font-mono text-[#6E6E73]">Controller Isolation</div>
              <div className="text-lg sm:text-xl font-bold text-[#1D1D1F] mt-1">3-Node Core</div>
              <div className="text-xs text-[#86868B] mt-0.5">Nano + ESP32 DevKit + CAM</div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="text-xs font-mono text-[#6E6E73]">Telemetry Storage</div>
              <div className="text-lg sm:text-xl font-bold text-[#1D1D1F] mt-1">SD_MMC + Cloud</div>
              <div className="text-xs text-[#86868B] mt-0.5">Local CSV black-box &amp; Supabase</div>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 2: Precision Sensing Bento, Legacy vs SafeBreath, 5-Stage Pipeline & Deployment Environments */}
      <section className="bg-white py-20 sm:py-28 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-6 space-y-5">
              <div className="text-sm font-medium text-emerald-700">
                Precision Atmospheric Protection
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#1D1D1F] leading-[1.08] text-balance">
                Engineered for spaces where air safety is non-negotiable.
              </h2>
              <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
                Carbon monoxide is colorless and odorless. LPG leaks can reach explosive ratios before occupants notice a scent. SafeBreath replaces single-gas beepers with concurrent sensing, explicit fault detection, and auditable event preservation.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-[24px] bg-[#F5F5F7] p-6 sm:p-7 space-y-2.5 border border-black/[0.04]">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Legacy Detectors</span>
                </div>
                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                  Track one gas only, hide silent sensor disconnects, and leave zero historical telemetry logs when an incident occurs.
                </p>
              </div>

              <div className="rounded-[24px] bg-[#F5F5F7] p-6 sm:p-7 space-y-2.5 border border-black/[0.04]">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>SafeBreath V3</span>
                </div>
                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                  Electrochemical CO, SnO2 VOC/LPG, ambient temperature latch, fault isolation, SD_MMC black-box CSV logs, and live Supabase sync.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Pillar Hardware Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F5F5F7] rounded-[28px] p-8 sm:p-9 space-y-2.5 border border-black/[0.04]">
              <div className="flex items-center justify-between text-xs font-mono text-sky-700 font-semibold">
                <span>Carbon Monoxide</span>
                <span>ZE07-CO · GPIO 16/17</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">Electrochemical UART Cell</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Factory-calibrated digital UART module (0–500 ppm range, T90 &le; 60 s per Winsen datasheet) minimizing cooking-vapor and humidity false alarms.
              </p>
            </div>

            <div className="bg-[#F5F5F7] rounded-[28px] p-8 sm:p-9 space-y-2.5 border border-black/[0.04]">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-700 font-semibold">
                <span>Air-Quality Indicator &amp; LPG</span>
                <span>MQ-135 (A0) · MQ-6 (A1)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">100 Hz Oversampled SnO2 Array</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Precision 1.0 kΩ load resistors and dynamic Rs/R0 normalization track broad VOC air-quality trends and propane/butane leaks (&ge; 48 h initial burn-in).
              </p>
            </div>

            <div className="bg-[#F5F5F7] rounded-[28px] p-8 sm:p-9 space-y-2.5 border border-black/[0.04]">
              <div className="flex items-center justify-between text-xs font-mono text-amber-700 font-semibold">
                <span>Ambient &amp; Experimental CT I/O</span>
                <span>DHT11 (D2) · CT1/CT2 (33/32)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">Ambient Monitor &amp; CT Ports</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Tracks ambient temperature (&ge; 45 °C latch, &plusmn;2 °C) and humidity via proprietary single-wire bus. Dual SCT-013-030 CT inputs (internal burden, 1.65V bias on GPIO 33/32) await cloud schema support.
              </p>
            </div>

            <div className="bg-[#F5F5F7] rounded-[28px] p-8 sm:p-9 space-y-2.5 border border-black/[0.04]">
              <div className="flex items-center justify-between text-xs font-mono text-rose-700 font-semibold">
                <span>Offline Acoustic &amp; Display</span>
                <span>GPIO 13 Driver · GPIO 4/15 OLED</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">&lt; 10 ms MCU Decision Target</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                Autonomous ESP32 Schmitt-trigger hysteresis drives the TMB12A05 5V buzzer (85 dB @ 10 cm datasheet) through an NPN/MOSFET driver stage and SSD1306 OLED offline.
              </p>
            </div>
          </div>

          {/* Unboxed 5-Stage Signal Chain */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 pt-8 border-t border-black/[0.08]">
            <div className="space-y-1">
              <div className="text-xs font-mono font-semibold text-emerald-700">01 · Sense</div>
              <div className="text-sm font-bold text-[#1D1D1F]">Electrochemical &amp; SnO2</div>
              <p className="text-xs text-[#6E6E73]">ZE07-CO, MQ-135, MQ-6, DHT11</p>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono font-semibold text-emerald-700">02 · Sample</div>
              <div className="text-sm font-bold text-[#1D1D1F]">100 Hz Nano ADC</div>
              <p className="text-xs text-[#6E6E73]">Oversampled across 1.0 kΩ RL</p>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono font-semibold text-emerald-700">03 · Decide</div>
              <div className="text-sm font-bold text-[#1D1D1F]">Schmitt Hysteresis</div>
              <p className="text-xs text-[#6E6E73]">Zero false-trigger oscillation</p>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono font-semibold text-emerald-700">04 · Respond</div>
              <div className="text-sm font-bold text-[#1D1D1F]">85 dB @ 10 cm Siren</div>
              <p className="text-xs text-[#6E6E73]">GPIO 13 NPN/FET + OLED</p>
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1">
              <div className="text-xs font-mono font-semibold text-emerald-700">05 · Archive</div>
              <div className="text-sm font-bold text-[#1D1D1F]">SD_MMC + Supabase</div>
              <p className="text-xs text-[#6E6E73]">Local CSV + Android client</p>
            </div>
          </div>

          {/* Target Deployment & Impact Environments */}
          <div className="pt-8 border-t border-black/[0.08] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-wider">
                  Target Deployment &amp; Economics
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] mt-1">
                  Built for High-Risk Micro-Environments at Accessible Cost
                </h3>
              </div>
              <div className="text-xs font-mono text-[#6E6E73]">
                Prototype ₹5,270 · Batch Est. ₹3,450 · Nov 2026 INR Basis
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-2xl bg-[#F5F5F7] p-6 border border-black/[0.04] space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-700">01 · Domestic LPG Kitchens</div>
                <h4 className="text-base font-bold text-[#1D1D1F]">Unvented Cylinders &amp; Cooking Stoves</h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Detects slow LPG manifold seepage and incomplete-combustion CO simultaneously while ignoring benign steam via electrochemical CO isolation.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F5F5F7] p-6 border border-black/[0.04] space-y-2">
                <div className="text-xs font-mono font-bold text-sky-700">02 · Enclosed Utility &amp; Generator Bays</div>
                <h4 className="text-base font-bold text-[#1D1D1F]">Off-Grid Exhaust &amp; Dead-Wi-Fi Zones</h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Decoupled local MCU alarm triggers within the &lt; 10 ms design target even without Wi-Fi, while SD_MMC flash logs evidence for post-incident audit.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F5F5F7] p-6 border border-black/[0.04] space-y-2">
                <div className="text-xs font-mono font-bold text-indigo-700">03 · Academic &amp; Fabrication Labs</div>
                <h4 className="text-base font-bold text-[#1D1D1F]">Solvent Fumes &amp; Soldering Benches</h4>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  100 Hz oversampled MQ-135 baseline normalization tracks broad solvent/ammonia fume rises while explicit fault flags prevent silent probe disconnects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 3: Live Atmospheric Telemetry & Audit Ledger */}
      <section id="data" className="bg-white py-20 sm:py-28 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="max-w-2xl space-y-2.5">
              <div className="text-sm font-medium text-emerald-700">
                Live Atmospheric Telemetry
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#1D1D1F] leading-[1.08]">
                Real-Time Stream &amp; Database Audit Ledger
              </h2>
              <p className="text-[#6E6E73] text-sm sm:text-base leading-relaxed">
                Live telemetry packets queried and streamed directly from Supabase <code className="font-mono text-xs text-emerald-700">public.sensor_logs</code>.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#F5F5F7] rounded-full border border-black/[0.08] self-start md:self-auto">
              <button
                type="button"
                onClick={() => setDataTab('live')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap min-h-[36px] cursor-pointer ${
                  dataTab === 'live' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Live Stream &amp; Charts
              </button>
              <button
                type="button"
                onClick={() => setDataTab('history')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap min-h-[36px] cursor-pointer ${
                  dataTab === 'history' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Historical Audit Ledger
              </button>
            </div>
          </div>

          {dataTab === 'live' ? (
            <LiveTelemetryExperience telemetry={telemetry} />
          ) : (
            <DataHistorySection />
          )}
        </div>
      </section>

      {/* BAND 4: Verified Public Health Evidence */}
      <section className="bg-[#F5F5F7] py-20 sm:py-28 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WhyItMattersSection />
        </div>
      </section>

      {/* BAND 5: Autonomous Dual-Loop Safety & Threshold Hysteresis Explorer */}
      <section id="safety" className="bg-white py-20 sm:py-28 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <LocalSafetySection />

          <div className="space-y-8 pt-10 border-t border-black/[0.08]">
            <div className="max-w-2xl space-y-2.5">
              <div className="text-sm font-medium text-emerald-700">
                Onboard Safety Intelligence
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
                Thresholds &amp; Hysteresis Evaluation
              </h2>
              <p className="text-[#6E6E73] text-sm sm:text-base leading-relaxed">
                Interactive threshold explorer demonstrating how SafeBreath transitions smoothly across Safe, Warning, and Danger states without false-trigger oscillation.
              </p>
            </div>

            <SafetyStateEngine />
          </div>
        </div>
      </section>

      {/* BAND 6: Hardware Architecture, Schematics, GPIO Pinout, Bench Validation & Engineering Document Center */}
      <section id="technology" className="bg-[#F5F5F7] py-20 sm:py-28 border-b border-black/[0.06]">
        <div id="system" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="max-w-2xl space-y-2.5">
                <div className="text-sm font-medium text-emerald-700">
                  Hardware Architecture · Rev 2.8f
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
                  Components, Schematics &amp; Metrology
                </h2>
                <p className="text-[#6E6E73] text-sm sm:text-base leading-relaxed">
                  Explore the physical bus topology, 7-stage signal pipeline, interactive CAD schematic, verified Rev 2.8f GPIO pinout matrix, and bench validation checklist below.
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-black/[0.08] self-start lg:self-auto overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setEngineeringTab('explorer')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    engineeringTab === 'explorer' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Component Explorer
                </button>
                <button
                  type="button"
                  onClick={() => setEngineeringTab('pipeline')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    engineeringTab === 'pipeline' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  7-Stage Pipeline
                </button>
                <button
                  type="button"
                  onClick={() => setEngineeringTab('circuit')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    engineeringTab === 'circuit' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  Circuit CAD (Rev 2.8f)
                </button>
              </div>
            </div>

            {engineeringTab === 'explorer' && <InteractiveHardwareExplorer />}
            {engineeringTab === 'pipeline' && <InteractiveSystemArchitecture />}
            {engineeringTab === 'circuit' && <CircuitDiagramViewer />}
          </div>

          {/* Always-Accessible Rev 2.8f GPIO Pinout Reference, Calibration Math & BOM */}
          <TechnicalSpecsSection />

          {/* Bench Validation Matrix & Prototype Readiness */}
          <ValidationReadinessSection />

          {/* Engineering Document Center */}
          <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="text-xs font-mono font-semibold text-emerald-700">
                Engineering Document Center · Rev 2.8f
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F]">
                Exportable Hardware Schematics, Pinout &amp; BOM Packages
              </h3>
              <p className="text-xs text-[#6E6E73]">
                Download structured Rev 2.8f JSON specification artifacts for judging dossiers or inspect the interactive CAD view above.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEngineeringTab('circuit');
                  const el = document.getElementById('technology');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F5F5F7] hover:bg-black/5 border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] cursor-pointer"
              >
                <span>Open Rev 2.8f CAD</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadJsonSpec('safebreath-rev2.8f-bom-pinout.json', {
                    revision: SYSTEM_SPECS.version,
                    economics: ECONOMICS_SUMMARY,
                    pinout: HARDWARE_PINS,
                    bom: BILL_OF_MATERIALS,
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Pinout &amp; BOM (JSON)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 7: Connected Ecosystem & Live Supabase-Fed Android Showcase */}
      <section id="app" className="bg-white py-20 sm:py-28 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EcosystemSection telemetry={telemetry} />
        </div>
      </section>

      {/* BAND 8: Interactive Safety Logic Simulator */}
      <section id="simulator" className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2.5">
              <div className="text-sm font-medium text-emerald-700">
                Interactive Safety Logic Simulator · Client-Side Model
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
                Simulate the Hysteresis &amp; Fault Logic
              </h2>
              <p className="text-[#6E6E73] text-sm sm:text-base leading-relaxed">
                Inject synthetic gas spikes, simulate sensor disconnects, audition browser-synthesized 2.4 kHz audio alerts, and inspect simulated SD_MMC CSV and payload previews without touching physical hardware.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('data')}
              className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Inspect Live Hardware Stream</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <PrecisionHardwareSimulator />
        </div>
      </section>
    </div>
  );
};
