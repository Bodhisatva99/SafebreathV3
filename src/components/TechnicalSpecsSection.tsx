import React, { useState } from 'react';
import { Download } from 'lucide-react';
import {
  BILL_OF_MATERIALS,
  ECONOMICS_SUMMARY,
  HARDWARE_PINS,
  SYSTEM_SPECS,
} from '../data/hardwareData';

type BoardFilter = 'all' | 'esp32' | 'nano' | 'cam';

export const TechnicalSpecsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'pinout' | 'specs' | 'calibration' | 'controllers' | 'packet' | 'bom'
  >('pinout');
  const [boardFilter, setBoardFilter] = useState<BoardFilter>('all');
  const [calculatorAdc, setCalculatorAdc] = useState<number>(95);
  const [calcSensor, setCalcSensor] = useState<'mq135' | 'mq6'>('mq135');

  const baselineADC = calcSensor === 'mq135' ? 49.81 : 14.82;
  const vOut = (calculatorAdc / 1023.0) * 5.0;
  const loadRL = 1.0;
  const rSensor = vOut > 0.05 ? ((5.0 - vOut) / vOut) * loadRL : 999;
  const vOutBase = (baselineADC / 1023.0) * 5.0;
  const r0 = ((5.0 - vOutBase) / vOutBase) * loadRL;
  const rsR0Ratio = r0 > 0 ? rSensor / r0 : 1;
  const estimatedPpm =
    calcSensor === 'mq135'
      ? Math.max(10, Math.round(116.6 * Math.pow(Math.max(0.1, rsR0Ratio), -2.76)))
      : Math.max(50, Math.round(1000 * Math.pow(Math.max(0.1, rsR0Ratio), -2.15)));

  const totalUsd = BILL_OF_MATERIALS.reduce((sum, item) => sum + item.estimatedCostUsd, 0);
  const totalInr = BILL_OF_MATERIALS.reduce((sum, item) => sum + item.estimatedCostInr, 0);

  const filteredPins = HARDWARE_PINS.filter((row) => {
    if (boardFilter === 'esp32') return row.board.includes('DevKit');
    if (boardFilter === 'nano') return row.board.includes('Nano');
    if (boardFilter === 'cam') return row.board.includes('ESP32-CAM');
    return true;
  });

  const handleDownloadEngineeringDoc = () => {
    const doc = {
      project: 'SafeBreath V3',
      hardwareRevision: SYSTEM_SPECS.version,
      generatedAt: new Date().toISOString(),
      pinoutRev2_8f: HARDWARE_PINS,
      sensorSpecifications: SYSTEM_SPECS.thresholds,
      economicsInr: ECONOMICS_SUMMARY,
      billOfMaterials: BILL_OF_MATERIALS,
    };
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'safebreath-v3-rev2.8f-engineering-package.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="pinout" className="bg-white rounded-[28px] border border-black/[0.06] p-6 sm:p-8 space-y-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      {/* Header + Document Package Download + Segmented Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-semibold text-emerald-700">
              Engineering Document &amp; Spec Center · Revision 2.8f
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F] mt-1">
              GPIO Pinout Matrix, Datasheet Spec Sheet &amp; INR Economics
            </h3>
          </div>

          <button
            type="button"
            onClick={handleDownloadEngineeringDoc}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F5F7] hover:bg-black/[0.06] text-xs font-semibold text-[#1D1D1F] border border-black/[0.08] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Rev 2.8f Spec Package (JSON)</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-[#F5F5F7] rounded-2xl border border-black/[0.06] w-full">
          <button
            type="button"
            onClick={() => setActiveTab('pinout')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pinout' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            GPIO Pinout Reference
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'specs' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            Product &amp; Datasheet Specs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calibration')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'calibration' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            Calibration &amp; Rs/R0 Math
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('controllers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'controllers' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            Controller Pin Roles
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('packet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'packet' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            16-Byte UART Frame
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bom')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'bom' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            INR BOM (₹{totalInr.toLocaleString('en-IN')})
          </button>
        </div>
      </div>

      {/* Tab 0: Complete GPIO Pinout Reference (Rev 2.8f) */}
      {activeTab === 'pinout' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F5F5F7] rounded-full border border-black/[0.06] self-start">
              {[
                { id: 'all' as BoardFilter, label: `All Boards (${HARDWARE_PINS.length})` },
                { id: 'esp32' as BoardFilter, label: 'ESP32 DevKit V1 (9)' },
                { id: 'nano' as BoardFilter, label: 'Arduino Nano (4)' },
                { id: 'cam' as BoardFilter, label: 'ESP32-CAM Gateway (4)' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBoardFilter(b.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    boardFilter === b.id
                      ? 'bg-white text-[#1D1D1F] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-emerald-700 font-semibold">
              Verified Rev 2.8f Wiring Standard
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F5F5F7] border-b border-black/[0.06] text-[#6E6E73] text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Board</th>
                  <th className="py-3.5 px-4 font-semibold">Function</th>
                  <th className="py-3.5 px-4 font-semibold">GPIO / Pin</th>
                  <th className="py-3.5 px-4 font-semibold">Connection</th>
                  <th className="py-3.5 px-4 font-semibold">Bus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-[#1D1D1F]">
                {filteredPins.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F5F7]/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#1D1D1F] whitespace-nowrap">
                      {row.board}
                    </td>
                    <td className="py-3 px-4">{row.function}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700 whitespace-nowrap tabular-nums">
                      {row.pin}
                    </td>
                    <td className="py-3 px-4 text-[#6E6E73]">{row.connection}</td>
                    <td className="py-3 px-4 text-[#86868B] whitespace-nowrap">{row.bus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 1: Datasheet vs Measured vs Design-Target Spec Sheet */}
      {activeTab === 'specs' && (
        <div className="space-y-5">
          <div className="text-xs text-[#6E6E73] leading-relaxed">
            Explicit separation between manufacturer datasheet bounds, embedded firmware limits, and pending bench verification measurements:
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F5F5F7] border-b border-black/[0.06] text-[#6E6E73] text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Channel / Component</th>
                  <th className="py-3.5 px-4 font-semibold">Datasheet Spec</th>
                  <th className="py-3.5 px-4 font-semibold">Warm-Up / Preheat</th>
                  <th className="py-3.5 px-4 font-semibold">Response vs MCU Latency</th>
                  <th className="py-3.5 px-4 font-semibold">Known Limitations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-[#1D1D1F]">
                <tr>
                  <td className="py-3 px-4 font-bold">Winsen ZE07-CO</td>
                  <td className="py-3 px-4">0–500 ppm (0.1 ppm res) · 5–12V DC (Factory calibrated)</td>
                  <td className="py-3 px-4">Warm-up &le; 3 min</td>
                  <td className="py-3 px-4">T90 &le; 60 s (datasheet) · &lt; 10 ms MCU design target</td>
                  <td className="py-3 px-4 font-sans text-[#6E6E73]">Cross-sensitivity to H2/alcohol; prototype chamber error pending</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Hanwei MQ-135</td>
                  <td className="py-3 px-4">10–1,000 ppm (target gas) · RL = 1.0 kΩ (Normalized)</td>
                  <td className="py-3 px-4">&ge; 48 h initial burn-in · 180 s zero</td>
                  <td className="py-3 px-4">100 Hz oversampled ADC &rarr; 2 Hz frame</td>
                  <td className="py-3 px-4 font-sans text-[#6E6E73]">Relative VOC indicator only; no compound-specific calibration</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Hanwei MQ-6</td>
                  <td className="py-3 px-4">300–10,000 ppm Propane/LPG · RL = 1.0 kΩ (Normalized)</td>
                  <td className="py-3 px-4">&ge; 48 h initial preheat conditioning</td>
                  <td className="py-3 px-4">Continuous ADC · Warn &gt;500 / Danger &gt;1500</td>
                  <td className="py-3 px-4 font-sans text-[#6E6E73]">Curve fit unvalidated vs reference propane/LPG test gas</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Aosong DHT22 (AM2302)</td>
                  <td className="py-3 px-4">-40 to +80 °C (±0.5 °C) · 0–100 % RH (±2 %)</td>
                  <td className="py-3 px-4">&lt; 2 s power stabilization</td>
                  <td className="py-3 px-4">0.5 Hz proprietary single-wire frame</td>
                  <td className="py-3 px-4 font-sans text-[#6E6E73]">Ambient temperature indicator only; not a certified fire detector</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">1.3&quot; ST7789 IPS + 5x TTP223</td>
                  <td className="py-3 px-4">240x240 RGB565 SPI TFT + 5x 3.3V Capacitive Keys</td>
                  <td className="py-3 px-4">&lt; 0.5 s capacitive baseline auto-cal</td>
                  <td className="py-3 px-4">SPI (18/19/4/15/21) + Touch (34/35/36/39/14)</td>
                  <td className="py-3 px-4 font-sans text-[#6E6E73]">Upgraded from 0.96&quot; OLED &amp; 2 touch keys for full menu UI</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">TMB12A05 + Driver</td>
                  <td className="py-3 px-4">5V active buzzer · 85 dB @ 10 cm (datasheet rating)</td>
                  <td className="py-3 px-4">Instantaneous</td>
                  <td className="py-3 px-4">&lt; 10 ms GPIO 13 NPN/MOSFET target</td>
                  <td className="py-3 px-4 font-sans text-[#6E6E73]">Prototype SPL meter measurement pending</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">2x SCT-013-030</td>
                  <td className="py-3 px-4">0–30 A AC / 1 Vrms (Experimental GPIO 33/32)</td>
                  <td className="py-3 px-4">Built-in burden + external 1.65V bias</td>
                  <td className="py-3 px-4">ADC1 mapped in Rev 2.8f hardware</td>
                  <td className="py-3 px-4 font-sans text-[#6E6E73]">Cloud telemetry columns &amp; RMS calibration pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Calibration */}
      {activeTab === 'calibration' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] space-y-2">
              <span className="text-xs font-mono text-[#6E6E73] block">MQ-135 Runtime Baseline</span>
              <div className="text-3xl font-bold font-mono text-[#1D1D1F] tabular-nums">49.81 ADC</div>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Clean-air baseline sampled after 180 s runtime warm-up (following initial &ge; 48 h manufacturer burn-in).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] space-y-2">
              <span className="text-xs font-mono text-[#6E6E73] block">MQ-6 Runtime Baseline</span>
              <div className="text-3xl font-bold font-mono text-[#1D1D1F] tabular-nums">14.82 ADC</div>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Clean-air baseline across RL = 1.0 kΩ (datasheet propane span 300–10,000 ppm; target-gas curve calibration pending).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] space-y-2">
              <span className="text-xs font-mono text-[#6E6E73] block">Load Resistor RL</span>
              <div className="text-3xl font-bold font-mono text-[#1D1D1F] tabular-nums">1.0 kΩ</div>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                1% metal film load resistor converting SnO2 resistance change into a 0.0–5.0V ADC voltage divider.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold text-[#1D1D1F]">
                    Resistance Ratio &amp; Unvalidated Model Explorer
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    UNVALIDATED MODEL ESTIMATE
                  </span>
                </div>
                <p className="text-xs text-[#6E6E73] mt-1">
                  Exact electrical resistance (Rs) and clean-air ratio (Rs/R0) are computed from 10-bit ADC readings. Projected ppm/indicator figures use preliminary datasheet power-law constants and are NOT laboratory-calibrated measurements until checked against certified reference gases.
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-black/[0.08] self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setCalcSensor('mq135');
                    setCalculatorAdc(95);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full cursor-pointer ${
                    calcSensor === 'mq135' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73]'
                  }`}
                >
                  MQ-135 (A0)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCalcSensor('mq6');
                    setCalculatorAdc(85);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full cursor-pointer ${
                    calcSensor === 'mq6' ? 'bg-[#1D1D1F] text-white' : 'text-[#6E6E73]'
                  }`}
                >
                  MQ-6 (A1)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#6E6E73]">10-Bit ADC Input</span>
                  <span className="font-bold text-[#1D1D1F] tabular-nums">
                    {calculatorAdc} ADC ({vOut.toFixed(2)} V)
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="800"
                  value={calculatorAdc}
                  onChange={(e) => setCalculatorAdc(Number(e.target.value))}
                  className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="md:col-span-6 grid grid-cols-3 gap-3 text-center font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06]">
                  <span className="text-[10px] text-[#6E6E73] block">Sensor Rs</span>
                  <span className="font-bold text-[#1D1D1F] text-sm mt-0.5 block tabular-nums">
                    {rSensor.toFixed(2)} kΩ
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06]">
                  <span className="text-[10px] text-[#6E6E73] block">Ratio Rs/R0</span>
                  <span className="font-bold text-emerald-700 text-sm mt-0.5 block tabular-nums">
                    {rsR0Ratio.toFixed(3)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[10px] text-amber-800 block">Model Est. (Unval.)</span>
                  <span className="font-bold text-amber-950 text-sm mt-0.5 block tabular-nums">
                    {estimatedPpm} {calcSensor === 'mq135' ? 'ind.' : 'est.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Controllers with Explicit GPIO Pin Mappings */}
      {activeTab === 'controllers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] space-y-4">
            <div>
              <span className="text-xs font-mono text-emerald-700 font-semibold">Node 01 · Acquisition</span>
              <h4 className="text-lg font-bold text-[#1D1D1F] mt-0.5">Arduino Nano V3</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed mt-1.5">
                Samples MQ-135, MQ-6, and DHT22 only; sends Nano Frame via 1kΩ/2kΩ divider to ESP32 Master.
              </p>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-black/[0.06] text-[11px] font-mono">
              <div className="flex justify-between"><span className="text-[#6E6E73]">MQ-135 AO</span><strong className="text-[#1D1D1F]">A0</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">MQ-6 AO</span><strong className="text-[#1D1D1F]">A1</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">DHT22 DATA</span><strong className="text-[#1D1D1F]">D2</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">ESP32 UART (Divider)</span><strong className="text-emerald-700">D0 / D1</strong></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] space-y-4">
            <div>
              <span className="text-xs font-mono text-emerald-700 font-semibold">Node 02 · Fusion &amp; Safety Core</span>
              <h4 className="text-lg font-bold text-[#1D1D1F] mt-0.5">ESP32 DevKit V1 (Master)</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed mt-1.5">
                Fuses direct ZE07-CO + Nano Frame, runs hysteresis, renders 1.3&quot; ST7789 SPI IPS, reads 5x TTP223 keys, switches 5V siren via NPN/MOSFET, and outputs Unified 16-Byte Frame to CAM.
              </p>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-black/[0.06] text-[11px] font-mono">
              <div className="flex justify-between"><span className="text-[#6E6E73]">ST7789 SPI (SCK/MOSI/DC/RST/CS)</span><strong className="text-[#1D1D1F]">18/19/4/15/21</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">5x TTP223 Touch Array</span><strong className="text-cyan-700">34,35,36,39,14</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">Buzzer Driver Gate</span><strong className="text-rose-700">GPIO 13</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">CT1 / CT2 (Exp.)</span><strong className="text-[#1D1D1F]">GPIO 33 / 32</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">Nano RX / TX</span><strong className="text-[#1D1D1F]">GPIO 23 / 22</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">ZE07-CO RX / TX</span><strong className="text-emerald-700">GPIO 16 / 17</strong></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] space-y-4">
            <div>
              <span className="text-xs font-mono text-emerald-700 font-semibold">Node 03 · Gateway</span>
              <h4 className="text-lg font-bold text-[#1D1D1F] mt-0.5">ESP32-CAM Gateway (No Camera)</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed mt-1.5">
                Gateway &amp; local SD_MMC data logger. Camera powered off in Rev 2.8f to dedicate RAM &amp; I/O to logging.
              </p>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-black/[0.06] text-[11px] font-mono">
              <div className="flex justify-between"><span className="text-[#6E6E73]">Dev Master Link</span><strong className="text-[#1D1D1F]">Hardware Serial</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">MicroSD Bus</span><strong className="text-[#1D1D1F]">SD_MMC</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">Wi-Fi Radio</span><strong className="text-emerald-700">Internal RF</strong></div>
              <div className="flex justify-between"><span className="text-[#6E6E73]">OV2640 Camera</span><strong className="text-[#6E6E73]">Disabled (Rev 2.8f)</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: UART Packet Architecture (Explicit Dual-Link Clarification) */}
      {activeTab === 'packet' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] text-xs text-[#6E6E73] leading-relaxed space-y-1">
            <div className="font-mono font-bold text-[#1D1D1F]">
              Protocol Clarification · Which Controller Generates Which Link
            </div>
            <p>
              <strong className="text-[#1D1D1F]">1. Nano &rarr; ESP32 Master (GPIO 23/22):</strong> Carries only Arduino Nano readings (MQ-135 A0, MQ-6 A1, DHT22 D2). The Nano never connects to ZE07-CO.
            </p>
            <p>
              <strong className="text-[#1D1D1F]">2. ZE07-CO &rarr; ESP32 Master (GPIO 16/17):</strong> Direct 9600-baud UART CO stream into ESP32 Dev Master.
            </p>
            <p>
              <strong className="text-[#1D1D1F]">3. ESP32 Master &rarr; ESP32-CAM Gateway (Table Below):</strong> The ESP32 Master fuses both streams into the Unified 16-Byte Packet (`0x00–0x0F`, CRC-16-CCITT verified) forwarded to ESP32-CAM for SD_MMC &amp; cloud ingest.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F5F5F7] border-b border-black/[0.06] text-[#6E6E73] text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Offset</th>
                  <th className="py-3.5 px-4 font-semibold">Field</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Source &amp; Encoding Purpose (ESP32 Master &rarr; CAM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-[#1D1D1F]">
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x00–0x01</td><td className="py-3 px-4 font-bold">SYNC_HEADER</td><td className="py-3 px-4 text-[#6E6E73]">uint16_t</td><td className="py-3 px-4">Magic marker 0xAA55 generated by ESP32 Master</td></tr>
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x02–0x03</td><td className="py-3 px-4 font-bold">SEQUENCE_ID</td><td className="py-3 px-4 text-[#6E6E73]">uint16_t</td><td className="py-3 px-4">Monotonic packet counter for drop detection</td></tr>
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x04–0x05</td><td className="py-3 px-4 font-bold">RAW_MQ135_ADC</td><td className="py-3 px-4 text-[#6E6E73]">uint16_t</td><td className="py-3 px-4">Relayed from Nano A0 via GPIO 23/22</td></tr>
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x06–0x07</td><td className="py-3 px-4 font-bold">RAW_MQ6_ADC</td><td className="py-3 px-4 text-[#6E6E73]">uint16_t</td><td className="py-3 px-4">Relayed from Nano A1 via GPIO 23/22</td></tr>
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x08–0x09</td><td className="py-3 px-4 font-bold">ZE07_CO_PPM</td><td className="py-3 px-4 text-[#6E6E73]">uint16_t</td><td className="py-3 px-4">Inserted by ESP32 Master from UART2 (GPIO 16/17) scaled by 10</td></tr>
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x0A</td><td className="py-3 px-4 font-bold">TEMP_C</td><td className="py-3 px-4 text-[#6E6E73]">uint8_t</td><td className="py-3 px-4">Relayed from Nano DHT22 (D2)</td></tr>
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x0B</td><td className="py-3 px-4 font-bold">HUMIDITY_PCT</td><td className="py-3 px-4 text-[#6E6E73]">uint8_t</td><td className="py-3 px-4">Relayed from Nano DHT22 (D2)</td></tr>
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x0C</td><td className="py-3 px-4 font-bold">SENSOR_FLAGS</td><td className="py-3 px-4 text-[#6E6E73]">uint8_t</td><td className="py-3 px-4">Bitmask: CO_OK | MQ135_OK | MQ6_OK | DHT_OK | ALARM</td></tr>
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x0D–0x0E</td><td className="py-3 px-4 font-bold">CRC16_CCITT</td><td className="py-3 px-4 text-[#6E6E73]">uint16_t</td><td className="py-3 px-4">CRC-16-CCITT (0x1021 / 0xFFFF) over bytes 0x02–0x0C</td></tr>
                <tr><td className="py-3 px-4 font-semibold text-emerald-700">0x0F</td><td className="py-3 px-4 font-bold">PACKET_TAIL</td><td className="py-3 px-4 text-[#6E6E73]">uint8_t</td><td className="py-3 px-4">Delimiter 0x0D (&apos;\r&apos;) for packet verification</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Indian Competition Economics & BOM */}
      {activeTab === 'bom' && (
        <div className="space-y-6">
          {/* Complete Unit Economics Breakdown */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.05]">
              <div className="text-[11px] font-mono text-[#6E6E73]">Actual Electronics BOM</div>
              <div className="text-2xl font-bold font-mono text-[#1D1D1F] tabular-nums mt-1">
                ₹{ECONOMICS_SUMMARY.electronicsBomInr.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#86868B] mt-0.5">~${totalUsd.toFixed(2)} USD ref</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.05]">
              <div className="text-[11px] font-mono text-[#6E6E73]">Enclosure, PSU &amp; Harness</div>
              <div className="text-2xl font-bold font-mono text-[#1D1D1F] tabular-nums mt-1">
                ₹{ECONOMICS_SUMMARY.enclosureWiringPsuInr.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#86868B] mt-0.5">ABS case, PCB/wiring, 5V PSU</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.05]">
              <div className="text-[11px] font-mono text-[#6E6E73]">Actual Prototype Cost</div>
              <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums mt-1">
                ₹{ECONOMICS_SUMMARY.completePrototypeInr.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#86868B] mt-0.5">Single-unit build (Nov 2026)</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.05]">
              <div className="text-[11px] font-mono text-[#6E6E73]">Est. Batch / Target Retail</div>
              <div className="text-2xl font-bold font-mono text-[#1D1D1F] tabular-nums mt-1">
                ₹{ECONOMICS_SUMMARY.batchProductionTargetInr.toLocaleString('en-IN')} / ₹{ECONOMICS_SUMMARY.expectedRetailTargetInr.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#86868B] mt-0.5">{ECONOMICS_SUMMARY.priceDate}</div>
            </div>
          </div>

          {/* Transparent Batch & Retail Math Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] space-y-2">
              <div className="font-bold text-[#1D1D1F]">
                Batch Manufacturing Target Breakdown (₹{ECONOMICS_SUMMARY.batchProductionTargetInr.toLocaleString('en-IN')} / unit @ 100+)
              </div>
              {ECONOMICS_SUMMARY.batchBreakdown.map((b, i) => (
                <div key={i} className="flex justify-between text-[#6E6E73]">
                  <span className="font-sans">{b.item}</span>
                  <strong className="text-[#1D1D1F] tabular-nums">₹{b.costInr.toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.05] space-y-2">
              <div className="font-bold text-[#1D1D1F]">
                Target Retail Price Model Breakdown (₹{ECONOMICS_SUMMARY.expectedRetailTargetInr.toLocaleString('en-IN')} MSRP)
              </div>
              {ECONOMICS_SUMMARY.retailBreakdown.map((r, i) => (
                <div key={i} className="flex justify-between text-[#6E6E73]">
                  <span className="font-sans">{r.item}</span>
                  <strong className="text-[#1D1D1F] tabular-nums">₹{r.costInr.toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/[0.06]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F5F5F7] border-b border-black/[0.06] text-[#6E6E73] text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Component</th>
                  <th className="py-3.5 px-4 font-semibold">Part Number</th>
                  <th className="py-3.5 px-4 font-semibold">INR (₹)</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-[#1D1D1F]">
                {BILL_OF_MATERIALS.map((b, i) => (
                  <tr key={i} className="hover:bg-[#F5F5F7]/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#1D1D1F]">{b.component}</td>
                    <td className="py-3 px-4 text-[#6E6E73]">{b.partNumber}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700 tabular-nums whitespace-nowrap">
                      ₹{b.estimatedCostInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#6E6E73]">{b.status}</td>
                    <td className="py-3 px-4 font-sans text-[#6E6E73] text-xs">{b.purpose}</td>
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
