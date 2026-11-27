import React, { useState } from 'react';
import { Sliders, Volume2, Smartphone, RotateCcw } from 'lucide-react';
import {
  SHARED_THRESHOLDS,
  evaluateHysteresisTransition,
} from '../lib/safetyConfig';

export const SafetyStateEngine: React.FC = () => {
  const [selectedHazard, setSelectedHazard] = useState<'co' | 'voc' | 'lpg' | 'temp'>('co');
  const [currentVal, setCurrentVal] = useState<number>(20);
  const [latchedState, setLatchedState] = useState<'SAFE' | 'WARNING' | 'DANGER'>('SAFE');

  const hazardConfigs = {
    co: {
      name: 'Carbon Monoxide (CO)',
      sensor: 'ZE07-CO Electrochemical Cell (T90 <= 60s)',
      unit: 'ppm',
      warnEnter: SHARED_THRESHOLDS.co.warnEnter,
      warnClear: SHARED_THRESHOLDS.co.warnClear,
      dangerEnter: SHARED_THRESHOLDS.co.dangerEnter,
      dangerClear: SHARED_THRESHOLDS.co.dangerClear,
      maxScale: 120,
      hysteresis: '5 ppm reset deadband (Warn clears <= 30 ppm, Danger clears <= 65 ppm)',
      guidance: 'SAFE <= 35 · WARN > 35 (clears <= 30) · DANGER > 70 (clears <= 65)',
      clinical:
        '35 ppm corresponds to the NIOSH 8-hour Recommended Exposure Limit (REL TWA; NIOSH ceiling is 200 ppm). SafeBreath configures 35 ppm / 70 ppm as conservative residential pre-alarm and alarm firmware limits rather than claiming occupational limits as universal residential standards.',
    },
    voc: {
      name: 'Air Quality / Broadband VOC Indicator',
      sensor: 'MQ-135 Broad-Response Indicator (RL = 1.0 kΩ)',
      unit: 'ind.',
      warnEnter: SHARED_THRESHOLDS.voc.warnEnter,
      warnClear: SHARED_THRESHOLDS.voc.warnClear,
      dangerEnter: SHARED_THRESHOLDS.voc.dangerEnter,
      dangerClear: SHARED_THRESHOLDS.voc.dangerClear,
      maxScale: SHARED_THRESHOLDS.voc.maxScale,
      hysteresis: '20 unit reset deadband (Warn clears <= 180, Danger clears <= 380)',
      guidance: 'SAFE <= 200 · WARN > 200 (clears <= 180) · DANGER > 400 (clears <= 380)',
      clinical:
        'MQ-135 provides relative broadband detection across ammonia, benzene, alcohol, and smoke vapors referenced to clean air (requires named reference gas calibration for absolute single-gas ppm).',
    },
    lpg: {
      name: 'Liquefied Petroleum Gas (LPG)',
      sensor: 'MQ-6 Heated SnO2 Probe (300–10,000 ppm span)',
      unit: 'ppm',
      warnEnter: SHARED_THRESHOLDS.lpg.warnEnter,
      warnClear: SHARED_THRESHOLDS.lpg.warnClear,
      dangerEnter: SHARED_THRESHOLDS.lpg.dangerEnter,
      dangerClear: SHARED_THRESHOLDS.lpg.dangerClear,
      maxScale: SHARED_THRESHOLDS.lpg.maxScale,
      hysteresis: '50 ppm reset deadband (Warn clears <= 450, Danger clears <= 1450)',
      guidance: 'SAFE <= 500 · WARN > 500 (clears <= 450) · DANGER > 1500 (clears <= 1450)',
      clinical:
        'Configured well below Lower Explosive Limits (~18,000–21,000 ppm propane/butane in air) to warn occupants prior to combustible accumulation.',
    },
    temp: {
      name: 'Ambient Temperature Indicator',
      sensor: 'DHT22 Ambient Monitor (-40 to +80 °C ±0.5 °C)',
      unit: '°C',
      warnEnter: SHARED_THRESHOLDS.temp.warnEnter,
      warnClear: SHARED_THRESHOLDS.temp.warnClear,
      dangerEnter: SHARED_THRESHOLDS.temp.dangerEnter,
      dangerClear: SHARED_THRESHOLDS.temp.dangerClear,
      maxScale: SHARED_THRESHOLDS.temp.maxScale,
      hysteresis: '5 °C reset deadband (High Heat alert at >= 45 °C clears only < 40 °C)',
      guidance: 'NORMAL < 40 · ELEVATED 40–44 · HIGH HEAT >= 45 (clears < 40 °C)',
      clinical:
        'Monitors elevated ambient room temperature around the enclosure. Note: DHT22 (±0.5 °C accuracy) serves ambient monitoring and is not a certified standalone fire or thermal-runaway detector.',
    },
  };

  const current = hazardConfigs[selectedHazard];

  const handleSliderChange = (nextVal: number) => {
    setCurrentVal(nextVal);
    setLatchedState((prev) => evaluateHysteresisTransition(selectedHazard, nextVal, prev));
  };

  const handleHazardSelect = (hazard: 'co' | 'voc' | 'lpg' | 'temp', defaultVal: number) => {
    setSelectedHazard(hazard);
    setCurrentVal(defaultVal);
    setLatchedState(evaluateHysteresisTransition(hazard, defaultVal, 'SAFE'));
  };

  const getVisualForState = (state: 'SAFE' | 'WARNING' | 'DANGER') => {
    if (state === 'DANGER') {
      return {
        state: 'DANGER',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        text: 'text-rose-700',
        buzzer: 'Continuous 2.4 kHz Transistor-Switched Tone',
        cloud: 'High-Priority Telemetry Flagged',
      };
    }
    if (state === 'WARNING') {
      return {
        state: 'WARNING',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'text-amber-700',
        buzzer: 'Intermittent Pre-Alarm Pulse (1 Hz)',
        cloud: 'Warning Telemetry Row Recorded',
      };
    }
    return {
      state: 'SAFE',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      text: 'text-emerald-700',
      buzzer: 'Silent (Standby)',
      cloud: 'Nominal Periodic Sync',
    };
  };

  const status = getVisualForState(latchedState);
  const isHoldingDeadband =
    (latchedState === 'DANGER' &&
      (selectedHazard === 'temp'
        ? currentVal < current.dangerEnter && currentVal >= current.dangerClear
        : currentVal <= current.dangerEnter && currentVal > current.dangerClear)) ||
    (latchedState === 'WARNING' &&
      (selectedHazard === 'temp'
        ? currentVal < current.warnEnter && currentVal >= current.warnClear
        : currentVal <= current.warnEnter && currentVal > current.warnClear));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-9 space-y-8 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.12)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <span className="text-xs font-mono text-emerald-700 font-semibold block">
            Stateful Schmitt-Trigger Hysteresis Simulator
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mt-0.5">
            Threshold Entry &amp; Deadband Clear Transitions
          </h3>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => handleHazardSelect('co', 20)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedHazard === 'co' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CO
          </button>
          <button
            type="button"
            onClick={() => handleHazardSelect('voc', 160)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedHazard === 'voc' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MQ-135 Ind.
          </button>
          <button
            type="button"
            onClick={() => handleHazardSelect('lpg', 350)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedHazard === 'lpg' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            LPG
          </button>
          <button
            type="button"
            onClick={() => handleHazardSelect('temp', 26)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedHazard === 'temp' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ambient Temp
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{current.sensor}</span>
            <div className="text-lg font-bold text-slate-900">{current.name}</div>
            <p className="text-xs text-slate-500 font-mono">{current.guidance}</p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 font-medium">SIMULATED READING</span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {currentVal} {current.unit}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={current.maxScale}
              step={selectedHazard === 'temp' ? 1 : 5}
              value={currentVal}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>0 {current.unit}</span>
              <span>Warn: {current.warnEnter}</span>
              <span>Danger: {current.dangerEnter}</span>
              <span>{current.maxScale} {current.unit}</span>
            </div>

            {isHoldingDeadband && (
              <div className="text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Hysteresis Deadband Active: Holding {latchedState} until reading drops{' '}
                {selectedHazard === 'temp'
                  ? `below ${latchedState === 'DANGER' ? current.dangerClear : current.warnClear} °C`
                  : `to <= ${latchedState === 'DANGER' ? current.dangerClear : current.warnClear} ${current.unit}`}
                .
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Sliders className="w-3.5 h-3.5 text-emerald-700" />
              <span>Hysteresis Band: {current.hysteresis}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{current.clinical}</p>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">LATCHED STATE</span>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${status.badge}`}>
              {status.state}
            </span>
          </div>

          <div>
            <div className={`text-4xl font-extrabold font-mono tracking-tight ${status.text}`}>
              {status.state}
            </div>
            <p className="text-xs text-slate-600 mt-2">
              {status.state === 'SAFE' && 'Readings remain within configured indoor firmware bounds.'}
              {status.state === 'WARNING' && 'Warning band entered (or latched in hysteresis deadband until clear limit).'}
              {status.state === 'DANGER' && 'Critical limit breached (or latched above clear limit to prevent alarm chatter).'}
            </p>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-200 text-xs font-mono">
            <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                <Volume2 className="w-3.5 h-3.5 text-slate-700" />
                Driver Output:
              </span>
              <span className="text-right font-semibold text-slate-900">{status.buzzer}</span>
            </div>

            <div className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                <Smartphone className="w-3.5 h-3.5 text-slate-700" />
                Cloud Event:
              </span>
              <span className="text-right font-semibold text-slate-900">{status.cloud}</span>
            </div>

            {latchedState !== 'SAFE' && (
              <button
                type="button"
                onClick={() => handleHazardSelect(selectedHazard, selectedHazard === 'co' ? 15 : selectedHazard === 'temp' ? 24 : 50)}
                className="w-full py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Clean Baseline</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
