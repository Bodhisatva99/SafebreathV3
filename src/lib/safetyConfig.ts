import { SensorLogRow } from './supabase';

export type SafetyClassification =
  | 'NORMAL'
  | 'WARNING'
  | 'DANGER'
  | 'SENSOR FAULT'
  | 'STALE'
  | 'UNKNOWN';

export interface SafetyEvaluation {
  status: SafetyClassification;
  badgeText: string;
  headline: string;
  reason: string;
  isStale: boolean;
  hasFault: boolean;
  hasMissingData: boolean;
  lastKnownSeverity: 'NORMAL' | 'WARNING' | 'DANGER' | 'UNKNOWN';
  staleAgeMs: number | null;
}

export const TELEMETRY_FRESHNESS = {
  /** Device-reported data age threshold (ms) */
  MAX_DEVICE_DATA_AGE_MS: 15000,
  /** Cloud row timestamp staleness threshold (ms) */
  MAX_CLOUD_ROW_AGE_MS: 60000,
} as const;

export const SHARED_THRESHOLDS = {
  co: {
    warnEnter: 35,
    warnClear: 30,
    dangerEnter: 70,
    dangerClear: 65,
    hysteresis: 5,
    maxScale: 250,
    unit: 'ppm',
    nioshRelTwa: 35,
    nioshCeiling: 200,
  },
  voc: {
    warnEnter: 200,
    warnClear: 180,
    dangerEnter: 400,
    dangerClear: 380,
    hysteresis: 20,
    maxScale: 600,
    unit: 'ind.',
  },
  lpg: {
    warnEnter: 500,
    warnClear: 450,
    dangerEnter: 1500,
    dangerClear: 1450,
    hysteresis: 50,
    maxScale: 2500,
    unit: 'ppm',
  },
  temp: {
    warnEnter: 40,
    warnClear: 38,
    dangerEnter: 45,
    dangerClear: 40,
    hysteresis: 5,
    maxScale: 60,
    unit: '°C',
  },
} as const;

/**
 * Standard CRC-16-CCITT (polynomial 0x1021, initial value 0xFFFF).
 * Used for SafeBreath binary UART frame verification.
 */
export function computeCrc16Ccitt(bytes: number[]): number {
  let crc = 0xffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= (bytes[i] & 0xff) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc;
}

/**
 * Stateful hysteresis transition evaluator matching embedded Schmitt-trigger logic.
 * Danger recovery correctly holds WARNING until the warning-clear deadband is crossed.
 */
export function evaluateHysteresisTransition(
  hazard: 'co' | 'voc' | 'lpg' | 'temp',
  value: number,
  previousState: 'SAFE' | 'WARNING' | 'DANGER'
): 'SAFE' | 'WARNING' | 'DANGER' {
  const cfg = SHARED_THRESHOLDS[hazard];

  if (hazard === 'temp') {
    if (value >= cfg.dangerEnter) return 'DANGER';
    if (previousState === 'DANGER') {
      if (value >= cfg.dangerClear) return 'DANGER';
      return value >= cfg.warnClear ? 'WARNING' : 'SAFE';
    }
    if (value >= cfg.warnEnter) return 'WARNING';
    if (previousState === 'WARNING') {
      return value >= cfg.warnClear ? 'WARNING' : 'SAFE';
    }
    return 'SAFE';
  }

  // Gas channels: enter above threshold, clear at or below hysteresis band
  if (value > cfg.dangerEnter) return 'DANGER';
  if (previousState === 'DANGER') {
    if (value > cfg.dangerClear) return 'DANGER';
    return value > cfg.warnClear ? 'WARNING' : 'SAFE';
  }
  if (value > cfg.warnEnter) return 'WARNING';
  if (previousState === 'WARNING') {
    return value > cfg.warnClear ? 'WARNING' : 'SAFE';
  }
  return 'SAFE';
}

/**
 * Strict fail-safe evaluator for live and historical Supabase telemetry records.
 * Never reports NORMAL unless ALL mandatory readings, validity flags, subsystem
 * health flags, and freshness fields are positively verified.
 */
export function evaluateTelemetrySafety(
  row: SensorLogRow | null | undefined,
  options: { checkCloudAge?: boolean; nowMs?: number } = {}
): SafetyEvaluation {
  if (!row) {
    return {
      status: 'UNKNOWN',
      badgeText: 'Unknown',
      headline: 'INSUFFICIENT TELEMETRY',
      reason: 'No telemetry record available to evaluate room safety.',
      isStale: false,
      hasFault: false,
      hasMissingData: true,
      lastKnownSeverity: 'UNKNOWN',
      staleAgeMs: null,
    };
  }

  const nowMs = options.nowMs ?? Date.now();
  const checkCloudAge = options.checkCloudAge ?? true;

  const createdMs = Date.parse(row.created_at);
  const hasValidCreatedAt = Number.isFinite(createdMs);
  const cloudAgeMs = hasValidCreatedAt ? Math.max(0, nowMs - createdMs) : null;

  const hasValidDataAge = typeof row.data_age_ms === 'number' && Number.isFinite(row.data_age_ms);
  const isDeviceStale =
    hasValidDataAge && row.data_age_ms > TELEMETRY_FRESHNESS.MAX_DEVICE_DATA_AGE_MS;
  const isCloudStale =
    checkCloudAge && cloudAgeMs !== null && cloudAgeMs > TELEMETRY_FRESHNESS.MAX_CLOUD_ROW_AGE_MS;
  const isStale = isDeviceStale || isCloudStale;

  const hasFiniteReadings =
    typeof row.co_ppm === 'number' &&
    Number.isFinite(row.co_ppm) &&
    typeof row.voc_ppm === 'number' &&
    Number.isFinite(row.voc_ppm) &&
    typeof row.lpg_ppm === 'number' &&
    Number.isFinite(row.lpg_ppm) &&
    typeof row.temp === 'number' &&
    Number.isFinite(row.temp) &&
    typeof row.hum === 'number' &&
    Number.isFinite(row.hum);

  const isCoDanger =
    row.state_co === 2 || (Number.isFinite(row.co_ppm) && row.co_ppm > SHARED_THRESHOLDS.co.dangerEnter);
  const isVocDanger =
    row.state_voc === 2 || (Number.isFinite(row.voc_ppm) && row.voc_ppm > SHARED_THRESHOLDS.voc.dangerEnter);
  const isLpgDanger =
    row.state_lpg === 2 || (Number.isFinite(row.lpg_ppm) && row.lpg_ppm > SHARED_THRESHOLDS.lpg.dangerEnter);
  const isTempDanger =
    Boolean(row.thermal_latched) || (Number.isFinite(row.temp) && row.temp >= SHARED_THRESHOLDS.temp.dangerEnter);

  const isCoWarn =
    row.state_co === 1 || (Number.isFinite(row.co_ppm) && row.co_ppm > SHARED_THRESHOLDS.co.warnEnter);
  const isVocWarn =
    row.state_voc === 1 || (Number.isFinite(row.voc_ppm) && row.voc_ppm > SHARED_THRESHOLDS.voc.warnEnter);
  const isLpgWarn =
    row.state_lpg === 1 || (Number.isFinite(row.lpg_ppm) && row.lpg_ppm > SHARED_THRESHOLDS.lpg.warnEnter);
  const isTempWarn = Number.isFinite(row.temp) && row.temp >= SHARED_THRESHOLDS.temp.warnEnter;

  // Treat system_alarm or channel danger states as DANGER; alert_flag alone without channel breach is treated as WARNING
  const hasGasDanger =
    row.system_alarm === true ||
    isCoDanger ||
    isVocDanger ||
    isLpgDanger ||
    isTempDanger;

  const hasGasWarn =
    row.alert_flag === true || isCoWarn || isVocWarn || isLpgWarn || isTempWarn;

  const lastKnownSeverity: 'NORMAL' | 'WARNING' | 'DANGER' | 'UNKNOWN' = hasGasDanger
    ? 'DANGER'
    : hasGasWarn
    ? 'WARNING'
    : hasFiniteReadings
    ? 'NORMAL'
    : 'UNKNOWN';

  // Distinguish explicit invalid flags (false) vs missing/unverified metadata (!== true)
  const hasExplicitInvalid =
    row.co_valid === false ||
    row.voc_valid === false ||
    row.lpg_valid === false ||
    row.dht_valid === false;

  const hasExplicitOffline = row.nano_online === false || row.ze07_online === false;
  const hasExplicitFault = row.system_fault === true || hasExplicitInvalid || hasExplicitOffline;

  const hasUnknownValidity =
    row.co_valid !== true ||
    row.voc_valid !== true ||
    row.lpg_valid !== true ||
    row.dht_valid !== true ||
    row.nano_online !== true ||
    row.ze07_online !== true;

  const hasMissingTimestampInfo = !hasValidCreatedAt || (checkCloudAge && !hasValidDataAge);
  const hasMissingData = !hasFiniteReadings || hasUnknownValidity || hasMissingTimestampInfo;

  const hasDegraded =
    row.system_degraded === true ||
    row.ev_loss === true ||
    (typeof row.dropped_events === 'number' && row.dropped_events > 0);

  // Critical fail-safe rule: stale telemetry after DANGER never reverts to safe
  if (isStale) {
    if (lastKnownSeverity === 'DANGER') {
      return {
        status: 'STALE',
        badgeText: 'Last Known: Danger — Data Stale',
        headline: 'LAST KNOWN: DANGER — DATA STALE',
        reason: 'Last packet reported a danger condition, but live heartbeat is stale.',
        isStale: true,
        hasFault: hasExplicitFault,
        hasMissingData,
        lastKnownSeverity,
        staleAgeMs: cloudAgeMs ?? (hasValidDataAge ? row.data_age_ms : null),
      };
    }
    return {
      status: 'STALE',
      badgeText: lastKnownSeverity === 'WARNING' ? 'Last Known: Warning — Stale' : 'Data Stale',
      headline: lastKnownSeverity === 'WARNING' ? 'LAST KNOWN: WARNING — DATA STALE' : 'TELEMETRY STALE',
      reason: isDeviceStale
        ? `Device packet age (${row.data_age_ms} ms) exceeds ${TELEMETRY_FRESHNESS.MAX_DEVICE_DATA_AGE_MS} ms freshness window.`
        : 'Latest cloud insert is older than 60 s; awaiting fresh heartbeat from ESP32-CAM gateway.',
      isStale: true,
      hasFault: hasExplicitFault,
      hasMissingData,
      lastKnownSeverity,
      staleAgeMs: cloudAgeMs ?? (hasValidDataAge ? row.data_age_ms : null),
    };
  }

  if (hasGasDanger) {
    const causes: string[] = [];
    if (isCoDanger) causes.push(`CO ${row.co_ppm} ppm`);
    if (isLpgDanger) causes.push(`LPG ${row.lpg_ppm} ppm`);
    if (isVocDanger) causes.push(`MQ-135 ${row.voc_ppm}`);
    if (isTempDanger) causes.push(`Temp ${row.temp}°C`);
    return {
      status: 'DANGER',
      badgeText: 'Danger Active',
      headline: 'DANGER CONDITION',
      reason: causes.length > 0 ? `Threshold breach: ${causes.join(' · ')}` : 'Active system alarm reported.',
      isStale: false,
      hasFault: hasExplicitFault,
      hasMissingData,
      lastKnownSeverity: 'DANGER',
      staleAgeMs: cloudAgeMs,
    };
  }

  if (hasExplicitFault || !hasFiniteReadings) {
    const faults: string[] = [];
    if (row.system_fault === true) faults.push('System fault flag');
    if (row.co_valid === false) faults.push('ZE07-CO invalid');
    if (row.voc_valid === false) faults.push('MQ-135 invalid');
    if (row.lpg_valid === false) faults.push('MQ-6 invalid');
    if (row.dht_valid === false) faults.push('DHT22 invalid');
    if (row.nano_online === false) faults.push('Nano offline');
    if (row.ze07_online === false) faults.push('ZE07 UART offline');
    if (!hasFiniteReadings) faults.push('Non-finite sensor reading(s)');
    return {
      status: 'SENSOR FAULT',
      badgeText: 'Sensor Fault',
      headline: 'SENSOR FAULT',
      reason: `Cannot certify normal state: ${faults.join(', ')}.`,
      isStale: false,
      hasFault: true,
      hasMissingData,
      lastKnownSeverity,
      staleAgeMs: cloudAgeMs,
    };
  }

  // Positive-verification gate: missing validity, subsystem flags, or timestamps yield UNKNOWN (never NORMAL)
  if (hasUnknownValidity || hasMissingTimestampInfo) {
    const missing: string[] = [];
    if (row.co_valid !== true) missing.push('co_valid');
    if (row.voc_valid !== true) missing.push('voc_valid');
    if (row.lpg_valid !== true) missing.push('lpg_valid');
    if (row.dht_valid !== true) missing.push('dht_valid');
    if (row.nano_online !== true) missing.push('nano_online');
    if (row.ze07_online !== true) missing.push('ze07_online');
    if (!hasValidCreatedAt) missing.push('valid created_at');
    if (checkCloudAge && !hasValidDataAge) missing.push('data_age_ms');
    return {
      status: 'UNKNOWN',
      badgeText: 'Unverified / Unknown',
      headline: 'UNVERIFIED TELEMETRY',
      reason: `Missing positive verification for: ${missing.join(', ')}.`,
      isStale: false,
      hasFault: false,
      hasMissingData: true,
      lastKnownSeverity: hasGasWarn ? 'WARNING' : 'UNKNOWN',
      staleAgeMs: cloudAgeMs,
    };
  }

  if (hasGasWarn || hasDegraded) {
    const warns: string[] = [];
    if (isCoWarn) warns.push(`CO ${row.co_ppm} ppm`);
    if (isLpgWarn) warns.push(`LPG ${row.lpg_ppm} ppm`);
    if (isVocWarn) warns.push(`MQ-135 ${row.voc_ppm}`);
    if (isTempWarn) warns.push(`Ambient ${row.temp}°C`);
    if (row.alert_flag === true && !isCoWarn && !isVocWarn && !isLpgWarn && !isTempWarn) {
      warns.push('General advisory alert_flag asserted');
    }
    if (row.system_degraded === true) warns.push('Degraded node health');
    if (row.ev_loss === true || (typeof row.dropped_events === 'number' && row.dropped_events > 0)) {
      warns.push(`Packet loss (${row.dropped_events ?? 1})`);
    }
    return {
      status: 'WARNING',
      badgeText: 'Warning',
      headline: 'WARNING / DEGRADED',
      reason: warns.join(' · ') || 'Elevated threshold or degraded subsystem detected.',
      isStale: false,
      hasFault: false,
      hasMissingData: false,
      lastKnownSeverity: 'WARNING',
      staleAgeMs: cloudAgeMs,
    };
  }

  return {
    status: 'NORMAL',
    badgeText: 'Normal (Verified)',
    headline: 'ALL CHANNELS VERIFIED NORMAL',
    reason: 'All mandatory sensors, subsystem online checks, and freshness bounds positively verified.',
    isStale: false,
    hasFault: false,
    hasMissingData: false,
    lastKnownSeverity: 'NORMAL',
    staleAgeMs: cloudAgeMs,
  };
}

export function formatUtcAndLocalDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getSafetyBadgeClasses(status: SafetyClassification): string {
  switch (status) {
    case 'DANGER':
      return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
    case 'SENSOR FAULT':
      return 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
    case 'STALE':
      return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
    case 'WARNING':
      return 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
    case 'NORMAL':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
    case 'UNKNOWN':
    default:
      return 'bg-amber-50/70 text-amber-900 border-amber-200 font-semibold';
  }
}
