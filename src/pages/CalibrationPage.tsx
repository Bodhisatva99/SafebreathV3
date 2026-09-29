import React, { useState } from 'react';
import { PageTab } from '../types';
import { SYSTEM_SPECS } from '../data/hardwareData';
import { 
  Wrench, 
  Thermometer, 
  Activity, 
  HelpCircle, 
  CheckCircle, 
  Sliders, 
  RefreshCw,
  Cpu,
  Code2,
  FileCode,
  Flame
} from 'lucide-react';

interface CalibrationPageProps {
  onSelectTab: (tab: PageTab) => void;
}

export const CalibrationPage: React.FC<CalibrationPageProps> = ({ onSelectTab }) => {
  // Interactive Calibration Calculator
  const [calcSensor, setCalcSensor] = useState<'mq135' | 'mq6'>('mq135');
  const [rawAdc, setRawAdc] = useState<number>(95);
  const [supplyVoltage] = useState<number>(5.0);
  const [loadResistorRL] = useState<number>(1.0); // kOhm

  // Calibration constants from firmware
  const baselineADC = calcSensor === 'mq135' ? 49.81 : 14.82;
  const sensorName = calcSensor === 'mq135' ? 'MQ-135 (VOC & Air Quality)' : 'MQ-6 (LPG & Combustibles)';

  // Calculate sensor electrical characteristics
  // V_out = (ADC / 1023.0) * Vcc
  const vOut = (rawAdc / 1023.0) * supplyVoltage;
  // R_s = ((Vcc - V_out) / V_out) * R_L
  const rSensor = vOut > 0.05 ? ((supplyVoltage - vOut) / vOut) * loadResistorRL : 999;
  
  // Baseline clean air voltage and resistance R0
  const vOutBase = (baselineADC / 1023.0) * supplyVoltage;
  const r0 = ((supplyVoltage - vOutBase) / vOutBase) * loadResistorRL;
  
  // Ratio Rs / R0
  const rsR0Ratio = r0 > 0 ? rSensor / r0 : 1;

  // Approximate PPM power-law curve: PPM = a * (Rs/R0)^b
  const approxPpm = calcSensor === 'mq135' 
    ? Math.max(10, Math.round(116.6 * Math.pow(Math.max(0.1, rsR0Ratio), -2.76)))
    : Math.max(50, Math.round(1000 * Math.pow(Math.max(0.1, rsR0Ratio), -2.15)));

  return (
    <div className="space-y-20 py-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
          Metrology & Firmware Constants
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sensor Calibration & Firmware Protocol
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Metal-oxide semiconductor (MOS) and electrochemical sensors require precise electrical operating parameters, clean-air baseline calibration, and temperature compensation formulas.
        </p>
      </div>

      {/* Firmware Calibration Constants Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400">MQ-135 CALIBRATION</span>
            <span className="text-slate-500">SnO2 VOC PROBE</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-white">49.81 ADC</div>
            <div className="text-xs text-slate-400">Clean Air Baseline (R0 reference)</div>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div>Load Resistor RL: <strong>1.0 kΩ (1% Metal Film)</strong></div>
            <div>Heater Voltage: <strong>5.0V ± 0.1V DC</strong></div>
            <div>Preheat Time: <strong>180 seconds</strong></div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400">MQ-6 CALIBRATION</span>
            <span className="text-slate-500">SnO2 LPG PROBE</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-white">14.82 ADC</div>
            <div className="text-xs text-slate-400">Clean Air Baseline (R0 reference)</div>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div>Load Resistor RL: <strong>1.0 kΩ (1% Metal Film)</strong></div>
            <div>Heater Resistance: <strong>31Ω ± 3Ω</strong></div>
            <div>Thermal Dissipation: <strong>~800 mW</strong></div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400">ZE07-CO CALIBRATION</span>
            <span className="text-slate-500">ELECTROCHEMICAL</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-white">Linear UART</div>
            <div className="text-xs text-slate-400">Direct 0–500 ppm Stream</div>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div>Resolution: <strong>0.1 ppm</strong></div>
            <div>Factory Zero-Point: <strong>Calibrated in N2 clean room</strong></div>
            <div>Checksum: <strong>9-byte frame checksum byte</strong></div>
          </div>
        </div>
      </section>

      {/* Interactive Calibration & Resistance Calculator */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Metrology Tool</div>
            <h2 className="text-2xl font-bold text-white mt-1">Interactive Gas Sensor Resistance Calculator</h2>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => { setCalcSensor('mq135'); setRawAdc(95); }}
              className={`px-3 py-1.5 text-xs font-mono rounded ${calcSensor === 'mq135' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              MQ-135 VOC
            </button>
            <button
              onClick={() => { setCalcSensor('mq6'); setRawAdc(85); }}
              className={`px-3 py-1.5 text-xs font-mono rounded ${calcSensor === 'mq6' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              MQ-6 LPG
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Input ADC Voltage Sample</span>
              <div className="text-sm font-semibold text-white">{sensorName}</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">10-BIT ADC READING (0–1023)</span>
                <span className="text-base font-bold text-emerald-400 font-mono">{rawAdc} ADC</span>
              </div>
              <input
                type="range"
                min="10"
                max="800"
                value={rawAdc}
                onChange={(e) => setRawAdc(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Baseline: {baselineADC} ADC</span>
                <span>Measured Voltage: {vOut.toFixed(3)} V</span>
                <span>Max: 1023 ADC (5.0V)</span>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-400 text-[11px] uppercase">Firmware Conversion Formula</div>
              <div className="text-emerald-400 font-bold">
                Rs = ((Vcc - Vout) / Vout) * RL
              </div>
              <div className="text-slate-400 text-[11px]">
                where Vcc = 5.0V, RL = 1.0 kΩ, and Vout = (ADC / 1023.0) * 5.0
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4 font-mono text-xs">
              <div className="text-slate-400 text-[11px] uppercase border-b border-slate-800 pb-2">
                Calculated Physical Quantities
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">SENSOR OUTPUT (Vout)</div>
                  <div className="text-lg font-bold text-white">{vOut.toFixed(3)} V</div>
                </div>
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">SENSOR RESISTANCE (Rs)</div>
                  <div className="text-lg font-bold text-white">{rSensor.toFixed(2)} kΩ</div>
                </div>
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">RATIO (Rs / R0)</div>
                  <div className="text-lg font-bold text-emerald-400">{rsR0Ratio.toFixed(3)}</div>
                </div>
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">ESTIMATED GAS PPM</div>
                  <div className="text-lg font-bold text-amber-400">{approxPpm} ppm</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-sans leading-relaxed pt-2">
                As combustible or organic gas molecules adsorb onto the heated SnO2 surface, donor electrons transfer into the conduction band, lowering sensor resistance (Rs) and increasing measured voltage (Vout).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sensor Calibration Protocol & Preheating Cycles */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Operating Standards</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Preheating & Environmental Compensation</h2>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            Gas sensor physical chemistry requires thermal equilibrium before readings stabilize. SafeBreath enforces systematic firmware startup routines:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white">180s Heater Warm-Up Cycle</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon system power-on, the ESP32 displays a warm-up countdown on the OLED while the internal heating coils bring the SnO2 pellets to ~300°C. Alarms are muted during this window to eliminate false positives.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Thermometer className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white">DHT11 Climate Compensation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ambient temperature and humidity alter gas adsorption kinetics. The firmware computes an environmental correction multiplier K(T, H) to adjust raw Rs values according to manufacturer curves.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white">Baseline Drift Tracking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Over long deployment durations, sensor aging causes slow baseline drift. SafeBreath logs moving-minimum baselines during clean air periods, alerting users when re-calibration is required.
            </p>
          </div>
        </div>
      </section>

      {/* UART Packet Frame Specification */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Inter-Controller Protocol</div>
          <h2 className="text-2xl font-bold text-white mt-1">UART Telemetry Frame Structure (16 Bytes)</h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Byte Offset</th>
                <th className="py-2.5 px-3">Field Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Description & Encoding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x00–0x01</td>
                <td className="py-2.5 px-3 text-white">SYNC_HEADER</td>
                <td className="py-2.5 px-3 text-sky-400">uint16_t</td>
                <td className="py-2.5 px-3 text-slate-400">Fixed sync magic marker <code>0xAA55</code> to frame packet starts</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x02–0x03</td>
                <td className="py-2.5 px-3 text-white">SEQUENCE_ID</td>
                <td className="py-2.5 px-3 text-sky-400">uint16_t</td>
                <td className="py-2.5 px-3 text-slate-400">Monotonically incremented counter for packet loss & drop detection</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x04–0x05</td>
                <td className="py-2.5 px-3 text-white">RAW_MQ135_ADC</td>
                <td className="py-2.5 px-3 text-sky-400">uint16_t</td>
                <td className="py-2.5 px-3 text-slate-400">10-bit analog voltage reading across 1.0kΩ RL (0–1023)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x06–0x07</td>
                <td className="py-2.5 px-3 text-white">RAW_MQ6_ADC</td>
                <td className="py-2.5 px-3 text-sky-400">uint16_t</td>
                <td className="py-2.5 px-3 text-slate-400">10-bit analog voltage reading across 1.0kΩ RL (0–1023)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x08–0x09</td>
                <td className="py-2.5 px-3 text-white">ZE07_CO_PPM</td>
                <td className="py-2.5 px-3 text-sky-400">uint16_t</td>
                <td className="py-2.5 px-3 text-slate-400">Decoded CO concentration scaled by 10 (e.g. 124 = 12.4 ppm)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x0A</td>
                <td className="py-2.5 px-3 text-white">TEMP_CELSIUS</td>
                <td className="py-2.5 px-3 text-sky-400">uint8_t</td>
                <td className="py-2.5 px-3 text-slate-400">Ambient temperature integer from DHT11</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x0B</td>
                <td className="py-2.5 px-3 text-white">HUMIDITY_PCT</td>
                <td className="py-2.5 px-3 text-sky-400">uint8_t</td>
                <td className="py-2.5 px-3 text-slate-400">Relative humidity integer (20–90%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x0C</td>
                <td className="py-2.5 px-3 text-white">SENSOR_FLAGS</td>
                <td className="py-2.5 px-3 text-sky-400">uint8_t</td>
                <td className="py-2.5 px-3 text-slate-400">Bitmask: Bit0=CO_OK, Bit1=MQ135_OK, Bit2=MQ6_OK, Bit3=DHT_OK</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x0D–0x0E</td>
                <td className="py-2.5 px-3 text-white">CRC16_CHECKSUM</td>
                <td className="py-2.5 px-3 text-sky-400">uint16_t</td>
                <td className="py-2.5 px-3 text-slate-400">CRC-16-CCITT computed over bytes 0x02 through 0x0C</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">Byte 0x0F</td>
                <td className="py-2.5 px-3 text-white">PACKET_TAIL</td>
                <td className="py-2.5 px-3 text-sky-400">uint8_t</td>
                <td className="py-2.5 px-3 text-slate-400">Termination delimiter <code>0x0D</code> ('\r')</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
