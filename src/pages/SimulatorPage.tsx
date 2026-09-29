import React, { useState, useEffect, useRef } from 'react';
import { PageTab, SafetyState } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Flame, 
  Wind, 
  Activity, 
  Thermometer, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle, 
  Radio,
  Sliders,
  Terminal,
  Zap
} from 'lucide-react';

interface SimulatorPageProps {
  onSelectTab: (tab: PageTab) => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({ onSelectTab }) => {
  // Live gas inputs
  const [coPpm, setCoPpm] = useState<number>(12);
  const [vocPpm, setVocPpm] = useState<number>(85);
  const [lpgPpm, setLpgPpm] = useState<number>(110);
  const [tempC, setTempC] = useState<number>(23);
  const [humidity, setHumidity] = useState<number>(50);

  // Fault injection
  const [sensorFault, setSensorFault] = useState<boolean>(false);
  const [staleCommFault, setStaleCommFault] = useState<boolean>(false);

  // Audio mute
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Simulation execution & sequence
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [seqId, setSeqId] = useState<number>(1042);
  const [csvLogs, setCsvLogs] = useState<string[]>([
    "timestamp,seq,co_ppm,voc_ppm,lpg_ppm,temp_c,rh_pct,status,crc",
    "1727539200,1040,11.8,84.1,108.5,23.1,49.8,SAFE,0x7F",
    "1727539202,1041,12.1,84.9,109.8,23.1,50.1,SAFE,0x8A",
  ]);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Compute safety states
  const computeGasState = (co: number, voc: number, lpg: number, temp: number) => {
    if (sensorFault) {
      return { overall: 'WARNING' as SafetyState, reason: 'SENSOR_FAULT (MQ-6 Disconnected)', coState: 'SAFE' as SafetyState, vocState: 'SAFE' as SafetyState, lpgState: 'DANGER' as SafetyState };
    }
    if (staleCommFault) {
      return { overall: 'WARNING' as SafetyState, reason: 'COMM_TIMEOUT (>3500ms)', coState: 'SAFE' as SafetyState, vocState: 'SAFE' as SafetyState, lpgState: 'SAFE' as SafetyState };
    }

    const isCoDanger = co > 70;
    const isCoWarn = co > 35;
    const isVocDanger = voc > 400;
    const isVocWarn = voc > 200;
    const isLpgDanger = lpg > 1500;
    const isLpgWarn = lpg > 500;
    const isTempAlarm = temp >= 45;

    let overall: SafetyState = 'SAFE';
    let reason = 'Atmospheric conditions nominal';

    if (isCoDanger || isVocDanger || isLpgDanger || isTempAlarm) {
      overall = 'DANGER';
      if (isCoDanger) reason = `CRITICAL: CO Level ${co} ppm exceeds 70 ppm danger threshold!`;
      else if (isLpgDanger) reason = `CRITICAL: LPG ${lpg} ppm exceeds combustible threshold!`;
      else if (isVocDanger) reason = `CRITICAL: Toxic VOC ${voc} ppm concentration detected!`;
      else if (isTempAlarm) reason = `CRITICAL: High Thermal Runaway ${temp} °C detected!`;
    } else if (isCoWarn || isVocWarn || isLpgWarn || temp >= 40) {
      overall = 'WARNING';
      if (isCoWarn) reason = `WARNING: Elevated CO level (${co} ppm)`;
      else if (isLpgWarn) reason = `WARNING: Elevated LPG level (${lpg} ppm)`;
      else if (isVocWarn) reason = `WARNING: Elevated VOC level (${voc} ppm)`;
      else reason = `WARNING: Ambient temperature (${temp} °C) elevated`;
    }

    return {
      overall,
      reason,
      coState: isCoDanger ? 'DANGER' : isCoWarn ? 'WARNING' : 'SAFE' as SafetyState,
      vocState: isVocDanger ? 'DANGER' : isVocWarn ? 'WARNING' : 'SAFE' as SafetyState,
      lpgState: isLpgDanger ? 'DANGER' : isLpgWarn ? 'WARNING' : 'SAFE' as SafetyState
    };
  };

  const currentStatus = computeGasState(coPpm, vocPpm, lpgPpm, tempC);
  const isAlarmActive = currentStatus.overall === 'DANGER';
  const isWarnActive = currentStatus.overall === 'WARNING';

  // Audio tone generation for Buzzer
  useEffect(() => {
    if (!soundEnabled) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
      return;
    }

    if (isAlarmActive) {
      // Continuous / alternating 2.4 kHz alarm siren
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!oscRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2400, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime); // Low safe volume
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
      }
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
    }

    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
    };
  }, [soundEnabled, isAlarmActive]);

  // Simulation tick for sequence and CSV log
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSeqId(prev => {
        const next = prev + 1;
        // Jitter simulation
        const jitterCo = Math.max(0, +(coPpm + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const jitterVoc = Math.max(0, +(vocPpm + (Math.random() * 1.2 - 0.6)).toFixed(1));
        const jitterLpg = Math.max(0, +(lpgPpm + (Math.random() * 2.0 - 1.0)).toFixed(0));
        
        const timestamp = Math.floor(Date.now() / 1000);
        const crcHex = `0x${((next * 13) % 255).toString(16).toUpperCase().padStart(2, '0')}`;
        const newRow = `${timestamp},${next},${jitterCo},${jitterVoc},${jitterLpg},${tempC},${humidity},${currentStatus.overall},${crcHex}`;
        
        setCsvLogs(logs => [logs[0], ...logs.slice(1, 14), newRow]);
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, coPpm, vocPpm, lpgPpm, tempC, humidity, currentStatus.overall]);

  // Presets
  const applyPreset = (preset: string) => {
    setSensorFault(false);
    setStaleCommFault(false);
    switch (preset) {
      case 'nominal':
        setCoPpm(12);
        setVocPpm(85);
        setLpgPpm(110);
        setTempC(23);
        setHumidity(48);
        break;
      case 'lpg_leak':
        setCoPpm(15);
        setVocPpm(140);
        setLpgPpm(1850); // DANGER
        setTempC(24);
        setHumidity(52);
        break;
      case 'co_exhaust':
        setCoPpm(88); // DANGER
        setVocPpm(160);
        setLpgPpm(130);
        setTempC(26);
        setHumidity(45);
        break;
      case 'voc_spill':
        setCoPpm(18);
        setVocPpm(520); // DANGER
        setLpgPpm(240);
        setTempC(25);
        setHumidity(55);
        break;
      case 'overheat':
        setCoPpm(30);
        setVocPpm(190);
        setLpgPpm(280);
        setTempC(49); // ALARM
        setHumidity(35);
        break;
      case 'fault':
        setSensorFault(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>INTERACTIVE TEST BENCH & HARDWARE EMULATOR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            SafeBreath Hardware Simulator
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Manipulate gas concentrations or trigger sensor faults to test the embedded pipeline: Arduino ADC sampling, ESP32 safety state evaluation, SSD1306 OLED rendering, 85dB acoustic buzzer activation, MicroSD CSV logging, and Firebase cloud push notifications.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              isPlaying 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause Simulation' : 'Resume Simulation'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border ${
              soundEnabled 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Audio tone feedback for 85dB buzzer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Buzzer Sound: ON' : 'Buzzer Sound: MUTED'}</span>
          </button>

          <button
            onClick={() => applyPreset('nominal')}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Nominal</span>
          </button>
        </div>
      </div>

      {/* Preset Injection Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase tracking-wider">Quick Atmospheric Hazard Presets</span>
          <span>Click to inject real-world event</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPreset('nominal')}
            className="px-3 py-1.5 rounded text-xs font-medium bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-white transition-colors"
          >
            🟢 Nominal Clean Baseline
          </button>
          <button
            onClick={() => applyPreset('lpg_leak')}
            className="px-3 py-1.5 rounded text-xs font-medium bg-slate-950 border border-rose-900/60 hover:border-rose-500 text-rose-300 hover:text-white transition-colors"
          >
            🔥 Elevated LPG Threshold (1850 ppm)
          </button>
          <button
            onClick={() => applyPreset('co_exhaust')}
            className="px-3 py-1.5 rounded text-xs font-medium bg-slate-950 border border-rose-900/60 hover:border-rose-500 text-rose-300 hover:text-white transition-colors"
          >
            💨 High CO Concentration (88 ppm)
          </button>
          <button
            onClick={() => applyPreset('voc_spill')}
            className="px-3 py-1.5 rounded text-xs font-medium bg-slate-950 border border-amber-900/60 hover:border-amber-500 text-amber-300 hover:text-white transition-colors"
          >
            🧪 High VOC Concentration (520 ppm VOC)
          </button>
          <button
            onClick={() => applyPreset('overheat')}
            className="px-3 py-1.5 rounded text-xs font-medium bg-slate-950 border border-amber-900/60 hover:border-amber-500 text-amber-300 hover:text-white transition-colors"
          >
            🌡️ High Temperature Benchmark (49 °C)
          </button>
          <button
            onClick={() => applyPreset('fault')}
            className="px-3 py-1.5 rounded text-xs font-medium bg-slate-950 border border-purple-900/60 hover:border-purple-500 text-purple-300 hover:text-white transition-colors"
          >
            ⚠️ Injected Sensor Pin Disconnect Fault
          </button>
        </div>
      </div>

      {/* Main Workbench Grid: Left Sliders, Center Hardware (OLED + Buzzer), Right Logs/Cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Control Rails (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Atmospheric Variables
              </span>
              <span className="text-[10px] font-mono text-slate-500">LIVE SENSOR INPUT</span>
            </div>

            {/* CO Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">ZE07-CO (Carbon Monoxide)</span>
                <span className={`font-bold ${coPpm > 70 ? 'text-rose-400' : coPpm > 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {coPpm} ppm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                value={coPpm}
                onChange={(e) => setCoPpm(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0</span>
                <span>Warn: 35</span>
                <span>Danger: 70</span>
                <span>120 ppm</span>
              </div>
            </div>

            {/* VOC Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">MQ-135 (VOC & Air Quality)</span>
                <span className={`font-bold ${vocPpm > 400 ? 'text-rose-400' : vocPpm > 200 ? 'text-amber-400' : 'text-sky-400'}`}>
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
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>10</span>
                <span>Warn: 200</span>
                <span>Danger: 400</span>
                <span>600 ppm</span>
              </div>
            </div>

            {/* LPG Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">MQ-6 (LPG & Combustible)</span>
                <span className={`font-bold ${lpgPpm > 1500 ? 'text-rose-400' : lpgPpm > 500 ? 'text-amber-400' : 'text-emerald-400'}`}>
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
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>50</span>
                <span>Warn: 500</span>
                <span>Danger: 1500</span>
                <span>2500 ppm</span>
              </div>
            </div>

            {/* Temp & Humidity Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Temp</span>
                  <span className={`font-bold ${tempC >= 45 ? 'text-rose-400' : 'text-white'}`}>{tempC} °C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Humidity</span>
                  <span className="text-white font-bold">{humidity} %</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            {/* Diagnostic Injection Toggles */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Fault Injection Testing</div>
              
              <label className="flex items-center justify-between text-xs text-slate-300 p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                <span>Disconnect MQ-6 Analog Pin</span>
                <input
                  type="checkbox"
                  checked={sensorFault}
                  onChange={(e) => setSensorFault(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                <span>Simulate Stale UART Timeout (&gt;3.5s)</span>
                <input
                  type="checkbox"
                  checked={staleCommFault}
                  onChange={(e) => setStaleCommFault(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Arduino ADC Status */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 font-mono text-xs">
            <div className="text-slate-400 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                ARDUINO NANO 10-BIT ADC
              </span>
              <span className="text-emerald-400">100Hz FILTERED</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-300">
              <div>A0 (MQ-135): <strong className="text-white">{(vocPpm * 0.95 + 49.8).toFixed(1)} ADC</strong></div>
              <div>A1 (MQ-6): <strong className="text-white">{sensorFault ? '0 ADC [FAULT]' : (lpgPpm * 0.42 + 14.8).toFixed(1) + ' ADC'}</strong></div>
              <div>ZE07 UART: <strong className="text-white">{coPpm} ppm (Linear)</strong></div>
              <div>Packet CRC: <strong className="text-emerald-400">VALID (0x{((seqId * 13) % 255).toString(16).toUpperCase()})</strong></div>
            </div>
          </div>
        </div>

        {/* Center: Real Physical Display & Alarm Core (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* OLED 128x64 Simulation */}
          <div className="p-6 rounded-2xl border-2 border-slate-700 bg-slate-900/90 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                0.96" SSD1306 OLED DISPLAY (128x64)
              </span>
              <span className="text-slate-500">I2C 0x3C</span>
            </div>

            {/* Physical OLED Glass Container */}
            <div className="rounded-xl border-4 border-slate-950 bg-black p-4 font-mono text-xs shadow-inner min-h-[200px] flex flex-col justify-between selection:bg-none">
              {/* OLED Top Bar */}
              <div className="border-b border-cyan-500/40 pb-1.5 flex items-center justify-between text-cyan-400 text-[11px]">
                <span className="font-bold tracking-wider">SAFEBREATH v1.2</span>
                <span className="flex items-center gap-1">
                  <span>WIFI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>SD</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </span>
              </div>

              {/* OLED Main Gas Metrics */}
              <div className="py-3 space-y-2 text-white">
                {sensorFault ? (
                  <div className="text-center py-4 text-amber-300 font-bold space-y-1">
                    <div className="text-sm">*** SENSOR FAULT ***</div>
                    <div className="text-[11px]">MQ-6 ADC=0 (OPEN CIRCUIT)</div>
                    <div className="text-[10px] text-cyan-400">CHECK PHYSICAL WIRING</div>
                  </div>
                ) : staleCommFault ? (
                  <div className="text-center py-4 text-amber-300 font-bold space-y-1">
                    <div className="text-sm">*** COMM TIMEOUT ***</div>
                    <div className="text-[11px]">DATA AGE &gt; 3500 MS</div>
                    <div className="text-[10px] text-cyan-400">WAITING NANO UART...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className={`p-1.5 rounded ${currentStatus.coState === 'DANGER' ? 'bg-cyan-400 text-black font-bold animate-pulse' : 'bg-slate-950 border border-slate-800'}`}>
                      <div className="text-[9px] text-slate-400">CO ppm</div>
                      <div className="text-base font-bold tabular-nums">{coPpm}</div>
                      <div className="text-[8px] uppercase">{currentStatus.coState}</div>
                    </div>

                    <div className={`p-1.5 rounded ${currentStatus.vocState === 'DANGER' ? 'bg-cyan-400 text-black font-bold animate-pulse' : 'bg-slate-950 border border-slate-800'}`}>
                      <div className="text-[9px] text-slate-400">VOC ppm</div>
                      <div className="text-base font-bold tabular-nums">{vocPpm}</div>
                      <div className="text-[8px] uppercase">{currentStatus.vocState}</div>
                    </div>

                    <div className={`p-1.5 rounded ${currentStatus.lpgState === 'DANGER' ? 'bg-cyan-400 text-black font-bold animate-pulse' : 'bg-slate-950 border border-slate-800'}`}>
                      <div className="text-[9px] text-slate-400">LPG ppm</div>
                      <div className="text-base font-bold tabular-nums">{lpgPpm}</div>
                      <div className="text-[8px] uppercase">{currentStatus.lpgState}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* OLED Footer status banner */}
              <div className="border-t border-cyan-500/40 pt-1.5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">T:{tempC}°C H:{humidity}%</span>
                <span className={`font-bold px-1 rounded ${
                  currentStatus.overall === 'DANGER'
                    ? 'bg-cyan-400 text-black animate-pulse'
                    : currentStatus.overall === 'WARNING'
                    ? 'text-cyan-300'
                    : 'text-cyan-400'
                }`}>
                  [{currentStatus.overall}]
                </span>
              </div>
            </div>

            {/* OLED Pixel Legend */}
            <div className="text-[11px] text-slate-400 text-center font-mono">
              Monochrome OLED rendering actual firmware frame buffer (10 FPS refresh)
            </div>
          </div>

          {/* Local Acoustic Buzzer Status */}
          <div className={`p-5 rounded-xl border transition-all ${
            isAlarmActive 
              ? 'bg-rose-950/20 border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.3)] animate-pulse' 
              : isWarnActive 
              ? 'bg-amber-950/20 border-amber-500/40' 
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm border ${
                  isAlarmActive 
                    ? 'bg-rose-500 text-slate-950 border-rose-400 font-bold' 
                    : isWarnActive 
                    ? 'bg-amber-500 text-slate-950 border-amber-400' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Physical Acoustic Alarm</div>
                  <div className="text-base font-bold text-white">
                    {isAlarmActive ? '85 dB SIREN ACTIVE (2.4 kHz PWM)' : isWarnActive ? 'INTERMITTENT WARNING BEEP' : 'PIEZO BUZZER SILENT'}
                  </div>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className={`px-2 py-0.5 rounded font-bold ${
                  isAlarmActive ? 'bg-rose-500 text-black' : isWarnActive ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isAlarmActive ? 'ALARM ON' : isWarnActive ? 'PRE-WARN' : 'MUTED'}
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-300 font-mono">
              {currentStatus.reason}
            </div>
          </div>
        </div>

        {/* Right: MicroSD Log & Cloud / Companion Push (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Simulated Mobile Push Banner (when DANGER) */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              Companion Android App
            </div>

            {isAlarmActive ? (
              <div className="p-3.5 rounded-xl border border-rose-500/60 bg-slate-900 shadow-2xl space-y-2 animate-bounce">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                    <AlertTriangle className="w-3 h-3" />
                    SafeBreath Alert
                  </span>
                  <span>just now</span>
                </div>
                <div className="text-xs font-bold text-white">
                  CRITICAL ATMOSPHERIC HAZARD!
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  {currentStatus.reason}
                </p>
                <div className="text-[10px] font-mono text-emerald-400 pt-1 border-t border-slate-800">
                  Delivered via Firebase Cloud Messaging
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-xs space-y-1.5 text-slate-400">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400">FCM STATUS: CONNECTED</span>
                  <span>ID: #SB-204</span>
                </div>
                <p className="text-[11px]">
                  Remote companion mobile app is listening. In the event of a dangerous threshold breach, high-priority notifications dispatch immediately.
                </p>
              </div>
            )}
          </div>

          {/* MicroSD Local File Log Buffer */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                MicroSD CSV Flight Log
              </span>
              <span className="text-emerald-400">FAT32 APPEND</span>
            </div>
            
            <div className="bg-black rounded-lg p-2.5 h-44 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1 leading-tight selection:bg-emerald-500">
              {csvLogs.map((row, idx) => (
                <div key={idx} className={idx === 0 ? 'text-slate-500 font-bold border-b border-slate-800 pb-0.5' : 'hover:text-emerald-400'}>
                  {row}
                </div>
              ))}
            </div>

            <div className="text-[10px] text-slate-500 flex justify-between pt-1">
              <span>File: /LOGS/SB_TELEMETRY.CSV</span>
              <span>Sequence #{seqId}</span>
            </div>
          </div>

          {/* Cloud REST Ingestion JSON */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Wifi className="w-3.5 h-3.5 text-indigo-400" />
                Supabase Cloud Payload
              </span>
              <span className="text-emerald-400">HTTP 201</span>
            </div>

            <pre className="bg-black rounded-lg p-2.5 text-[10px] text-emerald-400 overflow-x-auto leading-relaxed">
{`{
  "seq": ${seqId},
  "co_ppm": ${coPpm},
  "voc_ppm": ${vocPpm},
  "lpg_ppm": ${lpgPpm},
  "temp_c": ${tempC},
  "rh": ${humidity},
  "state": "${currentStatus.overall}",
  "buzzer": ${isAlarmActive}
}`}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
