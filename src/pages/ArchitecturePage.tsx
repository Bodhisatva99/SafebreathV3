import React, { useState } from 'react';
import { PageTab } from '../types';
import { BILL_OF_MATERIALS, CONTROLLER_ARCHITECTURE_ROLES, HARDWARE_PINS } from '../data/hardwareData';
import { CircuitDiagramViewer } from '../components/CircuitDiagramViewer';
import { 
  Cpu, 
  Layers, 
  Activity, 
  HardDrive, 
  Wifi, 
  Check, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface ArchitecturePageProps {
  onSelectTab: (tab: PageTab) => void;
}

export const ArchitecturePage: React.FC<ArchitecturePageProps> = ({ onSelectTab }) => {
  const [selectedSubsystemFilter, setSelectedSubsystemFilter] = useState<string>('All');

  const totalCost = BILL_OF_MATERIALS.reduce((acc, item) => acc + item.estimatedCostUsd, 0);

  const filteredBom = selectedSubsystemFilter === 'All' 
    ? BILL_OF_MATERIALS 
    : BILL_OF_MATERIALS.filter(item => item.subsystem === selectedSubsystemFilter);

  return (
    <div className="space-y-20 py-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
          System Engineering & Physical Schematics
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Hardware Architecture & Subsystems
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          SafeBreath is constructed around modular, inexpensive embedded modules distributed into three distinct functional tiers: physical sensor acquisition, autonomous safety processing, and wireless storage gateway.
        </p>
      </div>

      {/* Layer 1: Sensor Array Spotlight */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded">
              <span>TIER 01</span>
              <span>·</span>
              <span>ATMOSPHERIC SENSOR LAYER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Multi-Gas & Environmental Sensor Array
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              SafeBreath integrates electrochemical, catalytic semiconductor, and digital thermistor technologies to form a comprehensive atmospheric perimeter. Each sensor is chosen for its specific affinity to life-threatening compounds.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">ZE07-CO</span>
                  <span className="text-emerald-400 text-[11px] font-mono">ELECTROCHEMICAL</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Dedicated carbon-monoxide sensing cell. Operates via chemical oxidation of CO on a catalytic working electrode. Provides linearized UART output (0–500 ppm) impervious to humidity fluctuations.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">MQ-135</span>
                  <span className="text-amber-400 text-[11px] font-mono">SnO2 SEMICONDUCTOR</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Broadband volatile organic compounds (VOC) detector. Sensitive to benzene, alcohol, smoke, ammonia, and CO2 derivatives with micro-ceramic heating coil.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">MQ-6</span>
                  <span className="text-rose-400 text-[11px] font-mono">CATALYTIC LPG</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  High-selectivity probe for Liquefied Petroleum Gas, propane, and butane. Low sensitivity to alcohol and smoke ensures minimal false-positive triggers for combustible gas leaks.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">DHT11</span>
                  <span className="text-indigo-400 text-[11px] font-mono">1-WIRE DIGITAL</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Calibrated temperature (0–50°C) and relative humidity (20–90% RH) digital probe used both for thermal runaway safety alarms and gas concentration compensation.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-6 shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-3 border-b border-slate-800">
                <span className="text-emerald-400 font-bold">SENSOR CLUSTER PROBE</span>
                <span>100Hz OVERSAMPLING</span>
              </div>
              
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">ZE07-CO</div>
                    <div className="text-[10px] text-slate-400">Electrochemical Fuel Cell</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 text-sky-400 border border-sky-800">UART RX/TX</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">MQ-135</div>
                    <div className="text-[10px] text-slate-400">SnO2 Catalytic Heating Coil</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">A0 Analog</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">MQ-6</div>
                    <div className="text-[10px] text-slate-400">Isobutane/LPG SnO2 Film</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800">A1 Analog</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">DHT11</div>
                    <div className="text-[10px] text-slate-400">NTC Thermistor + Polymer Cap</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-400 border border-rose-800">D7 Single-Wire</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black border border-slate-800 text-[11px] text-slate-400">
                ADC Resolution: 10-bit · Sample Averaging: 64 samples per telemetry burst
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layer 2: Dual Processing & Gateway Tier */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Distributed Computing</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Processing & Gateway Architecture</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Rather than overloading a single microcontroller with RF stacks, graphics, and microsecond ADC timing, responsibilities are cleanly decoupled.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CONTROLLER_ARCHITECTURE_ROLES.map((role, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                    CONTROLLER 0{idx + 1}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{role.frequency}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{role.controller}</h3>
                  <div className="text-xs text-slate-400 font-medium">{role.role}</div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Subsystem Tasks:</div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {role.responsibilities.map((task, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-[11px] font-mono text-amber-400/90 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Why Decoupled?</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  "{role.whySeparate}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controller Core Protocol Banner */}
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-6 sm:p-8 font-mono text-xs text-slate-300 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono text-emerald-400">HARDWARE INTERCONNECT</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Inter-Controller Bus Protocol</h3>
            </div>
            <span className="text-[11px] text-slate-500">16-BYTE UART PROTOCOL · 9600 BAUD</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            Standardized serial framing (9600 baud 8N1) links the Arduino Nano to ESP32 RX2, passing validated 16-byte telemetry packets with 8-bit checksums every 500 ms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">PACKET HEADER</span>
              <span className="text-emerald-400 font-bold">0xAA 0x55 (Sync Bytes)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">PAYLOAD SECTION</span>
              <span className="text-white font-bold">ADC[A0, A1], ZE07[PPM], DHT[T, RH]</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">CHECKSUM & TRAILER</span>
              <span className="text-sky-400 font-bold">CRC8-CCITT + 0x0D 0x0A</span>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Overview & Net Interconnect Summary */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Electrical Topography</div>
            <h2 className="text-2xl font-bold text-white mt-1">System Interconnect Overview</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">High-level schematic summary prior to wire-level CAD</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold">01 · POWER & GROUND RAILS</span>
            <h3 className="text-sm font-bold text-white">Regulated +5V & 3.3V Common Rail</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified 5.0V bus powers sensor heating elements (MQ-135, MQ-6), Arduino Nano Vin, and ESP32-CAM 5V pin. Shared common ground plane prevents ADC reference offset jitter.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <span className="text-xs font-mono text-sky-400 font-bold">02 · ANALOG & DIGITAL INPUTS</span>
            <h3 className="text-sm font-bold text-white">4 Dedicated Atmospheric Channels</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A0 (MQ-135 analog voltage), A1 (MQ-6 analog voltage), D2 (DHT11 1-wire data with 4.7 kΩ pull-up), and D3/D4 (ZE07-CO UART serial protocol at 9600 baud).
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <span className="text-xs font-mono text-amber-400 font-bold">03 · ACTUATION & GATEWAY</span>
            <h3 className="text-sm font-bold text-white">Zero-Latency Alarm & Cloud Bridge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pin D7 drives the 85dB active piezo buzzer directly in &lt;10ms; I2C (A4/A5) refreshes the SSD1306 OLED; Hardware TX streams framed packets to the ESP32-CAM gateway.
            </p>
          </div>
        </div>
      </section>

      {/* Official SafeBreath V3 Circuit Diagram & Schematic Visualizer */}
      <section className="space-y-4">
        <CircuitDiagramViewer />
      </section>

      {/* Interconnect & Pinout Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Official Rev 2.8f Pinout Specification</div>
            <h2 className="text-2xl font-bold text-white mt-1">Hardware Pin Routing & Interconnect Matrix</h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 w-fit">
            Validated Rev 2.8f Firmware
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 font-mono text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Board / Subsystem</th>
                <th className="py-3 px-4">Function</th>
                <th className="py-3 px-4">GPIO / Pin</th>
                <th className="py-3 px-4">Hardware Connection</th>
                <th className="py-3 px-4">Bus / Protocol</th>
                <th className="py-3 px-4">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {HARDWARE_PINS.map((pin, i) => (
                <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">{pin.board}</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{pin.function}</td>
                  <td className="py-3 px-4 font-bold text-amber-300 whitespace-nowrap bg-slate-900/50">{pin.pin}</td>
                  <td className="py-3 px-4 text-slate-200">{pin.connection}</td>
                  <td className="py-3 px-4 text-cyan-400 text-[11px]">{pin.bus}</td>
                  <td className="py-3 px-4 font-sans text-slate-400 text-xs">{pin.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bill of Materials (BOM) & Low Cost Breakdown */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Economic Feasibility</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Low-Cost Bill of Materials (BOM)
            </h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono">ESTIMATED PROTOTYPE BOM</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">${totalCost.toFixed(2)} USD</div>
          </div>
        </div>

        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Industrial multi-gas detectors typically cost between $650 and $1,500 USD and require proprietary docking stations. SafeBreath demonstrates that a fully connected, autonomous multi-gas safety system can be realized with widely available commercial-off-the-shelf (COTS) parts at an order of magnitude lower cost.
        </p>

        {/* Subsystem Filter */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg w-fit border border-slate-800">
          {['All', 'Sensors', 'Processing', 'Gateway & Display', 'Power & Passive'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedSubsystemFilter(filter)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                selectedSubsystemFilter === filter
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* BOM Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 font-mono text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Subsystem</th>
                <th className="py-3 px-4">Part / Reference</th>
                <th className="py-3 px-4">Unit Cost</th>
                <th className="py-3 px-4">Functional Role in SafeBreath</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredBom.map((item, i) => (
                <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{item.component}</td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.subsystem}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{item.partNumber}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400 tabular-nums">${item.estimatedCostUsd.toFixed(2)}</td>
                  <td className="py-3 px-4 font-sans text-slate-400 text-xs">{item.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Educational Note */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-white block">Future Production Consolidation</span>
            <p className="text-slate-400">
              While the prototype intentionally distributes responsibilities across 3 separate development boards to allow rapid modular testing and hardware isolation, a future commercial production revision could consolidate these subsystems onto a single customized 4-layer PCB with a single ESP32-S3 or dual-core STM32 processor.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
