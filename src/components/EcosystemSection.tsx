import React from 'react';
import { Wifi, Database, BellRing, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DownloadAppButton } from './DownloadAppButton';
import { SafeBreathShieldSymbol, SafeBreath3DAppIcon } from './SafeBreathLogo';
import { SensorLogRow } from '../lib/supabase';
import { useLiveTelemetry, LiveTelemetryState } from '../lib/useLiveTelemetry';
import { evaluateTelemetrySafety } from '../lib/safetyConfig';

interface EcosystemSectionProps {
  liveReading?: SensorLogRow | null;
  telemetry?: LiveTelemetryState;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({
  liveReading: propReading,
  telemetry: propTelemetry,
}) => {
  const internalTelemetry = useLiveTelemetry();
  const activeTelemetry = propTelemetry ?? internalTelemetry;
  const reading = propReading !== undefined ? propReading : activeTelemetry.currentLog;
  const isLoading = activeTelemetry.isLoading && !reading;
  const lastFetchedAt = activeTelemetry.lastFetchedAt;
  const isRealtimeConnected = activeTelemetry.isRealtimeConnected;

  const safety = evaluateTelemetrySafety(reading, { checkCloudAge: true });
  const isDanger =
    safety.status === 'DANGER' || (safety.status === 'STALE' && safety.lastKnownSeverity === 'DANGER');
  const isFault = safety.status === 'SENSOR FAULT';
  const isWarnOrStaleOrUnknown =
    safety.status === 'WARNING' || safety.status === 'STALE' || safety.status === 'UNKNOWN';

  const coDisplay = isLoading
    ? '—'
    : reading
    ? reading.co_valid === false
      ? 'FAULT'
      : reading.co_ppm
    : '—';
  const vocDisplay = isLoading
    ? '—'
    : reading
    ? reading.voc_valid === false
      ? 'FAULT'
      : reading.voc_ppm
    : '—';
  const lpgDisplay = isLoading
    ? '—'
    : reading
    ? reading.lpg_valid === false
      ? 'FAULT'
      : reading.lpg_ppm
    : '—';
  const tempDisplay = isLoading
    ? '—'
    : reading
    ? reading.dht_valid === false
      ? 'DHT Fault'
      : `${reading.temp}°C`
    : '— °C';
  const humDisplay = isLoading
    ? '—'
    : reading
    ? reading.dht_valid === false
      ? 'DHT Fault'
      : `${reading.hum}% RH`
    : '— % RH';
  const fetchClock = lastFetchedAt ? lastFetchedAt.toLocaleTimeString() : 'Syncing…';

  const phoneStatusLabel = !reading
    ? 'NO PACKET'
    : safety.status === 'STALE'
    ? safety.lastKnownSeverity === 'DANGER'
      ? 'LAST KNOWN: DANGER'
      : 'DATA STALE'
    : safety.status === 'DANGER'
    ? 'ALARM ACTIVE'
    : safety.status === 'SENSOR FAULT'
    ? 'SENSOR FAULT'
    : safety.status === 'WARNING'
    ? 'WARNING'
    : safety.status === 'UNKNOWN'
    ? 'UNVERIFIED'
    : 'NORMAL';

  const phoneHeaderNodeLabel = isLoading
    ? 'SYNCING NODE…'
    : !reading
    ? 'AWAITING TELEMETRY'
    : safety.isStale
    ? 'HEARTBEAT STALE'
    : reading.nano_online === false
    ? 'NANO OFFLINE'
    : reading.nano_online === true
    ? 'NODE ONLINE'
    : 'UNVERIFIED NODE';

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="text-sm font-medium text-emerald-700">
          Connected Ecosystem · Mobile &amp; Cloud
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#1D1D1F] text-balance leading-[1.08]">
          Autonomous at the edge. Connected in your pocket.
        </h2>
        <p className="text-[#6E6E73] text-sm sm:text-base leading-relaxed">
          The physical SafeBreath unit protects the room even with zero internet. Meanwhile, Supabase cloud persistence streams live telemetry packets into the web dashboard and the Android companion client.
        </p>
      </div>

      {/* Flagship Android Phone Showcase + Feature Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Live Supabase-Fed Android Phone Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[316px] rounded-[42px] bg-[#141416] p-3 shadow-[0_32px_72px_-18px_rgba(0,0,0,0.32)] border-[3px] border-[#2C2C2E] relative">
            {/* Speaker / Camera Notch */}
            <div className="w-20 h-1.5 bg-[#2C2C2E] rounded-full mx-auto mb-3" />

            {/* Phone Screen Canvas */}
            <div className="rounded-[30px] bg-[#0B0D12] text-white p-4 space-y-4 border border-white/10">
              {/* App Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <SafeBreath3DAppIcon size={34} />
                  <div>
                    <div className="text-xs font-bold tracking-tight text-white">SafeBreath V3</div>
                    <div
                      className={`text-[10px] font-mono ${
                        isLoading
                          ? 'text-amber-300'
                          : !reading
                          ? 'text-slate-400'
                          : safety.isStale || reading.nano_online !== true
                          ? 'text-amber-300'
                          : 'text-emerald-400'
                      }`}
                    >
                      {phoneHeaderNodeLabel}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isLoading
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : isRealtimeConnected
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                  }`}
                >
                  {isLoading ? 'SYNC' : isRealtimeConnected ? 'LIVE' : 'POLL'}
                </span>
              </div>

              {/* Air Safety Dial */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-center space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  ENVIRONMENT STATUS {reading ? `· #${reading.id}` : ''}
                </div>
                {isLoading ? (
                  <div className="h-8 w-36 mx-auto rounded-lg bg-white/10 animate-pulse" />
                ) : (
                  <div
                    className={`text-xl font-extrabold font-mono tracking-tight ${
                      !reading
                        ? 'text-slate-300'
                        : isDanger || isFault
                        ? 'text-rose-400'
                        : isWarnOrStaleOrUnknown
                        ? 'text-amber-300'
                        : 'text-emerald-400'
                    }`}
                  >
                    {phoneStatusLabel}
                  </div>
                )}
                <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {tempDisplay} · {humDisplay}
                </div>
              </div>

              {/* Live Sensor Rows Inside Phone (100% Supabase-Driven) */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="rounded-xl bg-white/[0.04] border border-white/10 py-2.5 px-1">
                  <div className="text-[9px] text-slate-400">CO</div>
                  <div
                    className={`text-sm font-bold tabular-nums mt-0.5 ${
                      reading?.co_valid === false
                        ? 'text-rose-400'
                        : reading && reading.co_valid !== true
                        ? 'text-amber-300'
                        : 'text-white'
                    }`}
                  >
                    {isLoading ? (
                      <span className="inline-block h-4 w-8 rounded bg-white/10 animate-pulse" />
                    ) : (
                      coDisplay
                    )}
                  </div>
                  <div className="text-[9px] text-sky-400">ppm</div>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/10 py-2.5 px-1">
                  <div className="text-[9px] text-slate-400">VOC Ind.</div>
                  <div
                    className={`text-sm font-bold tabular-nums mt-0.5 ${
                      reading?.voc_valid === false
                        ? 'text-rose-400'
                        : reading && reading.voc_valid !== true
                        ? 'text-amber-300'
                        : 'text-white'
                    }`}
                  >
                    {isLoading ? (
                      <span className="inline-block h-4 w-8 rounded bg-white/10 animate-pulse" />
                    ) : (
                      vocDisplay
                    )}
                  </div>
                  <div className="text-[9px] text-emerald-400">idx</div>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/10 py-2.5 px-1">
                  <div className="text-[9px] text-slate-400">LPG</div>
                  <div
                    className={`text-sm font-bold tabular-nums mt-0.5 ${
                      reading?.lpg_valid === false
                        ? 'text-rose-400'
                        : reading && reading.lpg_valid !== true
                        ? 'text-amber-300'
                        : 'text-white'
                    }`}
                  >
                    {isLoading ? (
                      <span className="inline-block h-4 w-8 rounded bg-white/10 animate-pulse" />
                    ) : (
                      lpgDisplay
                    )}
                  </div>
                  <div className="text-[9px] text-amber-400">ppm</div>
                </div>
              </div>

              {/* Honest Alert Preview (UI Demo) + Live Fetch Footer */}
              <div
                className={`rounded-xl p-3 space-y-1 border ${
                  isDanger || isFault
                    ? 'bg-rose-950/60 border-rose-500/40'
                    : isWarnOrStaleOrUnknown
                    ? 'bg-amber-950/50 border-amber-500/40'
                    : 'bg-slate-900/80 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isDanger || isFault
                        ? 'text-rose-300'
                        : isWarnOrStaleOrUnknown
                        ? 'text-amber-300'
                        : 'text-emerald-300'
                    }`}
                  >
                    <BellRing className="w-3 h-3" />
                    ALERT PREVIEW (UI DEMO)
                  </span>
                  <span className="text-slate-400 tabular-nums" title="Last browser DB fetch">
                    Fetch {fetchClock}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  {isDanger
                    ? 'Client hazard banner rendered from live Supabase row. Server push notifications require backend FCM integration.'
                    : safety.status === 'STALE' || isFault || safety.status === 'UNKNOWN'
                    ? `Client notice: ${safety.reason}`
                    : 'Live readings stream from public.sensor_logs. Push alerts require server-side FCM integration.'}
                </p>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-24 h-1 bg-[#3A3A3C] rounded-full mx-auto mt-3" />
          </div>
        </div>

        {/* Right: Commercial App Details & Architecture Roles */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <SafeBreath3DAppIcon size={58} className="shrink-0" />
              <div>
                <div className="text-xs font-mono font-semibold text-emerald-700">
                  Official Android Client · V3
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
                  SafeBreath V3 for Android
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
              Monitor live indoor telemetry directly from Supabase, inspect sensor validity and heartbeat freshness, review historical gas curves, and pair with FCM client support (requires backend push integration for remote wakeups).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-xs sm:text-sm text-[#1D1D1F]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real-time CO, VOC indicator, LPG &amp; climate metrics</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>FCM client support (requires backend push integration)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Node diagnostic, staleness &amp; fault verification</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct APK install (no Play Store wait)</span>
              </div>
            </div>

            <div className="pt-2">
              <DownloadAppButton variant="card" />
            </div>
          </div>

          {/* 4-Step Pipeline Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-black/[0.06] rounded-2xl bg-[#F5F5F7] divide-y sm:divide-y-0 sm:divide-x divide-black/[0.06]">
            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-700">01 · Edge</span>
                <SafeBreathShieldSymbol size={18} />
              </div>
              <div className="text-xs font-bold text-[#1D1D1F]">Monitor</div>
              <div className="text-[11px] text-[#6E6E73]">&lt;10 ms MCU target</div>
            </div>

            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-sky-700">02 · Gateway</span>
                <Wifi className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-xs font-bold text-[#1D1D1F]">ESP32-CAM</div>
              <div className="text-[11px] text-[#6E6E73]">Wi-Fi + SD_MMC flash</div>
            </div>

            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-700">03 · Cloud</span>
                <Database className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xs font-bold text-[#1D1D1F]">Supabase</div>
              <div className="text-[11px] text-[#6E6E73]">PostgreSQL audit ledger</div>
            </div>

            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#1D1D1F]">04 · Client</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xs font-bold text-[#1D1D1F]">Android App</div>
              <div className="text-[11px] text-[#6E6E73]">Live UI (FCM backend req.)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
