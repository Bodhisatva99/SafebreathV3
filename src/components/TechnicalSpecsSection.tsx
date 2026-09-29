import React, { useState } from 'react';
import { BILL_OF_MATERIALS, HARDWARE_PINS, SYSTEM_SPECS } from '../data/hardwareData';
import { 
  Cpu, 
  Layers, 
  Wrench, 
  ShieldCheck, 
  Sliders, 
  Database, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  FileCode,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const TechnicalSpecsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calibration' | 'controllers' | 'bom' | 'packet' | 'diagnostics'>('calibration');
  const [calculatorAdc, setCalculatorAdc] = useState<number>(95);
  const [calcSensor, setCalcSensor] = useState<'mq135' | 'mq6'>('mq135');

  // Math for interactive calibration inspector
  const baselineADC = calcSensor === 'mq135' ? 49.81 : 14.82;
  const vOut = (calculatorAdc / 1023.0) * 5.0;
  const loadRL = 1.0; // kOhm
  const rSensor = vOut > 0.05 ? ((5.0 - vOut) / vOut) * loadRL : 999;
  const vOutBase = (baselineADC / 1023.0) * 5.0;
  const r0 = ((5.0 - vOutBase) / vOutBase) * loadRL;
  const rsR0Ratio = r0 > 0 ? rSensor / r0 : 1;
  const estimatedPpm = calcSensor === 'mq135'
    ? Math.max(10, Math.round(116.6 * Math.pow(Math.max(0.1, rsR0Ratio), -2.76)))
    : Math.max(50, Math.round(1000 * Math.pow(Math.max(0.1, rsR0Ratio), -2.15)));

  const totalBOM = BILL_OF_MATERIALS.reduce((sum, item) => sum + item.estimatedCostUsd, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-10 shadow-sm">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
          <Wrench className="w-3.5 h-3.5" />
          <span>Deep Engineering & Firmware Specifications</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Hardware Metrology, Calibration & Bus Protocols
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Expandable technical documentation for engineers, researchers, and technical reviewers. SafeBreath provides documented mathematical baselines and reproducible schematics.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('calibration')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'calibration' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Calibration & Rs/R0 Math
        </button>
        <button
          onClick={() => setActiveTab('controllers')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'controllers' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Dual-Controller Architecture
        </button>
        <button
          onClick={() => setActiveTab('packet')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'packet' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          16-Byte UART Framing
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'diagnostics' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Fault Detection & Stale Limits
        </button>
        <button
          onClick={() => setActiveTab('bom')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'bom' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bill of Materials ($42.50)
        </button>
      </div>

      {/* Tab 1: Calibration */}
      {activeTab === 'calibration' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">MQ-135 VOC BASELINE</span>
              <div className="text-3xl font-bold font-mono text-slate-900">49.81 ADC</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empirical clean-air resistance constant measured across a precision 1.0 kΩ RL load resistor at 20°C and 55% RH.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">MQ-6 LPG BASELINE</span>
              <div className="text-3xl font-bold font-mono text-slate-900">14.82 ADC</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean-air reference baseline for combustible isobutane/propane SnO2 catalytic surface kinetics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">LOAD RESISTOR RL</span>
              <div className="text-3xl font-bold font-mono text-slate-900">1.0 kΩ</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                1% metal film load resistor converting variable sensor surface resistance into a 0.0–5.0V measurable analog output.
              </p>
            </div>
          </div>

          {/* Interactive Math Tool */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">Interactive Resistance Ratio & PPM Calculator</h4>
                <p className="text-xs text-slate-500">Calculate Rs, R0, and estimated gas concentrations directly from raw ADC voltages.</p>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-slate-200">
                <button
                  onClick={() => { setCalcSensor('mq135'); setCalculatorAdc(95); }}
                  className={`px-3 py-1 text-xs font-medium rounded ${calcSensor === 'mq135' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  MQ-135 VOC
                </button>
                <button
                  onClick={() => { setCalcSensor('mq6'); setCalculatorAdc(85); }}
                  className={`px-3 py-1 text-xs font-medium rounded ${calcSensor === 'mq6' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  MQ-6 LPG
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600">Simulate 10-Bit ADC Voltage</span>
                  <span className="font-bold text-slate-900">{calculatorAdc} ADC ({vOut.toFixed(2)} V)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="800"
                  value={calculatorAdc}
                  onChange={(e) => setCalculatorAdc(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="md:col-span-6 grid grid-cols-3 gap-3 text-center font-mono text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">SENSOR Rs</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{rSensor.toFixed(2)} kΩ</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">RATIO Rs/R0</span>
                  <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{rsR0Ratio.toFixed(3)}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">APPROX PPM</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{estimatedPpm} ppm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Controllers */}
      {activeTab === 'controllers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-mono text-emerald-800 font-bold uppercase">CONTROLLER 01</span>
              <h4 className="text-lg font-bold text-slate-900">Arduino Nano V3</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Handles continuous 10-bit analog oversampling (100 Hz loop) of MQ-135 and MQ-6 across the 1.0kΩ RL. Decodes microsecond-sensitive 40-bit DHT11 pulse widths.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                Isolation: Prevents Wi-Fi stack stalls from disrupting analog timing.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-mono text-emerald-800 font-bold uppercase">CONTROLLER 02</span>
              <h4 className="text-lg font-bold text-slate-900">ESP32 DevKit Core</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The master safety decision engine. Evaluates multi-gas threshold hysteresis, validates incoming packet CRC checksums, and directly drives the 85dB acoustic buzzer via hardware PWM.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                Isolation: Completely independent of internet or router uptime.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-mono text-emerald-800 font-bold uppercase">CONTROLLER 03</span>
              <h4 className="text-lg font-bold text-slate-900">ESP32-CAM Gateway</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manages 802.11 b/g/n Wi-Fi connectivity, store-and-forward queues, and local MicroSD FAT32 flight-recorder file writes.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                Isolation: Network dropouts do not block local life-safety loops.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: UART Packet */}
      {activeTab === 'packet' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Offset</th>
                  <th className="py-3 px-4">Field</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Encoding Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x00–0x01</td><td className="py-2.5 px-4 font-bold">SYNC_HEADER</td><td className="py-2.5 px-4 text-slate-500">uint16_t</td><td className="py-2.5 px-4">Magic marker 0xAA55 for frame alignment</td></tr>
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x02–0x03</td><td className="py-2.5 px-4 font-bold">SEQUENCE_ID</td><td className="py-2.5 px-4 text-slate-500">uint16_t</td><td className="py-2.5 px-4">Monotonically increasing counter for drop detection</td></tr>
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x04–0x05</td><td className="py-2.5 px-4 font-bold">RAW_MQ135_ADC</td><td className="py-2.5 px-4 text-slate-500">uint16_t</td><td className="py-2.5 px-4">Filtered 10-bit ADC reading across 1.0kΩ RL</td></tr>
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x06–0x07</td><td className="py-2.5 px-4 font-bold">RAW_MQ6_ADC</td><td className="py-2.5 px-4 text-slate-500">uint16_t</td><td className="py-2.5 px-4">Filtered 10-bit ADC reading across 1.0kΩ RL</td></tr>
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x08–0x09</td><td className="py-2.5 px-4 font-bold">ZE07_CO_PPM</td><td className="py-2.5 px-4 text-slate-500">uint16_t</td><td className="py-2.5 px-4">Linear digital CO concentration scaled by 10 (e.g. 124 = 12.4 ppm)</td></tr>
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x0A</td><td className="py-2.5 px-4 font-bold">TEMP_C</td><td className="py-2.5 px-4 text-slate-500">uint8_t</td><td className="py-2.5 px-4">Ambient temperature in Celsius (DHT11)</td></tr>
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x0B</td><td className="py-2.5 px-4 font-bold">HUMIDITY_PCT</td><td className="py-2.5 px-4 text-slate-500">uint8_t</td><td className="py-2.5 px-4">Relative humidity percentage (20–90%)</td></tr>
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x0C</td><td className="py-2.5 px-4 font-bold">SENSOR_FLAGS</td><td className="py-2.5 px-4 text-slate-500">uint8_t</td><td className="py-2.5 px-4">Bitmask: CO_OK | MQ135_OK | MQ6_OK | DHT_OK</td></tr>
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x0D–0x0E</td><td className="py-2.5 px-4 font-bold">CRC16_CHECKSUM</td><td className="py-2.5 px-4 text-slate-500">uint16_t</td><td className="py-2.5 px-4">CRC-16-CCITT computed over bytes 0x02 through 0x0C</td></tr>
                <tr><td className="py-2.5 px-4 font-semibold text-emerald-800">0x0F</td><td className="py-2.5 px-4 font-bold">PACKET_TAIL</td><td className="py-2.5 px-4 text-slate-500">uint8_t</td><td className="py-2.5 px-4">Delimiter 0x0D ('\r') for packet verification</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Diagnostics */}
      {activeTab === 'diagnostics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-base font-bold text-slate-900">Sensor Disconnect & Bounds Isolation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an analog pin reads 0 (open ground/disconnected wire) or 1023 (short to 5V power), the firmware marks that channel as <code>SENSOR_FAULT</code> rather than interpreting 0V as clean air.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-base font-bold text-slate-900">Data-Age & Stale Packet Timeout</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              If the central ESP32 does not receive a valid telemetry frame for over 3,500 ms, the OLED displays <code>DATA_STALE</code> and alerts the user to check inter-board UART communication lines.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: BOM */}
      {activeTab === 'bom' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2">
            <span className="text-xs font-mono text-slate-500">PROTOTYPE BILL OF MATERIALS</span>
            <span className="text-lg font-bold font-mono text-emerald-800">Total: ${totalBOM.toFixed(2)} USD</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Component</th>
                  <th className="py-3 px-4">Subsystem</th>
                  <th className="py-3 px-4">Part / Reference</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {BILL_OF_MATERIALS.map((b, i) => (
                  <tr key={i}>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{b.component}</td>
                    <td className="py-2.5 px-4 text-slate-500">{b.subsystem}</td>
                    <td className="py-2.5 px-4 text-slate-500">{b.partNumber}</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-800">${b.estimatedCostUsd.toFixed(2)}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600 text-xs">{b.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
