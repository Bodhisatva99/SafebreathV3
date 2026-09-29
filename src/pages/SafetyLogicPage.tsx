import React, { useState } from 'react';
import { PageTab } from '../types';
import { SYSTEM_SPECS } from '../data/hardwareData';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Activity, 
  Thermometer, 
  Volume2, 
  Smartphone, 
  HelpCircle,
  CheckCircle,
  Clock,
  Radio,
  Sliders
} from 'lucide-react';

interface SafetyLogicPageProps {
  onSelectTab: (tab: PageTab) => void;
}

export const SafetyLogicPage: React.FC<SafetyLogicPageProps> = ({ onSelectTab }) => {
  const [selectedGas, setSelectedGas] = useState<'co' | 'voc' | 'lpg' | 'temp'>('co');
  const [simulatedPpm, setSimulatedPpm] = useState<number>(20);

  // Gas definitions
  const gasData = {
    co: {
      name: "Carbon Monoxide (CO)",
      sensor: "ZE07-CO Electrochemical Cell",
      unit: "ppm",
      safe: "≤ 35 ppm",
      warn: "> 35 ppm",
      danger: "> 70 ppm",
      safeMax: 35,
      warnMax: 70,
      maxScale: 150,
      hysteresis: "5 ppm band",
      symptoms: "Headache, dizziness at 35+ ppm; loss of consciousness & death at 70+ ppm over sustained exposure."
    },
    voc: {
      name: "Volatile Organic Compounds (VOC)",
      sensor: "MQ-135 Semiconductor Module",
      unit: "ppm",
      safe: "≤ 200 ppm",
      warn: "> 200 ppm",
      danger: "> 400 ppm",
      safeMax: 200,
      warnMax: 400,
      maxScale: 800,
      hysteresis: "20 ppm band",
      symptoms: "Eye/nose irritation, nausea, cognitive impairment, respiratory inflammation."
    },
    lpg: {
      name: "Liquefied Petroleum Gas (LPG)",
      sensor: "MQ-6 Combustible Module",
      unit: "ppm",
      safe: "≤ 500 ppm",
      warn: "> 500 ppm",
      danger: "> 1500 ppm",
      safeMax: 500,
      warnMax: 1500,
      maxScale: 3000,
      hysteresis: "50 ppm band",
      symptoms: "Highly explosive air-mixture formation; displacement of ambient oxygen causing rapid asphyxiation."
    },
    temp: {
      name: "Thermal Ambient Condition",
      sensor: "DHT11 Digital Climate Probe",
      unit: "°C",
      safe: "< 40 °C",
      warn: "40 – 44.9 °C",
      danger: "≥ 45 °C",
      safeMax: 40,
      warnMax: 44.9,
      maxScale: 70,
      hysteresis: "5 °C clear threshold (< 40 °C to deactivate)",
      symptoms: "Fire precursor, equipment thermal runaway, battery combustion hazard."
    }
  };

  const current = gasData[selectedGas];

  // Helper to compute state based on simulated slider
  const getEvaluatedState = (val: number) => {
    if (selectedGas === 'temp') {
      if (val >= 45) return { state: 'DANGER', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
      if (val >= 40) return { state: 'WARNING', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
      return { state: 'SAFE', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    }
    if (val > current.warnMax) {
      return { state: 'DANGER', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
    }
    if (val > current.safeMax) {
      return { state: 'WARNING', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    }
    return { state: 'SAFE', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  };

  const evalResult = getEvaluatedState(simulatedPpm);

  return (
    <div className="space-y-20 py-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
          Decision Engine & Autonomous Failsafes
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Multi-Gas Safety Logic & Reliability
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          SafeBreath does not merely transmit raw analog voltages to an external cloud. The embedded firmware runs an onboard safety state engine with hysteresis, sensor validity verification, and zero-latency acoustic alarm dispatch.
        </p>
      </div>

      {/* Threshold Matrix Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CO */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              ZE07-CO SENSOR
            </span>
            <span className="text-[11px] font-mono text-slate-500">ELECTROCHEMICAL</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Carbon Monoxide (CO)</h3>
            <p className="text-xs text-slate-400 mt-1">Colorless & odorless asphyxiation gas.</p>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-emerald-400 font-semibold">● SAFE</span>
              <span className="text-slate-300">≤ 35 ppm</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-amber-400 font-semibold">▲ WARNING</span>
              <span className="text-slate-300">&gt; 35 ppm</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-rose-400 font-semibold">✖ DANGER</span>
              <span className="text-slate-300">&gt; 70 ppm</span>
            </div>
          </div>
        </div>

        {/* VOC */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
              MQ-135 SENSOR
            </span>
            <span className="text-[11px] font-mono text-slate-500">SnO2 SEMICONDUCTOR</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Air Quality & VOCs</h3>
            <p className="text-xs text-slate-400 mt-1">Solvents, alcohol, benzene, smoke.</p>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-emerald-400 font-semibold">● SAFE</span>
              <span className="text-slate-300">≤ 200 ppm</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-amber-400 font-semibold">▲ WARNING</span>
              <span className="text-slate-300">&gt; 200 ppm</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-rose-400 font-semibold">✖ DANGER</span>
              <span className="text-slate-300">&gt; 400 ppm</span>
            </div>
          </div>
        </div>

        {/* LPG */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              MQ-6 SENSOR
            </span>
            <span className="text-[11px] font-mono text-slate-500">CATALYTIC CERAMIC</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Combustible Gas (LPG)</h3>
            <p className="text-xs text-slate-400 mt-1">Propane, butane, combustible leak.</p>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-emerald-400 font-semibold">● SAFE</span>
              <span className="text-slate-300">≤ 500 ppm</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-amber-400 font-semibold">▲ WARNING</span>
              <span className="text-slate-300">&gt; 500 ppm</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-rose-400 font-semibold">✖ DANGER</span>
              <span className="text-slate-300">&gt; 1500 ppm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Threshold & Hysteresis Inspector */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Interactive Workbench</div>
            <h2 className="text-2xl font-bold text-white mt-1">Threshold & Hysteresis Evaluator</h2>
          </div>
          {/* Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => { setSelectedGas('co'); setSimulatedPpm(20); }}
              className={`px-3 py-1.5 text-xs font-mono rounded ${selectedGas === 'co' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              CO
            </button>
            <button
              onClick={() => { setSelectedGas('voc'); setSimulatedPpm(120); }}
              className={`px-3 py-1.5 text-xs font-mono rounded ${selectedGas === 'voc' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              VOC
            </button>
            <button
              onClick={() => { setSelectedGas('lpg'); setSimulatedPpm(300); }}
              className={`px-3 py-1.5 text-xs font-mono rounded ${selectedGas === 'lpg' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              LPG
            </button>
            <button
              onClick={() => { setSelectedGas('temp'); setSimulatedPpm(28); }}
              className={`px-3 py-1.5 text-xs font-mono rounded ${selectedGas === 'temp' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Temp
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-sm font-semibold text-white">{current.name}</div>
              <div className="text-xs font-mono text-slate-400">{current.sensor}</div>
            </div>

            {/* Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">SIMULATED GAS CONCENTRATION</span>
                <span className="text-lg font-bold text-white">
                  {simulatedPpm} {current.unit}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={current.maxScale}
                step={selectedGas === 'temp' ? 1 : 5}
                value={simulatedPpm}
                onChange={(e) => setSimulatedPpm(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0 {current.unit} (Nominal)</span>
                <span>Threshold: {current.safeMax}</span>
                <span>Danger: {current.warnMax}</span>
                <span>{current.maxScale} {current.unit}</span>
              </div>
            </div>

            {/* Hysteresis Explanation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-semibold">
                <Sliders className="w-4 h-4" />
                <span>Firmware Hysteresis Filter: {current.hysteresis}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                If the concentration fluctuates rapidly right at the boundary (e.g. bouncing between 34.8 and 35.2 ppm), standard binary comparators cause rapid audible relay chattering. SafeBreath employs a software Schmitt trigger: once activated, levels must fall below the hysteresis margin before the alarm state clears.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* Live State Output Card */}
            <div className={`p-6 rounded-xl border ${evalResult.bg} space-y-4 transition-all duration-300`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">CALCULATED SAFETY STATE</span>
                <span className="px-2 py-0.5 rounded font-bold uppercase bg-slate-900 border border-slate-700">
                  {evalResult.state}
                </span>
              </div>

              <div className="space-y-1">
                <div className={`text-3xl font-extrabold font-mono ${evalResult.color}`}>
                  {evalResult.state === 'SAFE' && '● SAFE'}
                  {evalResult.state === 'WARNING' && '▲ WARNING'}
                  {evalResult.state === 'DANGER' && '✖ DANGER'}
                </div>
                <div className="text-xs text-slate-300">
                  {evalResult.state === 'SAFE' && 'Ambient atmospheric conditions are within normal safety baselines.'}
                  {evalResult.state === 'WARNING' && 'Elevated concentration detected. Pre-alarm warning cadence active.'}
                  {evalResult.state === 'DANGER' && 'Hazardous concentration reached! Continuous 85dB alarm and cloud alert triggered!'}
                </div>
              </div>

              {/* Hardware Actions */}
              <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    Buzzer Acoustic Output:
                  </span>
                  <span className="font-mono text-white">
                    {evalResult.state === 'SAFE' && 'MUTED (0 Hz)'}
                    {evalResult.state === 'WARNING' && 'INTERMITTENT BEEP (1 Hz)'}
                    {evalResult.state === 'DANGER' && 'CONTINUOUS SIREN (2.4 kHz)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    Cloud Dispatch:
                  </span>
                  <span className="font-mono text-white">
                    {evalResult.state === 'SAFE' && 'Periodic Telemetry (3s)'}
                    {evalResult.state === 'WARNING' && 'Warning Flag Ingested'}
                    {evalResult.state === 'DANGER' && 'HIGH-PRIORITY FCM PUSH'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sensor Reliability & Diagnostics Engine */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Fault Isolation</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Sensor Reliability & Diagnostics Engine</h2>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            A naive gas detector that loses connection to a sensor might read 0V and assume the air is perfectly safe. SafeBreath includes active failure detection so that <strong>sensor faults are never mistaken for clean air, and communication hiccups are never mistaken for gas hazards</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 text-xs font-mono">01</span>
              <span className="text-[10px] font-mono text-slate-500">HEARTBEAT</span>
            </div>
            <h4 className="text-sm font-bold text-white">Data-Age Tracking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every sensor packet has a timestamp. If no valid telemetry arrives within 3,500 ms, the system flags a <code>DATA_STALE</code> state on the OLED and warns the user rather than holding old numbers.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 text-xs font-mono">02</span>
              <span className="text-[10px] font-mono text-slate-500">BOUNDS</span>
            </div>
            <h4 className="text-sm font-bold text-white">Sensor Validity Bounds</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Semiconductor sensors have a known analog range across the 1.0 kΩ RL. If the ADC reads 0 (open ground/disconnected wire) or 1023 (short to 5V), the firmware flags <code>SENSOR_FAULT</code>.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 text-xs font-mono">03</span>
              <span className="text-[10px] font-mono text-slate-500">SEQUENCE</span>
            </div>
            <h4 className="text-sm font-bold text-white">UART Sequence Tracking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monotonically increasing sequence counters on the Arduino-to-ESP32 link guarantee that lost frames or transmission corruption are immediately identified and tracked in diagnostic counters.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 text-xs font-mono">04</span>
              <span className="text-[10px] font-mono text-slate-500">PERSIST</span>
            </div>
            <h4 className="text-sm font-bold text-white">Event Acknowledgement</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Critical safety events are written immediately to MicroSD FAT32. For cloud synchronization, the ESP32-CAM queues alarms until an HTTP 201 Created confirmation is returned from Supabase.
            </p>
          </div>
        </div>
      </section>

      {/* Two Levels of Response */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10">
        <div className="space-y-4 max-w-3xl">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Dual Response Strategy</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Local Acoustic Alarm + Remote Cloud Alerting
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            When abnormal conditions trigger a warning or danger state, SafeBreath responds simultaneously on both fronts:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 rounded-xl border border-emerald-900/40 bg-emerald-950/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Immediate Local Response</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The ESP32 activates the onboard 85 dB Piezo Buzzer directly via GPIO23 with non-blocking hardware PWM. Nearby occupants, sleeping family members, or lab technicians hear the danger instantly without any internet latency.
            </p>
            <div className="text-xs font-mono text-emerald-400 pt-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Response latency: &lt; 10 milliseconds</span>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-sky-900/40 bg-sky-950/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Remote Cloud Response</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The critical event is committed to local MicroSD flash and dispatched over Wi-Fi to Supabase. Firebase Cloud Messaging (FCM) instantly pings registered Android smartphones, alerting remote property owners or emergency contacts.
            </p>
            <div className="text-xs font-mono text-sky-400 pt-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Worldwide remote awareness via push notification</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
