import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  HardDrive,
  Wifi,
  ChevronUp,
  ChevronDown,
  Check,
  BellOff,
  CornerUpLeft,
  Fingerprint,
} from 'lucide-react';
import { SimulatorSafetyState } from '../types';
import { SafeBreathShieldSymbol } from './SafeBreathLogo';
import {
  SHARED_THRESHOLDS,
  evaluateHysteresisTransition,
  computeCrc16Ccitt,
} from '../lib/safetyConfig';

function computeSimulatedFrameCrc(
  seq: number,
  co: number,
  voc: number,
  lpg: number,
  temp: number,
  alarmFlag: boolean,
  faultFlag: boolean,
  staleFlag: boolean
): string {
  const coScaled = Math.round(co * 10);
  const vocScaled = Math.round(voc);
  const lpgScaled = Math.round(lpg);
  const flagsByte = (alarmFlag ? 0x01 : 0) | (faultFlag ? 0x02 : 0) | (staleFlag ? 0x04 : 0);
  const payload = [
    0xaa,
    0x55,
    (seq >> 8) & 0xff,
    seq & 0xff,
    (coScaled >> 8) & 0xff,
    coScaled & 0xff,
    (vocScaled >> 8) & 0xff,
    vocScaled & 0xff,
    (lpgScaled >> 8) & 0xff,
    lpgScaled & 0xff,
    Math.round(temp) & 0xff,
    flagsByte & 0xff,
  ];
  const crc = computeCrc16Ccitt(payload);
  return `0x${crc.toString(16).toUpperCase().padStart(4, '0')}`;
}

export const PrecisionHardwareSimulator: React.FC = () => {
  const [coPpm, setCoPpm] = useState<number>(12);
  const [vocPpm, setVocPpm] = useState<number>(85);
  const [lpgPpm, setLpgPpm] = useState<number>(110);
  const [tempC, setTempC] = useState<number>(23);
  const [humidity, setHumidity] = useState<number>(50);

  const [coState, setCoState] = useState<'SAFE' | 'WARNING' | 'DANGER'>('SAFE');
  const [vocState, setVocState] = useState<'SAFE' | 'WARNING' | 'DANGER'>('SAFE');
  const [lpgState, setLpgState] = useState<'SAFE' | 'WARNING' | 'DANGER'>('SAFE');
  const [tempState, setTempState] = useState<'SAFE' | 'WARNING' | 'DANGER'>('SAFE');

  const [sensorFault, setSensorFault] = useState<boolean>(false);
  const [staleTimeout, setStaleTimeout] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sequenceId, setSequenceId] = useState<number>(100);
  const [ipsPage, setIpsPage] = useState<0 | 1 | 2>(0);
  const [sirenMuted, setSirenMuted] = useState<boolean>(false);
  const [lastTouchKey, setLastTouchKey] = useState<string>('Ready (5x TTP223 Idle)');
  const [csvLogs, setCsvLogs] = useState<string[]>([
    'timestamp,seq,co_ppm,voc_ind,lpg_ppm,temp_c,rh_pct,sim_state,crc16_ccitt',
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const updateCo = (val: number) => {
    setCoPpm(val);
    setCoState((prev) => evaluateHysteresisTransition('co', val, prev));
  };
  const updateVoc = (val: number) => {
    setVocPpm(val);
    setVocState((prev) => evaluateHysteresisTransition('voc', val, prev));
  };
  const updateLpg = (val: number) => {
    setLpgPpm(val);
    setLpgState((prev) => evaluateHysteresisTransition('lpg', val, prev));
  };
  const updateTemp = (val: number) => {
    setTempC(val);
    setTempState((prev) => evaluateHysteresisTransition('temp', val, prev));
  };

  let overallState: SimulatorSafetyState = 'SAFE';
  let hazardReason = 'Simulated inputs within nominal thresholds';

  if (staleTimeout) {
    overallState = 'STALE';
    hazardReason = 'SIMULATED STALE TIMEOUT: No UART packet received in >3500 ms';
  } else if (sensorFault) {
    overallState = 'SENSOR FAULT';
    hazardReason = 'SIMULATED SENSOR FAULT: MQ-6 analog input open circuit';
  } else if (
    coState === 'DANGER' ||
    vocState === 'DANGER' ||
    lpgState === 'DANGER' ||
    tempState === 'DANGER'
  ) {
    overallState = 'DANGER';
    if (coState === 'DANGER') hazardReason = `SIMULATED DANGER: CO ${coPpm} ppm > ${SHARED_THRESHOLDS.co.dangerEnter} ppm limit.`;
    else if (lpgState === 'DANGER') hazardReason = `SIMULATED DANGER: LPG ${lpgPpm} ppm > ${SHARED_THRESHOLDS.lpg.dangerEnter} ppm limit.`;
    else if (vocState === 'DANGER') hazardReason = `SIMULATED DANGER: MQ-135 indicator ${vocPpm} > ${SHARED_THRESHOLDS.voc.dangerEnter}.`;
    else hazardReason = `SIMULATED DANGER: High ambient temp ${tempC} °C (>= ${SHARED_THRESHOLDS.temp.dangerEnter} °C).`;
  } else if (
    coState === 'WARNING' ||
    vocState === 'WARNING' ||
    lpgState === 'WARNING' ||
    tempState === 'WARNING'
  ) {
    overallState = 'WARNING';
    if (coState === 'WARNING') hazardReason = `SIMULATED WARNING: Elevated CO (${coPpm} ppm)`;
    else if (lpgState === 'WARNING') hazardReason = `SIMULATED WARNING: Elevated LPG (${lpgPpm} ppm)`;
    else if (vocState === 'WARNING') hazardReason = `SIMULATED WARNING: Elevated MQ-135 indicator (${vocPpm})`;
    else hazardReason = `SIMULATED WARNING: Elevated ambient temp (${tempC} °C)`;
  }

  const isAlarmActive = overallState === 'DANGER';
  const isFaultActive = overallState === 'SENSOR FAULT';
  const isWarnOrStaleActive = overallState === 'WARNING' || overallState === 'STALE';

  const currentCrcHex = computeSimulatedFrameCrc(
    sequenceId,
    coPpm,
    vocPpm,
    lpgPpm,
    tempC,
    isAlarmActive,
    sensorFault,
    staleTimeout
  );

  useEffect(() => {
    if (!soundEnabled || sirenMuted) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore
        }
        oscRef.current = null;
      }
      return;
    }

    if (isAlarmActive) {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    } else if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // ignore
      }
      oscRef.current = null;
    }

    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore
        }
        oscRef.current = null;
      }
    };
  }, [soundEnabled, sirenMuted, isAlarmActive]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setSequenceId((prev) => {
        const next = prev + 1;
        const jCo = Math.max(0, +(coPpm + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const jVoc = Math.max(0, +(vocPpm + (Math.random() * 1.2 - 0.6)).toFixed(1));
        const jLpg = Math.max(0, +(lpgPpm + (Math.random() * 2 - 1)).toFixed(0));
        const ts = Math.floor(Date.now() / 1000);
        const crc = computeSimulatedFrameCrc(
          next,
          jCo,
          jVoc,
          jLpg,
          tempC,
          isAlarmActive,
          sensorFault,
          staleTimeout
        );
        const newRow = `${ts},${next},${jCo},${jVoc},${jLpg},${tempC},${humidity},${overallState},${crc}`;

        setCsvLogs((l) => [l[0], ...l.slice(1, 12), newRow]);
        return next;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying, coPpm, vocPpm, lpgPpm, tempC, humidity, overallState, isAlarmActive, sensorFault, staleTimeout]);

  const applyPreset = (preset: string) => {
    setSensorFault(false);
    setStaleTimeout(false);
    setSirenMuted(false);
    switch (preset) {
      case 'nominal':
        updateCo(12);
        updateVoc(85);
        updateLpg(110);
        updateTemp(23);
        setHumidity(48);
        break;
      case 'lpg':
        updateCo(15);
        updateVoc(130);
        updateLpg(1820);
        updateTemp(24);
        setHumidity(52);
        break;
      case 'co':
        updateCo(86);
        updateVoc(160);
        updateLpg(125);
        updateTemp(25);
        setHumidity(46);
        break;
      case 'voc':
        updateCo(18);
        updateVoc(510);
        updateLpg(220);
        updateTemp(24);
        setHumidity(54);
        break;
      case 'thermal':
        updateCo(28);
        updateVoc(180);
        updateLpg(260);
        updateTemp(48);
        setHumidity(38);
        break;
      case 'fault':
        setSensorFault(true);
        break;
      default:
        break;
    }
  };

  const handleTouchKey = (key: 'UP' | 'DOWN' | 'MENU' | 'MUTE' | 'BACK') => {
    if (key === 'UP') {
      setIpsPage((prev) => ((prev + 2) % 3) as 0 | 1 | 2);
      setLastTouchKey('KEY 1 · UP (GPIO 34)');
    } else if (key === 'DOWN') {
      setIpsPage((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
      setLastTouchKey('KEY 2 · DOWN (GPIO 35)');
    } else if (key === 'MENU') {
      setIpsPage((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
      setLastTouchKey('KEY 3 · MENU/OK (GPIO 36)');
    } else if (key === 'MUTE') {
      setSirenMuted((prev) => !prev);
      setLastTouchKey('KEY 4 · MUTE (GPIO 39)');
    } else if (key === 'BACK') {
      setIpsPage(0);
      setLastTouchKey('KEY 5 · BACK (GPIO 14)');
    }
  };

  const ipsPageLabels = ['PG 1/3 · LIVE GAS', 'PG 2/3 · DHT22 ENV', 'PG 3/3 · NODE & TOUCH'] as const;

  return (
    <div className="bg-[#F5F5F7] text-[#1D1D1F] rounded-[28px] border border-black/[0.06] p-5 sm:p-8 space-y-6">
      {/* Control Header with Explicit SIMULATION MODE Clarity */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-black/[0.08]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
              SIMULATION MODE
            </span>
            <span className="text-[#6E6E73]">
              Browser-Side Logic Model · Does Not Dispatch Cloud Alerts
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight mt-2">
            SafeBreath Interactive Safety Logic Simulator
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-black/[0.08] text-[#1D1D1F] hover:bg-black/5 flex items-center gap-2 transition-colors whitespace-nowrap min-h-[40px] cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />}
            <span>{isPlaying ? 'Pause Simulation' : 'Resume Simulation'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 border transition-colors whitespace-nowrap min-h-[40px] cursor-pointer ${
              soundEnabled
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-[#1D1D1F] border-black/[0.08] hover:bg-black/5'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#86868B]" />
            )}
            <span>{soundEnabled ? 'Simulated Tone: ON' : 'Simulated Tone: MUTED'}</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('nominal')}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1D1D1F] text-white hover:bg-black flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[40px] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Scenario Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono text-[#6E6E73] shrink-0 mr-1">
          Test Scenarios:
        </span>
        <button
          type="button"
          onClick={() => applyPreset('nominal')}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-black/[0.08] text-[#1D1D1F] hover:bg-black/5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Nominal Baseline
        </button>
        <button
          type="button"
          onClick={() => applyPreset('lpg')}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 whitespace-nowrap shrink-0 cursor-pointer"
        >
          LPG Leak (1,820 ppm)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('co')}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 whitespace-nowrap shrink-0 cursor-pointer"
        >
          CO Surge (86 ppm)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('voc')}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 whitespace-nowrap shrink-0 cursor-pointer"
        >
          MQ-135 Spike (510 ind.)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('thermal')}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 whitespace-nowrap shrink-0 cursor-pointer"
        >
          High Ambient Temp (48 °C)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('fault')}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Inject Pin Fault
        </button>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Input Sliders */}
        <div className="md:col-span-1 lg:col-span-4 bg-white rounded-2xl border border-black/[0.06] p-5 space-y-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] text-xs font-mono text-[#6E6E73]">
            <span className="font-semibold text-[#1D1D1F]">Simulated Sensor Inputs</span>
            <span>2 Hz Logic Tick</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#1D1D1F] font-semibold">ZE07-CO</span>
              <span className={`font-bold tabular-nums ${coState === 'DANGER' ? 'text-rose-600' : coState === 'WARNING' ? 'text-amber-600' : 'text-emerald-700'}`}>
                {coPpm} ppm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              value={coPpm}
              onChange={(e) => updateCo(Number(e.target.value))}
              className="w-full h-2 bg-[#F5F5F7] rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#86868B]">
              <span>0</span>
              <span>Warn: 35</span>
              <span>Danger: 70</span>
              <span>120 ppm</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#1D1D1F] font-semibold">MQ-135 (VOC Ind.)</span>
              <span className={`font-bold tabular-nums ${vocState === 'DANGER' ? 'text-rose-600' : vocState === 'WARNING' ? 'text-amber-600' : 'text-sky-700'}`}>
                {vocPpm} ind.
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="600"
              step="5"
              value={vocPpm}
              onChange={(e) => updateVoc(Number(e.target.value))}
              className="w-full h-2 bg-[#F5F5F7] rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#86868B]">
              <span>10</span>
              <span>Warn: 200</span>
              <span>Danger: 400</span>
              <span>600</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#1D1D1F] font-semibold">MQ-6 (LPG)</span>
              <span className={`font-bold tabular-nums ${lpgState === 'DANGER' ? 'text-rose-600' : lpgState === 'WARNING' ? 'text-amber-600' : 'text-amber-700'}`}>
                {lpgPpm} ppm
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="2500"
              step="25"
              value={lpgPpm}
              onChange={(e) => updateLpg(Number(e.target.value))}
              className="w-full h-2 bg-[#F5F5F7] rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#86868B]">
              <span>50</span>
              <span>Warn: 500</span>
              <span>Danger: 1500</span>
              <span>2500 ppm</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black/[0.06]">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#6E6E73]">Ambient Temp</span>
                <span className="font-bold text-[#1D1D1F] tabular-nums">{tempC} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={tempC}
                onChange={(e) => updateTemp(Number(e.target.value))}
                className="w-full h-2 bg-[#F5F5F7] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#6E6E73]">Humidity</span>
                <span className="font-bold text-[#1D1D1F] tabular-nums">{humidity} %</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full h-2 bg-[#F5F5F7] rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-black/[0.06] space-y-2">
            <span className="text-[11px] font-mono text-[#6E6E73] block">Fault Injection Scenarios</span>

            <label className="flex items-center justify-between text-xs text-[#1D1D1F] p-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.04] cursor-pointer">
              <span>Simulate MQ-6 Open Circuit</span>
              <input
                type="checkbox"
                checked={sensorFault}
                onChange={(e) => setSensorFault(e.target.checked)}
                className="rounded text-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-[#1D1D1F] p-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.04] cursor-pointer">
              <span>Simulate Stale UART (&gt;3500 ms)</span>
              <input
                type="checkbox"
                checked={staleTimeout}
                onChange={(e) => setStaleTimeout(e.target.checked)}
                className="rounded text-emerald-600"
              />
            </label>
          </div>
        </div>

        {/* Center: Simulated 1.3" ST7789 IPS Preview, 5x TTP223 Touch Keys & Simulated Buzzer Decision */}
        <div className="md:col-span-1 lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-black/[0.06] p-5 space-y-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between text-xs font-mono text-[#6E6E73] pb-2 border-b border-black/[0.06]">
              <span className="flex items-center gap-2 text-[#1D1D1F] font-semibold">
                <SafeBreathShieldSymbol size={16} />
                1.3&quot; ST7789 IPS Preview (240&times;240 SPI)
              </span>
              <span className="text-[11px] font-mono text-sky-700 font-semibold">{ipsPageLabels[ipsPage]}</span>
            </div>

            {/* Simulated ST7789 RGB565 IPS Canvas */}
            <div className="bg-[#090D16] rounded-xl p-4 font-mono text-xs text-slate-100 min-h-[205px] flex flex-col justify-between border-2 border-slate-800 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[11px]">
                <span className="font-bold tracking-wider text-emerald-400">SAFEBREATH Rev 2.8f</span>
                <div className="flex items-center gap-1.5">
                  {sirenMuted && (
                    <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded">
                      MUTED
                    </span>
                  )}
                  <span className="text-[10px] text-sky-300">RGB565 SIM</span>
                </div>
              </div>

              <div className="py-2 space-y-2">
                {sensorFault ? (
                  <div className="text-center py-3 text-rose-300 font-bold space-y-1 bg-rose-950/50 rounded-lg border border-rose-500/40">
                    <div className="text-sm text-rose-400">*** SENSOR FAULT ***</div>
                    <div className="text-[11px]">MQ-6 ADC=0 (OPEN CIRCUIT)</div>
                    <div className="text-[10px] text-amber-300">VERIFY WIRING INTEGRITY</div>
                  </div>
                ) : staleTimeout ? (
                  <div className="text-center py-3 text-amber-300 font-bold space-y-1 bg-amber-950/40 rounded-lg border border-amber-500/40">
                    <div className="text-sm text-amber-400">*** COMM TIMEOUT ***</div>
                    <div className="text-[11px]">DATA AGE &gt; 3500 MS</div>
                    <div className="text-[10px] text-sky-300">WAITING NANO UART...</div>
                  </div>
                ) : ipsPage === 0 ? (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div
                      className={`p-2 rounded-lg border ${
                        coState === 'DANGER'
                          ? 'bg-rose-600 text-white border-rose-400 font-bold'
                          : coState === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400/50'
                          : 'bg-slate-900 border-sky-500/30'
                      }`}
                    >
                      <div className={`text-[9px] ${coState === 'DANGER' ? 'text-rose-100' : 'text-sky-400'}`}>CO ppm</div>
                      <div className="text-base font-bold tabular-nums">{coPpm}</div>
                    </div>

                    <div
                      className={`p-2 rounded-lg border ${
                        vocState === 'DANGER'
                          ? 'bg-rose-600 text-white border-rose-400 font-bold'
                          : vocState === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400/50'
                          : 'bg-slate-900 border-emerald-500/30'
                      }`}
                    >
                      <div className={`text-[9px] ${vocState === 'DANGER' ? 'text-rose-100' : 'text-emerald-400'}`}>VOC ind</div>
                      <div className="text-base font-bold tabular-nums">{vocPpm}</div>
                    </div>

                    <div
                      className={`p-2 rounded-lg border ${
                        lpgState === 'DANGER'
                          ? 'bg-rose-600 text-white border-rose-400 font-bold'
                          : lpgState === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400/50'
                          : 'bg-slate-900 border-amber-500/30'
                      }`}
                    >
                      <div className={`text-[9px] ${lpgState === 'DANGER' ? 'text-rose-100' : 'text-amber-400'}`}>LPG ppm</div>
                      <div className="text-base font-bold tabular-nums">{lpgPpm}</div>
                    </div>
                  </div>
                ) : ipsPage === 1 ? (
                  <div className="grid grid-cols-2 gap-2.5 text-center">
                    <div
                      className={`p-2.5 rounded-lg border ${
                        tempState === 'DANGER'
                          ? 'bg-rose-600 text-white border-rose-400'
                          : 'bg-slate-900 border-rose-500/30'
                      }`}
                    >
                      <div className="text-[9px] text-rose-300">DHT22 TEMP (&plusmn;0.5&deg;C)</div>
                      <div className="text-lg font-bold tabular-nums mt-0.5">{tempC}.0 &deg;C</div>
                      <div className="text-[9px] text-slate-400">Latch &ge; 45&deg;C</div>
                    </div>
                    <div className="p-2.5 rounded-lg border bg-slate-900 border-indigo-500/30">
                      <div className="text-[9px] text-indigo-300">DHT22 RH (&plusmn;2%)</div>
                      <div className="text-lg font-bold tabular-nums mt-0.5">{humidity}.0 %</div>
                      <div className="text-[9px] text-slate-400">Nano D2 Single-Wire</div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-slate-900 border border-white/10 p-2.5 space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">IPS SPI Bus:</span>
                      <span className="text-sky-300">SCK18 MOSI19 DC4 RST15 CS21</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Touch Array:</span>
                      <span className="text-emerald-300">5x TTP223 (34,35,36,39,14)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Frame CRC-16:</span>
                      <span className="text-amber-300">{currentCrcHex} (Seq #{sequenceId})</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-1.5 text-[10px]">
                <span className="tabular-nums text-slate-300">DHT22 T:{tempC}&deg;C H:{humidity}%</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    overallState === 'DANGER'
                      ? 'bg-rose-600 text-white'
                      : overallState === 'SENSOR FAULT'
                      ? 'bg-rose-900/70 text-rose-200 border border-rose-500/40'
                      : overallState === 'WARNING' || overallState === 'STALE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  }`}
                >
                  [{overallState}]
                </span>
              </div>
            </div>

            {/* Interactive 5x TTP223 Capacitive Touch Keypad */}
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6E73]">
                <span className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-700" />
                  5x TTP223 Touch Bezel
                </span>
                <span className="text-[10px] text-emerald-700 truncate max-w-[175px]">{lastTouchKey}</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTouchKey('UP')}
                  className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#F5F5F7] hover:bg-black/[0.06] border border-black/[0.08] text-[#1D1D1F] transition-colors cursor-pointer"
                  title="TTP223 #1 UP -> GPIO 34"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono font-bold mt-0.5">UP</span>
                  <span className="text-[8px] font-mono text-[#86868B]">G34</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTouchKey('DOWN')}
                  className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#F5F5F7] hover:bg-black/[0.06] border border-black/[0.08] text-[#1D1D1F] transition-colors cursor-pointer"
                  title="TTP223 #2 DOWN -> GPIO 35"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono font-bold mt-0.5">DOWN</span>
                  <span className="text-[8px] font-mono text-[#86868B]">G35</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTouchKey('MENU')}
                  className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#F5F5F7] hover:bg-black/[0.06] border border-black/[0.08] text-[#1D1D1F] transition-colors cursor-pointer"
                  title="TTP223 #3 MENU/OK -> GPIO 36"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[9px] font-mono font-bold mt-0.5">MENU</span>
                  <span className="text-[8px] font-mono text-[#86868B]">G36</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTouchKey('MUTE')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-colors cursor-pointer ${
                    sirenMuted
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-[#F5F5F7] hover:bg-black/[0.06] border-black/[0.08] text-[#1D1D1F]'
                  }`}
                  title="TTP223 #4 MUTE -> GPIO 39"
                >
                  <BellOff className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-[9px] font-mono font-bold mt-0.5">MUTE</span>
                  <span className="text-[8px] font-mono text-[#86868B]">G39</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTouchKey('BACK')}
                  className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#F5F5F7] hover:bg-black/[0.06] border border-black/[0.08] text-[#1D1D1F] transition-colors cursor-pointer"
                  title="TTP223 #5 BACK -> GPIO 14"
                >
                  <CornerUpLeft className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono font-bold mt-0.5">BACK</span>
                  <span className="text-[8px] font-mono text-[#86868B]">G14</span>
                </button>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 space-y-2.5 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${
              isAlarmActive || isFaultActive
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : isWarnOrStaleActive
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-white border-black/[0.06] text-[#1D1D1F]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                    isAlarmActive || isFaultActive
                      ? 'bg-rose-600 text-white border-rose-700'
                      : isWarnOrStaleActive
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] border-black/[0.06]'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#6E6E73]">
                    Simulated Safety Decision · Browser Audio Preview
                  </div>
                  <h4 className="font-bold text-sm text-[#1D1D1F]">
                    {sirenMuted && isAlarmActive
                      ? 'Simulated Siren Silenced (TTP223 MUTE)'
                      : isAlarmActive
                      ? 'Simulated Buzzer Activation (Web Audio)'
                      : isFaultActive
                      ? 'Simulated Hardware Fault Lockout'
                      : overallState === 'STALE'
                      ? 'Simulated Stale Watchdog Alert'
                      : isWarnOrStaleActive
                      ? 'Simulated Pre-Alarm Condition'
                      : 'Simulated Standby State'}
                  </h4>
                </div>
              </div>

              <span
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 ${
                  isAlarmActive || isFaultActive
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : isWarnOrStaleActive
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-[#F5F5F7] text-[#6E6E73] border-black/[0.06]'
                }`}
              >
                {overallState}
              </span>
            </div>

            <p className="text-xs font-mono text-[#6E6E73]">{hazardReason}</p>
          </div>
        </div>

        {/* Right: Explicitly Labeled Simulated Previews & Real CRC-16-CCITT */}
        <div className="md:col-span-2 lg:col-span-3 space-y-4">
          {isAlarmActive ? (
            <div className="bg-rose-50 rounded-2xl border-2 border-rose-300 p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-rose-800">
                <span className="flex items-center gap-1.5 font-bold">
                  <SafeBreathShieldSymbol size={15} />
                  Notification Preview
                </span>
                <span>Mock UI</span>
              </div>
              <div className="font-bold text-xs text-rose-950">Simulated Hazard Alert Layout</div>
              <p className="text-[11px] text-rose-800 leading-tight">{hazardReason}</p>
              <div className="text-[10px] font-mono text-rose-700 pt-1 border-t border-rose-200">
                Simulated preview only — FCM client support requires backend push integration.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-black/[0.06] p-4 space-y-1.5 text-xs text-[#6E6E73] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#1D1D1F] font-semibold">Notification Preview</span>
                <span className="text-[#86868B]">Idle</span>
              </div>
              <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                Displays a sample Android notification card when simulated inputs cross danger thresholds (FCM client support requires backend push integration).
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 space-y-2 font-mono text-xs shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] text-[11px] text-[#6E6E73]">
              <span className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                Simulated Local Log
              </span>
              <span className="text-[#6E6E73]">CRC-16-CCITT</span>
            </div>

            <div className="bg-[#F5F5F7] text-[#1D1D1F] rounded-xl p-3 h-32 overflow-y-auto font-mono text-[9px] space-y-1 leading-tight border border-black/[0.04]">
              {csvLogs.map((row, idx) => (
                <div
                  key={idx}
                  className={idx === 0 ? 'text-[#6E6E73] font-bold border-b border-black/[0.06] pb-0.5' : ''}
                >
                  {row}
                </div>
              ))}
            </div>

            <div className="text-[10px] text-[#86868B] flex justify-between pt-0.5">
              <span>Example SD_MMC Row</span>
              <span className="tabular-nums">Seq #{sequenceId}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.06] p-4 space-y-2 font-mono text-xs shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] text-[11px] text-[#6E6E73]">
              <span className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
                <Wifi className="w-3.5 h-3.5 text-sky-600" />
                Example API Payload
              </span>
              <span className="text-[#6E6E73] font-semibold">Preview JSON</span>
            </div>

            <pre className="bg-[#F5F5F7] border border-black/[0.04] rounded-xl p-2.5 text-[9px] text-[#1D1D1F] overflow-x-auto leading-relaxed">
{`{
  "seq_id": ${sequenceId},
  "co_ppm": ${coPpm},
  "voc_ind": ${vocPpm},
  "lpg_ppm": ${lpgPpm},
  "temp_c": ${tempC},
  "sim_state": "${overallState}",
  "alarm_flag": ${isAlarmActive},
  "crc16_ccitt": "${currentCrcHex}"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
