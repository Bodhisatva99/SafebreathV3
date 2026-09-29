import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Flame, Sliders, Volume2, Smartphone, CheckCircle, Radio } from 'lucide-react';

export const SafetyStateEngine: React.FC = () => {
  const [selectedHazard, setSelectedHazard] = useState<'co' | 'voc' | 'lpg' | 'temp'>('co');
  const [currentVal, setCurrentVal] = useState<number>(20);

  const hazardConfigs = {
    co: {
      name: "Carbon Monoxide (CO)",
      sensor: "ZE07-CO Electrochemical Cell",
      unit: "ppm",
      safeLimit: 35,
      dangerLimit: 70,
      maxScale: 120,
      hysteresis: "5 ppm hysteresis margin",
      guidance: "SAFE: ≤ 35 ppm · WARNING: > 35 ppm · DANGER: > 70 ppm",
      clinical: "35 ppm is the OSHA 8-hour permissible exposure limit; sustained levels > 70 ppm cause severe headaches, nausea, and irreversible hypoxia."
    },
    voc: {
      name: "Volatile Organic Compounds (VOC)",
      sensor: "MQ-135 Broadband Sensor",
      unit: "ppm",
      safeLimit: 200,
      dangerLimit: 400,
      maxScale: 600,
      hysteresis: "20 ppm hysteresis margin",
      guidance: "SAFE: ≤ 200 ppm · WARNING: > 200 ppm · DANGER: > 400 ppm",
      clinical: "High concentrations of formaldehyde, alcohol vapors, and benzene severely irritate mucous membranes and induce central nervous system depression."
    },
    lpg: {
      name: "Liquefied Petroleum Gas (LPG)",
      sensor: "MQ-6 SnO2 Ceramic Bead",
      unit: "ppm",
      safeLimit: 500,
      dangerLimit: 1500,
      maxScale: 2500,
      hysteresis: "50 ppm hysteresis margin",
      guidance: "SAFE: ≤ 500 ppm · WARNING: > 500 ppm · DANGER: > 1500 ppm",
      clinical: "Lower Explosive Limit (LEL) prevention. At > 1500 ppm, combustible propane/butane vapors create imminent deflagration and asphyxiation risks."
    },
    temp: {
      name: "Thermal Runaway Indicator",
      sensor: "DHT11 Digital Climate Probe",
      unit: "°C",
      safeLimit: 40,
      dangerLimit: 45,
      maxScale: 60,
      hysteresis: "5 °C clear band (< 40 °C to clear alarm)",
      guidance: "NORMAL: < 40 °C · WARNING: 40–44.9 °C · ALARM: ≥ 45 °C",
      clinical: "Detects equipment overheating, heating element failure, and early-stage combustion before flames become visible."
    }
  };

  const current = hazardConfigs[selectedHazard];

  // Evaluate state
  const evaluateState = (val: number) => {
    if (val >= current.dangerLimit) {
      return {
        state: 'DANGER',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        text: 'text-rose-700',
        bar: 'bg-rose-600',
        buzzer: 'Continuous 85 dB Alarm (2.4 kHz PWM)',
        cloud: 'HIGH-PRIORITY FCM PUSH NOTIFICATION',
        oled: 'Flashing Inverted Warning Banner'
      };
    }
    if (val > current.safeLimit) {
      return {
        state: 'WARNING',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'text-amber-700',
        bar: 'bg-amber-500',
        buzzer: 'Intermittent Pre-Alarm Beep (1 Hz)',
        cloud: 'Telemetry Ingested with Warning Flag',
        oled: 'Prominent Warning Text Displayed'
      };
    }
    return {
      state: 'SAFE',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      text: 'text-emerald-700',
      bar: 'bg-emerald-600',
      buzzer: 'Silent (Muted / Normal Operation)',
      cloud: 'Standard 3-Second Periodic Logging',
      oled: 'Nominal Status Indicator'
    };
  };

  const status = evaluateState(currentVal);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
      {/* Top Selector Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-mono text-emerald-800 font-semibold uppercase tracking-wider block">
            STATE MACHINE SIMULATION
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Threshold Detection & State Transitions
          </h3>
        </div>

        {/* Hazard Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => { setSelectedHazard('co'); setCurrentVal(20); }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedHazard === 'co' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CO
          </button>
          <button
            onClick={() => { setSelectedHazard('voc'); setCurrentVal(160); }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedHazard === 'voc' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            VOC
          </button>
          <button
            onClick={() => { setSelectedHazard('lpg'); setCurrentVal(350); }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedHazard === 'lpg' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            LPG
          </button>
          <button
            onClick={() => { setSelectedHazard('temp'); setCurrentVal(26); }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedHazard === 'temp' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Temp
          </button>
        </div>
      </div>

      {/* Main Interactive Slider & Status Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Interactive Slider */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{current.sensor}</span>
            <div className="text-lg font-bold text-slate-900">{current.name}</div>
            <p className="text-xs text-slate-500 font-mono">{current.guidance}</p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 font-medium">SIMULATED VALUE</span>
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
              onChange={(e) => setCurrentVal(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>0 {current.unit} (Nominal)</span>
              <span>Warn: {current.safeLimit}</span>
              <span>Danger: {current.dangerLimit}</span>
              <span>{current.maxScale} {current.unit}</span>
            </div>
          </div>

          {/* Hysteresis & Clinical Impact */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Firmware Hysteresis Filter: {current.hysteresis}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {current.clinical}
            </p>
          </div>
        </div>

        {/* Right Calculated State Box */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Safety Engine State
            </span>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${status.badge}`}>
              {status.state}
            </span>
          </div>

          <div>
            <div className={`text-4xl font-extrabold font-mono tracking-tight ${status.text}`}>
              ● {status.state}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {status.state === 'SAFE' && 'Concentrations are well within human safety standards.'}
              {status.state === 'WARNING' && 'Abnormal atmospheric elevation detected. Pre-alert active.'}
              {status.state === 'DANGER' && 'Hazard threshold reached! Local siren and remote alerts dispatched.'}
            </p>
          </div>

          {/* Synchronized Output Channels */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs font-mono">
            <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-slate-700" />
                Local Buzzer:
              </span>
              <span className="text-right font-semibold text-slate-900">{status.buzzer}</span>
            </div>

            <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-700" />
                Cloud Dispatch:
              </span>
              <span className="text-right font-semibold text-slate-900">{status.cloud}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
