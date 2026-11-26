import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCrc16Ccitt,
  evaluateHysteresisTransition,
  evaluateTelemetrySafety,
} from './safetyConfig.ts';
import type { SensorLogRow } from './supabase.ts';

function makeValidRow(overrides: Partial<SensorLogRow> = {}): SensorLogRow {
  const now = new Date().toISOString();
  return {
    id: 500,
    device_id: 'safebreath-unit-01',
    created_at: now,
    co_ppm: 8,
    voc_ppm: 65,
    lpg_ppm: 120,
    temp: 25,
    hum: 48,
    alert_flag: false,
    system_alarm: false,
    system_fault: false,
    system_degraded: false,
    thermal_latched: false,
    co_valid: true,
    voc_valid: true,
    lpg_valid: true,
    dht_valid: true,
    state_co: 0,
    state_voc: 0,
    state_lpg: 0,
    session_id: 1,
    uptime_ms: 120000,
    seq_id: 42,
    data_age_ms: 950,
    nano_online: true,
    ze07_online: true,
    ev_loss: false,
    dropped_events: 0,
    ...overrides,
  };
}

test('Hysteresis: CO rising and falling transitions (DANGER -> WARNING -> SAFE)', () => {
  assert.equal(evaluateHysteresisTransition('co', 35, 'SAFE'), 'SAFE');
  assert.equal(evaluateHysteresisTransition('co', 36, 'SAFE'), 'WARNING');
  assert.equal(evaluateHysteresisTransition('co', 70, 'WARNING'), 'WARNING');
  assert.equal(evaluateHysteresisTransition('co', 75, 'WARNING'), 'DANGER');

  // Falling from DANGER: 66 holds DANGER, 34 drops to WARNING (NOT SAFE), 30 clears to SAFE
  assert.equal(evaluateHysteresisTransition('co', 66, 'DANGER'), 'DANGER');
  assert.equal(evaluateHysteresisTransition('co', 34, 'DANGER'), 'WARNING');
  assert.equal(evaluateHysteresisTransition('co', 31, 'WARNING'), 'WARNING');
  assert.equal(evaluateHysteresisTransition('co', 30, 'WARNING'), 'SAFE');
});

test('Hysteresis: Temp rising and falling transitions (DANGER -> WARNING -> SAFE)', () => {
  assert.equal(evaluateHysteresisTransition('temp', 39, 'SAFE'), 'SAFE');
  assert.equal(evaluateHysteresisTransition('temp', 40, 'SAFE'), 'WARNING');
  assert.equal(evaluateHysteresisTransition('temp', 45, 'WARNING'), 'DANGER');

  // Falling from DANGER: 40 holds DANGER, 39 drops to WARNING (>= 38 warnClear), 37 clears to SAFE
  assert.equal(evaluateHysteresisTransition('temp', 40, 'DANGER'), 'DANGER');
  assert.equal(evaluateHysteresisTransition('temp', 39, 'DANGER'), 'WARNING');
  assert.equal(evaluateHysteresisTransition('temp', 38, 'WARNING'), 'WARNING');
  assert.equal(evaluateHysteresisTransition('temp', 37, 'WARNING'), 'SAFE');
});

test('Fail-safe evaluator: requires positive verification before reporting NORMAL', () => {
  const verified = makeValidRow();
  assert.equal(evaluateTelemetrySafety(verified, { checkCloudAge: true }).status, 'NORMAL');

  // Missing (undefined) validity or subsystem flags MUST NOT produce NORMAL
  const missingValidity = makeValidRow({
    co_valid: undefined as unknown as boolean,
    nano_online: undefined as unknown as boolean,
  });
  assert.equal(evaluateTelemetrySafety(missingValidity, { checkCloudAge: true }).status, 'UNKNOWN');

  // Explicit false validity MUST produce SENSOR FAULT
  const explicitFault = makeValidRow({ voc_valid: false });
  assert.equal(evaluateTelemetrySafety(explicitFault, { checkCloudAge: true }).status, 'SENSOR FAULT');

  // Non-finite numeric values MUST produce SENSOR FAULT
  const nonFinite = makeValidRow({ co_ppm: Number.NaN });
  assert.equal(evaluateTelemetrySafety(nonFinite, { checkCloudAge: true }).status, 'SENSOR FAULT');

  // Invalid created_at MUST NOT produce NORMAL
  const badDate = makeValidRow({ created_at: 'not-a-timestamp' });
  assert.equal(evaluateTelemetrySafety(badDate, { checkCloudAge: true }).status, 'UNKNOWN');
});

test('Fail-safe evaluator: stale danger preservation and alert_flag nuance', () => {
  const now = Date.now();
  const staleDanger = makeValidRow({
    co_ppm: 92,
    state_co: 2,
    system_alarm: true,
    created_at: new Date(now - 90_000).toISOString(),
  });
  const staleRes = evaluateTelemetrySafety(staleDanger, { checkCloudAge: true, nowMs: now });
  assert.equal(staleRes.status, 'STALE');
  assert.equal(staleRes.headline, 'LAST KNOWN: DANGER — DATA STALE');

  // alert_flag true without channel breach or system_alarm should classify WARNING, not DANGER
  const advisoryOnly = makeValidRow({ alert_flag: true, system_alarm: false });
  assert.equal(evaluateTelemetrySafety(advisoryOnly, { checkCloudAge: true }).status, 'WARNING');
});

test('CRC-16-CCITT matches standard test vector 123456789 -> 0x29B1', () => {
  const bytes = Array.from('123456789').map((ch) => ch.charCodeAt(0));
  assert.equal(computeCrc16Ccitt(bytes), 0x29b1);
});
