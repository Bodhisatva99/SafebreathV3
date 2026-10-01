import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Wind, 
  Activity, 
  Flame, 
  Thermometer, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle, 
  Sliders, 
  Radio, 
  Layers, 
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { SafetyState } from '../types';
import { SafeBreathShieldSymbol } from './SafeBreathLogo';

export const PrecisionHardwareSimulator: React.FC = () => {
  // Input parameters
  const [coPpm, setCoPpm] = useState<number>(12);
  const [vocPpm, setVocPpm] = useState<number>(85);
  const [lpgPpm, setLpgPpm] = useState<number>(110);
  const [tempC, setTempC] = useState<number>(23);
  const [humidity, setHumidity] = useState<number>(50);

  // Fault states
  const [sensorFault, setSensorFault] = useState<boolean>(false);
  const [staleTimeout, setStaleTimeout] = useState<boolean>(false);

  // Audio tone
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Simulation execution
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sequenceId, setSequenceId] = useState<number>(2080);
  const [csvLogs, setCsvLogs] = useState<string[]>([
    "timestamp,seq,co_ppm,voc_ppm,lpg_ppm,temp_c,rh_pct,status,crc",
    "1727539200,2078,11.8,84.1,108.5,23.1,49.8,SAFE,0x7F",
    "1727539202,2079,12.1,84.9,109.8,23.1,50.1,SAFE,0x8A",
  ]);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Safety State Machine calculation
  const isCoDanger = coPpm > 70;
  const isCoWarn = coPpm > 35;
  const isVocDanger = vocPpm > 400;
  const isVocWarn = vocPpm > 200;
  const isLpgDanger = lpgPpm > 1500;
  const isLpgWarn = lpgPpm > 500;
  const isTempAlarm = tempC >= 45;

  let overallState: SafetyState = 'SAFE';
  let hazardReason = 'Atmospheric conditions nominal';

  if (sensorFault) {
    overallState = 'WARNING';
    hazardReason = 'SENSOR_FAULT: MQ-6 analog ground open circuit';
  } else if (staleTimeout) {
    overallState = 'WARNING';
    hazardReason = 'COMM_TIMEOUT: No UART packet received in >3500ms';
  } else if (isCoDanger || isVocDanger || isLpgDanger || isTempAlarm) {
    overallState = 'DANGER';
    if (isCoDanger) hazardReason = `CRITICAL: CO Level ${coPpm} ppm exceeds danger threshold (70 ppm)!`;
    else if (isLpgDanger) hazardReason = `CRITICAL: LPG ${lpgPpm} ppm exceeds combustible threshold (1500 ppm)!`;
    else if (isVocDanger) hazardReason = `CRITICAL: Toxic VOC ${vocPpm} ppm concentration detected!`;
    else hazardReason = `CRITICAL: Thermal runaway temperature ${tempC} °C detected!`;
  } else if (isCoWarn || isVocWarn || isLpgWarn || tempC >= 40) {
    overallState = 'WARNING';
    if (isCoWarn) hazardReason = `WARNING: Elevated CO level (${coPpm} ppm)`;
    else if (isLpgWarn) hazardReason = `WARNING: Elevated LPG level (${lpgPpm} ppm)`;
    else if (isVocWarn) hazardReason = `WARNING: Elevated VOC level (${vocPpm} ppm)`;
    else hazardReason = `WARNING: Ambient temperature elevated (${tempC} °C)`;
  }

  const isAlarmActive = overallState === 'DANGER';
  const isWarnActive = overallState === 'WARNING';

  // Audio tone generation
  useEffect(() => {
    if (!soundEnabled) {
      if (oscRef.current) {
        try { oscRef.current.stop(); oscRef.current.disconnect(); } catch (e) {}
        oscRef.current = null;
      }
      return;
    }

    if (isAlarmActive) {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (!oscRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2400, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
      }
    } else {
      if (oscRef.current) {
        try { oscRef.current.stop(); oscRef.current.disconnect(); } catch (e) {}
        oscRef.current = null;
      }
    }

    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); oscRef.current.disconnect(); } catch (e) {}
        oscRef.current = null;
      }
    };
  }, [soundEnabled, isAlarmActive]);

  // Simulation loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setSequenceId(prev => {
        const next = prev + 1;
        const jCo = Math.max(0, +(coPpm + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const jVoc = Math.max(0, +(vocPpm + (Math.random() * 1.2 - 0.6)).toFixed(1));
        const jLpg = Math.max(0, +(lpgPpm + (Math.random() * 2 - 1)).toFixed(0));
        const ts = Math.floor(Date.now() / 1000);
        const crc = `0x${((next * 17) % 255).toString(16).toUpperCase().padStart(2, '0')}`;
        const newRow = `${ts},${next},${jCo},${jVoc},${jLpg},${tempC},${humidity},${overallState},${crc}`;
        
        setCsvLogs(l => [l[0], ...l.slice(1, 12), newRow]);
        return next;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying, coPpm, vocPpm, lpgPpm, tempC, humidity, overallState]);

  // Preset scenarios
  const applyPreset = (preset: string) => {
    setSensorFault(false);
    setStaleTimeout(false);
    switch (preset) {
      case 'nominal':
        setCoPpm(12);
        setVocPpm(85);
        setLpgPpm(110);
        setTempC(23);
        setHumidity(48);
        break;
      case 'lpg':
        setCoPpm(15);
        setVocPpm(130);
        setLpgPpm(1820);
        setTempC(24);
        setHumidity(52);
        break;
      case 'co':
        setCoPpm(86);
        setVocPpm(160);
        setLpgPpm(125);
        setTempC(25);
        setHumidity(46);
        break;
      case 'voc':
        setCoPpm(18);
        setVocPpm(510);
        setLpgPpm(220);
        setTempC(24);
        setHumidity(54);
        break;
      case 'thermal':
        setCoPpm(28);
        setVocPpm(180);
        setLpgPpm(260);
        setTempC(48);
        setHumidity(38);
        break;
      case 'fault':
        setSensorFault(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-slate-100/90 rounded-3xl border border-slate-300 p-6 sm:p-10 shadow-lg space-y-8">
      {/* Instrument Chassis Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <SafeBreathShieldSymbol size={22} />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
              SYNTHETIC TEST BENCH & SIMULATION ENVIRONMENT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            SafeBreath Hardware Emulation Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Interactive virtual workbench simulating 10-bit analog oversampling, hysteresis evaluation, SSD1306 OLED rendering, 85dB acoustic buzzer synthesis, and store-and-forward telemetry without altering live physical sensors.
          </p>
        </div>

        {/* Global Instrument Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-800 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause Loop' : 'Resume Loop'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-sm transition-all ${
              soundEnabled 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-700" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span>{soundEnabled ? 'Buzzer Audio: ON' : 'Buzzer Audio: MUTED'}</span>
          </button>

          <button
            onClick={() => applyPreset('nominal')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Scenario Presets Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-sm">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
          Simulate Hardware Test Benchmark:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPreset('nominal')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100"
          >
            🟢 Nominal Clean Baseline
          </button>
          <button
            onClick={() => applyPreset('lpg')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100"
          >
            🔥 Elevated LPG Threshold (1,820 ppm)
          </button>
          <button
            onClick={() => applyPreset('co')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100"
          >
            💨 High CO Concentration (86 ppm)
          </button>
          <button
            onClick={() => applyPreset('voc')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100"
          >
            🧪 High VOC Concentration (510 ppm)
          </button>
          <button
            onClick={() => applyPreset('thermal')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100"
          >
            🌡️ High Temperature Test (48 °C)
          </button>
          <button
            onClick={() => applyPreset('fault')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100"
          >
            ⚠️ Injected Sensor Pin Fault (MQ-6 Disconnected)
          </button>
        </div>
      </div>

      {/* Main Console Layout: Optimized for Mobile, Tablet Dual-Pane, and Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left: Input Control Knobs (Mobile: 1 col, Tablet: 1 col, Desktop: 4 Cols) */}
        <div className="md:col-span-1 lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-mono text-slate-500">
            <span className="font-semibold text-slate-900 uppercase">Input Variable Knobs</span>
            <span>2 Hz Sampling</span>
          </div>

          {/* CO Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-700 font-semibold">ZE07-CO (Carbon Monoxide)</span>
              <span className={`font-bold ${coPpm > 70 ? 'text-rose-600' : coPpm > 35 ? 'text-amber-600' : 'text-emerald-700'}`}>
                {coPpm} ppm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              value={coPpm}
              onChange={(e) => setCoPpm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0 ppm</span>
              <span>Warn: 35</span>
              <span>Danger: 70</span>
              <span>120 ppm</span>
            </div>
          </div>

          {/* VOC Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-700 font-semibold">MQ-135 (VOC & Solvents)</span>
              <span className={`font-bold ${vocPpm > 400 ? 'text-rose-600' : vocPpm > 200 ? 'text-amber-600' : 'text-sky-700'}`}>
                {vocPpm} ppm
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="600"
              step="5"
              value={vocPpm}
              onChange={(e) => setVocPpm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>10 ppm</span>
              <span>Warn: 200</span>
              <span>Danger: 400</span>
              <span>600 ppm</span>
            </div>
          </div>

          {/* LPG Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-700 font-semibold">MQ-6 (LPG Combustible)</span>
              <span className={`font-bold ${lpgPpm > 1500 ? 'text-rose-600' : lpgPpm > 500 ? 'text-amber-600' : 'text-amber-700'}`}>
                {lpgPpm} ppm
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="2500"
              step="25"
              value={lpgPpm}
              onChange={(e) => setLpgPpm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>50 ppm</span>
              <span>Warn: 500</span>
              <span>Danger: 1500</span>
              <span>2500 ppm</span>
            </div>
          </div>

          {/* Temp & Humidity Sliders */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Temp</span>
                <span className="font-bold text-slate-900">{tempC} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Humidity</span>
                <span className="font-bold text-slate-900">{humidity} %</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Diagnostics Toggles */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Injected Diagnostics:</span>
            
            <label className="flex items-center justify-between text-xs text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <span>Disconnect MQ-6 Analog Pin</span>
              <input
                type="checkbox"
                checked={sensorFault}
                onChange={(e) => setSensorFault(e.target.checked)}
                className="rounded text-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <span>Simulate Stale UART (&gt;3500ms)</span>
              <input
                type="checkbox"
                checked={staleTimeout}
                onChange={(e) => setStaleTimeout(e.target.checked)}
                className="rounded text-emerald-600"
              />
            </label>
          </div>
        </div>

        {/* Center: Real Physical Display & Alarm Core (Mobile: 1 col, Tablet: 1 col, Desktop: 5 Cols) */}
        <div className="md:col-span-1 lg:col-span-5 space-y-6">
          
          {/* Authentic Monochrome OLED SSD1306 Display */}
          <div className="bg-slate-900 rounded-2xl border-4 border-slate-800 p-6 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2 text-cyan-400 font-bold">
                <SafeBreathShieldSymbol size={16} />
                0.96" SSD1306 OLED (128x64)
              </span>
              <span>I2C 0x3C (GPIO 4/15)</span>
            </div>

            {/* Simulated monochrome display glass */}
            <div className="bg-black rounded-xl p-4 font-mono text-xs text-cyan-300 min-h-[190px] flex flex-col justify-between border-2 border-slate-950">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1 text-[11px]">
                <span className="font-bold tracking-wider">SAFEBREATH Rev 2.8f</span>
                <span className="text-[10px] text-cyan-400">WIFI:OK SD:OK</span>
              </div>

              {/* Main Readings on OLED */}
              <div className="py-2 space-y-2">
                {sensorFault ? (
                  <div className="text-center py-3 text-amber-300 font-bold space-y-1">
                    <div className="text-sm">*** SENSOR FAULT ***</div>
                    <div className="text-[11px]">MQ-6 ADC=0 (OPEN CIRCUIT)</div>
                    <div className="text-[10px] text-cyan-400">VERIFY WIRING INTEGRITY</div>
                  </div>
                ) : staleTimeout ? (
                  <div className="text-center py-3 text-amber-300 font-bold space-y-1">
                    <div className="text-sm">*** COMM TIMEOUT ***</div>
                    <div className="text-[11px]">DATA AGE &gt; 3500 MS</div>
                    <div className="text-[10px] text-cyan-400">WAITING NANO UART...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className={`p-1.5 rounded ${isCoDanger ? 'bg-cyan-400 text-black font-bold animate-pulse' : 'bg-slate-950 border border-slate-800'}`}>
                      <div className="text-[9px] text-slate-400">CO ppm</div>
                      <div className="text-base font-bold tabular-nums">{coPpm}</div>
                    </div>

                    <div className={`p-1.5 rounded ${isVocDanger ? 'bg-cyan-400 text-black font-bold animate-pulse' : 'bg-slate-950 border border-slate-800'}`}>
                      <div className="text-[9px] text-slate-400">VOC ppm</div>
                      <div className="text-base font-bold tabular-nums">{vocPpm}</div>
                    </div>

                    <div className={`p-1.5 rounded ${isLpgDanger ? 'bg-cyan-400 text-black font-bold animate-pulse' : 'bg-slate-950 border border-slate-800'}`}>
                      <div className="text-[9px] text-slate-400">LPG ppm</div>
                      <div className="text-base font-bold tabular-nums">{lpgPpm}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-cyan-500/30 pt-1 text-[10px]">
                <span>T:{tempC}°C  H:{humidity}%</span>
                <span className={`font-bold px-1.5 rounded ${
                  overallState === 'DANGER' ? 'bg-cyan-400 text-black animate-pulse' :
                  overallState === 'WARNING' ? 'text-amber-300' : 'text-cyan-400'
                }`}>
                  [{overallState}]
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 text-center">
              Direct physical screen output independent of cloud or smartphone
            </div>
          </div>

          {/* Physical Acoustic Buzzer Unit */}
          <div className={`rounded-2xl border p-6 space-y-3 transition-all ${
            isAlarmActive 
              ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-md animate-pulse' 
              : isWarnActive 
              ? 'bg-amber-50 border-amber-300 text-amber-900' 
              : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isAlarmActive 
                    ? 'bg-rose-600 text-white border-rose-700 font-bold' 
                    : isWarnActive 
                    ? 'bg-amber-500 text-white border-amber-600' 
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Autonomous Alarm Unit (ESP32 GPIO 13)</div>
                  <h4 className="font-bold text-sm sm:text-base">
                    {isAlarmActive ? '85 dB SIREN ACTIVATED (2.4 kHz PWM)' : isWarnActive ? 'INTERMITTENT WARNING BEEP' : 'PIEZO BUZZER SILENT'}
                  </h4>
                </div>
              </div>

              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                isAlarmActive ? 'bg-rose-100 text-rose-800 border-rose-300' :
                isWarnActive ? 'bg-amber-100 text-amber-800 border-amber-300' :
                'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {isAlarmActive ? 'SIREN ON' : isWarnActive ? 'PRE-WARN' : 'MUTED'}
              </span>
            </div>

            <p className="text-xs font-mono text-slate-600">
              {hazardReason}
            </p>
          </div>
        </div>

        {/* Right: MicroSD Log & Cloud / Companion Push (Mobile: 1 col, Tablet: spans 2 cols, Desktop: 3 Cols) */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          
          {/* Companion Mobile Notification Banner Preview */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
              Companion Android App
            </span>

            {isAlarmActive ? (
              <div className="bg-white rounded-2xl border-2 border-rose-300 p-4 shadow-md space-y-2 animate-bounce">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5 font-bold text-rose-600">
                    <SafeBreathShieldSymbol size={15} />
                    SafeBreath Alert
                  </span>
                  <span>Now</span>
                </div>
                <div className="font-bold text-xs text-slate-900">
                  CRITICAL HAZARD DETECTED!
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {hazardReason}
                </p>
                <div className="text-[10px] font-mono text-emerald-800 pt-1 border-t border-slate-100">
                  Delivered via Firebase Cloud Messaging
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1.5 shadow-sm text-xs text-slate-600">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-emerald-700 font-semibold">FCM: LISTENING</span>
                  <span className="text-slate-400">ID: #SB-204</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Remote companion mobile app is synchronized. Emergency alerts dispatch automatically when danger thresholds are reached.
                </p>
              </div>
            )}
          </div>

          {/* MicroSD Local File Log Buffer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-sm font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                MicroSD Flight Log
              </span>
              <span className="text-emerald-700">FAT32</span>
            </div>

            <div className="bg-slate-900 text-slate-300 rounded-xl p-3 h-36 overflow-y-auto font-mono text-[9px] space-y-1 leading-tight">
              {csvLogs.map((row, idx) => (
                <div key={idx} className={idx === 0 ? 'text-slate-400 font-bold border-b border-slate-800 pb-0.5' : ''}>
                  {row}
                </div>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 flex justify-between pt-1">
              <span>File: SB_LOG.CSV</span>
              <span>Seq #{sequenceId}</span>
            </div>
          </div>

          {/* Cloud Supabase REST Payload */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-sm font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Wifi className="w-3.5 h-3.5 text-indigo-600" />
                Supabase Ingest
              </span>
              <span className="text-emerald-700">201 OK</span>
            </div>

            <pre className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[9px] text-slate-700 overflow-x-auto leading-relaxed">
{`{
  "seq": ${sequenceId},
  "co_ppm": ${coPpm},
  "voc_ppm": ${vocPpm},
  "lpg_ppm": ${lpgPpm},
  "temp_c": ${tempC},
  "state": "${overallState}",
  "alarm": ${isAlarmActive}
}`}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
