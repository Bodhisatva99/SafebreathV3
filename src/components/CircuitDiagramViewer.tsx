import React, { useState } from 'react';
import {
  Zap,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

type WireNet = 'all' | 'power' | 'uart' | 'spi' | 'analog' | 'digital';

interface PinConnection {
  pin: string;
  label: string;
  targetComponent: string;
  targetPin: string;
  voltage: string;
  net: WireNet;
  note?: string;
}

interface CircuitComponent {
  id: string;
  name: string;
  type: string;
  voltage: string;
  role: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pins: PinConnection[];
}

export const CircuitDiagramViewer: React.FC = () => {
  const [activeNet, setActiveNet] = useState<WireNet>('all');
  const [selectedCompId, setSelectedCompId] = useState<string>('esp32');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Components based strictly on upgraded SafeBreath V3 Hardware Rev 2.8f Pinout
  const components: CircuitComponent[] = [
    {
      id: 'esp32',
      name: 'ESP32 DevKit V1 (Dev Master)',
      type: 'Central Safety, SPI Display & 5-Key Touch Master',
      voltage: '3.3V Logic / 5V VIN',
      role: 'Master safety controller: reads direct ZE07-CO UART (GPIO 16/17), receives Nano telemetry (GPIO 23/22), renders 1.3" ST7789 SPI IPS (GPIO 18/19/4/15/21), scans 5x TTP223 touch keys (GPIO 34/35/36/39/14), sounds alarm (GPIO 13), samples CT1/CT2 (GPIO 33/32), and bridges to CAM gateway.',
      x: 340,
      y: 170,
      width: 250,
      height: 330,
      pins: [
        { pin: 'GPIO 18 / 19', label: 'ST7789 SPI SCK / MOSI', targetComponent: 'st7789', targetPin: 'SCL / SDA', voltage: '3.3V SPI', net: 'spi', note: 'High-speed SPI bus driving 1.3" 240x240 IPS TFT' },
        { pin: 'GPIO 4 / 15 / 21', label: 'ST7789 DC / RST / CS', targetComponent: 'st7789', targetPin: 'DC / RES / CS', voltage: '3.3V SPI Ctrl', net: 'spi', note: 'Display register select, hardware reset & chip select' },
        { pin: 'GPIO 34, 35, 36, 39', label: 'TTP223 Keys 1–4', targetComponent: 'ttp223', targetPin: 'UP, DOWN, OK, MUTE', voltage: '3.3V Push-Pull', net: 'digital', note: 'Upgraded capacitive touch inputs on dedicated ESP32 input-only GPIOs' },
        { pin: 'GPIO 14', label: 'TTP223 Key 5', targetComponent: 'ttp223', targetPin: 'BACK / RESET', voltage: '3.3V Digital', net: 'digital', note: '5th capacitive touch key for menu back & threshold audit' },
        { pin: 'GPIO 13', label: 'Buzzer Driver Gate', targetComponent: 'buzzer', targetPin: 'NPN/MOSFET Stage', voltage: '3.3V Logic -> 5V Switch', net: 'digital', note: 'Drives low-side NPN/MOSFET switch powered from 5V rail (not direct GPIO drive)' },
        { pin: 'GPIO 33 / 32', label: 'CT1 / CT2 ADC (Exp.)', targetComponent: 'ct-sensors', targetPin: 'SCT-013-030 + 1.65V Bias', voltage: '0–3.3V Biased AC', net: 'analog', note: 'SCT-013-030 (30A/1V) has built-in burden; use 1.65V DC bias only (cloud schema pending)' },
        { pin: 'GPIO 23 / 22', label: 'Nano UART RX / TX', targetComponent: 'arduino-nano', targetPin: 'D1 (1k/2k Div) / D0', voltage: '3.3V UART', net: 'uart', note: 'Receives 5V->3.3V divider-shifted Nano Frame (MQ-135, MQ-6, DHT22)' },
        { pin: 'GPIO 16 / 17', label: 'ZE07-CO UART2 RX / TX', targetComponent: 'ze07-co', targetPin: 'TXD / RXD', voltage: '3.3V UART', net: 'uart', note: 'Direct electrochemical CO UART frames (T90 <= 60s)' },
        { pin: 'UART Bridge', label: 'Gateway Serial', targetComponent: 'esp32-cam', targetPin: 'Dev UART', voltage: '3.3V UART', net: 'uart', note: 'Carries Unified 16-Byte Master-to-Gateway Frame (avoid USB UART0 overlap in prod PCB)' },
        { pin: 'VIN / GND', label: 'Power & Common Ground', targetComponent: 'power-rail', targetPin: '5V / GND BUS', voltage: '+5.0V / 0V', net: 'power' }
      ]
    },
    {
      id: 'arduino-nano',
      name: 'Arduino Nano (ATmega328P)',
      type: 'Dedicated Sensor Acquisition MCU',
      voltage: '5V DC Logic',
      role: 'Continuous analog sampling of MQ-135 (A0) and MQ-6 (A1), single-wire DHT22 (D2) decode, and Nano Sensor Frame UART streaming via 1kΩ/2kΩ divider to ESP32 master.',
      x: 40,
      y: 190,
      width: 220,
      height: 270,
      pins: [
        { pin: 'A0', label: 'ADC0 Analog In', targetComponent: 'mq-135', targetPin: 'AO', voltage: '0-5V Analog', net: 'analog', note: 'MQ-135 broad-response VOC indicator' },
        { pin: 'A1', label: 'ADC1 Analog In', targetComponent: 'mq-6', targetPin: 'AO', voltage: '0-5V Analog', net: 'analog', note: 'MQ-6 LPG/propane analog voltage' },
        { pin: 'D2', label: 'Proprietary Single-Wire', targetComponent: 'dht22', targetPin: 'DATA', voltage: '5V Digital', net: 'digital', note: 'Proprietary single-wire DHT22 bus (not Dallas 1-Wire) with 4.7kΩ pull-up' },
        { pin: 'TX (D1)', label: 'Hardware UART TX', targetComponent: 'esp32', targetPin: 'GPIO 23 via 1k/2k Divider', voltage: '5V -> 3.33V Divider', net: 'uart', note: 'Routed through explicit 1kΩ/2kΩ voltage divider to protect ESP32 GPIO 23' },
        { pin: 'RX (D0)', label: 'Hardware UART RX', targetComponent: 'esp32', targetPin: 'GPIO 22', voltage: '3.3V Logic HIGH', net: 'uart', note: 'Receives heartbeat synchronization from ESP32' },
        { pin: '5V', label: 'Power Rail', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5.0V Regulated', net: 'power' },
        { pin: 'GND', label: 'Common GND', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V Reference', net: 'power' }
      ]
    },
    {
      id: 'esp32-cam',
      name: 'ESP32-CAM Gateway (No Camera)',
      type: 'Gateway & Local Logger — Camera Disabled in Rev 2.8f',
      voltage: '5V Supply',
      role: 'Receives Unified 16-Byte Master Frame from ESP32 Dev Master via Hardware Serial. Manages circular FAT32 logging via SD_MMC and Wi-Fi sync to Supabase. OV2640 camera disabled in Rev 2.8f.',
      x: 650,
      y: 205,
      width: 215,
      height: 155,
      pins: [
        { pin: 'Dev UART', label: 'Hardware Serial', targetComponent: 'esp32', targetPin: 'Gateway Serial', voltage: '3.3V UART', net: 'uart', note: 'Dedicated UART avoids USB UART0 programming conflict' },
        { pin: 'SD_MMC', label: 'MicroSD Bus', targetComponent: 'internal', targetPin: 'MicroSD Slot', voltage: '3.3V SD Bus', net: 'spi', note: '4-bit SD_MMC circular CSV local logging' },
        { pin: 'Wi-Fi', label: '802.11 b/g/n RF', targetComponent: 'cloud', targetPin: 'Supabase Realtime', voltage: 'Internal RF', net: 'digital', note: 'Cloud database synchronization' },
        { pin: 'Camera', label: 'OV2640 Interface', targetComponent: 'internal', targetPin: 'Disabled', voltage: 'N/A', net: 'digital', note: 'Powered off in Rev 2.8f firmware to protect heap/SD reliability' },
        { pin: '5V / GND', label: 'Power Input', targetComponent: 'power-rail', targetPin: '5V / GND BUS', voltage: '+5V / 0V', net: 'power' }
      ]
    },
    {
      id: 'ttp223',
      name: '5x TTP223 Capacitive Touch Keys',
      type: 'Upgraded 5-Key Operator HMI (From 2 Keys)',
      voltage: '3.3V Push-Pull CMOS',
      role: 'Five capacitive touch modules (UP, DOWN, MENU/OK, MUTE, BACK) powered at 3.3V so HIGH signals interface cleanly to ESP32 GPIOs 34, 35, 36, 39, and 14.',
      x: 650,
      y: 380,
      width: 215,
      height: 120,
      pins: [
        { pin: 'KEY 1 (UP)', label: 'Menu Navigation Up', targetComponent: 'esp32', targetPin: 'GPIO 34', voltage: '3.3V Active HIGH', net: 'digital' },
        { pin: 'KEY 2 (DOWN)', label: 'Menu Navigation Down', targetComponent: 'esp32', targetPin: 'GPIO 35', voltage: '3.3V Active HIGH', net: 'digital' },
        { pin: 'KEY 3 (MENU/OK)', label: 'Select / Threshold View', targetComponent: 'esp32', targetPin: 'GPIO 36 (VP)', voltage: '3.3V Active HIGH', net: 'digital' },
        { pin: 'KEY 4 (MUTE)', label: 'Silence / Acknowledge Siren', targetComponent: 'esp32', targetPin: 'GPIO 39 (VN)', voltage: '3.3V Active HIGH', net: 'digital' },
        { pin: 'KEY 5 (BACK)', label: 'Return / Exit Screen', targetComponent: 'esp32', targetPin: 'GPIO 14', voltage: '3.3V Active HIGH', net: 'digital' }
      ]
    },
    {
      id: 'ze07-co',
      name: 'Winsen ZE07-CO Electrochemical Sensor',
      type: 'Atmospheric Carbon Monoxide Cell',
      voltage: '5V–12V DC (5V Reg)',
      role: 'Electrochemical fuel cell (0–500 ppm, 0.1 ppm res, T90 <= 60 s, warm-up <= 3 min). Direct UART link to ESP32 Dev Master (GPIO 16/17).',
      x: 340,
      y: 40,
      width: 250,
      height: 105,
      pins: [
        { pin: 'TXD (Pin 4)', label: 'Serial TX (to ESP32 GPIO 16)', targetComponent: 'esp32', targetPin: 'GPIO 16', voltage: '3.3V UART', net: 'uart' },
        { pin: 'RXD (Pin 5)', label: 'Serial RX (from ESP32 GPIO 17)', targetComponent: 'esp32', targetPin: 'GPIO 17', voltage: '3.3V UART', net: 'uart' },
        { pin: 'VIN (Pin 1)', label: 'Power VCC', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '5V', net: 'power' },
        { pin: 'GND (Pin 2)', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'mq-135',
      name: 'MQ-135 VOC & Air Quality Sensor',
      type: 'SnO2 Semiconductor Gas Probe',
      voltage: '5V Heater & Circuit',
      role: 'Broadband volatile organic compound sensor sensitive to benzene, alcohol, smoke, and ammonia.',
      x: 40,
      y: 50,
      width: 220,
      height: 105,
      pins: [
        { pin: 'AO', label: 'Analog Output', targetComponent: 'arduino-nano', targetPin: 'A0', voltage: '0.1V - 4.8V', net: 'analog' },
        { pin: 'VCC', label: 'Heater +5V', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V @ 150mA', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'mq-6',
      name: 'MQ-6 LPG & Propane Sensor',
      type: 'Catalytic Combustible Gas Probe',
      voltage: '5V Heater & Circuit',
      role: 'Highly selective catalytic sensor for liquefied petroleum gas (LPG), propane, and butane.',
      x: 40,
      y: 490,
      width: 220,
      height: 105,
      pins: [
        { pin: 'AO', label: 'Analog Output', targetComponent: 'arduino-nano', targetPin: 'A1', voltage: '0.1V - 4.9V', net: 'analog' },
        { pin: 'VCC', label: 'Heater +5V', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V @ 160mA', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'dht22',
      name: 'DHT22 (AM2302) Climate Probe',
      type: 'Capacitive RH & Precision NTC Sensor',
      voltage: '3.3V - 5.5V',
      role: 'Precision ambient temperature (-40 to +80 °C ±0.5 °C) and relative humidity (0–100 % RH ±2 %) over proprietary single-wire protocol (upgraded from DHT11).',
      x: 40,
      y: 610,
      width: 220,
      height: 105,
      pins: [
        { pin: 'DATA', label: 'Proprietary Single-Wire', targetComponent: 'arduino-nano', targetPin: 'D2', voltage: '5V Digital', net: 'digital', note: '4.7kΩ pull-up to 5V; not Dallas 1-Wire (0.5 Hz sample rate)' },
        { pin: 'VCC', label: 'Power', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'ct-sensors',
      name: 'Dual SCT-013-030 (Experimental)',
      type: 'Voltage-Output CTs (Internal Burden) + 1.65V Bias',
      voltage: '0–3.3V Biased AC Signal',
      role: 'Experimental load sensing (CT1 GPIO 33, CT2 GPIO 32). SCT-013-030 (30A/1Vrms) already includes an internal sampling resistor—do NOT add an external burden; only 1.65V DC bias conditioning is required.',
      x: 340,
      y: 530,
      width: 250,
      height: 105,
      pins: [
        { pin: 'CT1', label: 'SCT-013-030 + 1.65V Bias', targetComponent: 'esp32', targetPin: 'GPIO 33', voltage: '0-3.3V Analog', net: 'analog', note: 'Built-in burden; external 1.65V divider bias only (cloud schema pending)' },
        { pin: 'CT2', label: 'SCT-013-030 + 1.65V Bias', targetComponent: 'esp32', targetPin: 'GPIO 32', voltage: '0-3.3V Analog', net: 'analog', note: 'Built-in burden; external 1.65V divider bias only (cloud schema pending)' },
        { pin: 'GND', label: 'Ground Reference', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'st7789',
      name: '1.3" ST7789 IPS Color Display',
      type: '240x240 SPI TFT Telemetry Screen',
      voltage: '3.3V Logic & Backlight',
      role: 'Full-color 240x240 IPS TFT replacing the 0.96" OLED, connected via ESP32 SPI (SCK 18, MOSI 19, DC 4, RST 15, CS 21).',
      x: 650,
      y: 40,
      width: 215,
      height: 135,
      pins: [
        { pin: 'SCL / SDA', label: 'SPI SCK / MOSI', targetComponent: 'esp32', targetPin: 'GPIO 18 / 19', voltage: '3.3V SPI', net: 'spi', note: 'High-speed SPI clock & data' },
        { pin: 'DC / RES / CS', label: 'Display Control', targetComponent: 'esp32', targetPin: 'GPIO 4 / 15 / 21', voltage: '3.3V SPI Ctrl', net: 'spi', note: 'Command/Data, Reset & Chip Select' },
        { pin: 'VCC / BLK', label: '3.3V Supply & Backlight', targetComponent: 'power-rail', targetPin: '3.3V BUS', voltage: '+3.3V', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'buzzer',
      name: '5V Active Piezo + Driver Stage',
      type: 'TMB12A05 + NPN/MOSFET Low-Side Driver',
      voltage: '5V Supply (3.3V Gate)',
      role: 'Audible emergency alarm (85 dB @ 10 cm datasheet rating). Powered from 5V rail and switched via NPN/MOSFET driver controlled by ESP32 GPIO 13.',
      x: 650,
      y: 525,
      width: 215,
      height: 110,
      pins: [
        { pin: '(+)', label: '5V Switched via NPN', targetComponent: 'esp32', targetPin: 'GPIO 13 -> Driver', voltage: '5V Switched', net: 'digital', note: 'Transistor driver isolates 5V buzzer current from GPIO 13' },
        { pin: '(-)', label: 'Driver Drain / GND', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    }
  ];

  const selectedComp = components.find(c => c.id === selectedCompId) || components[0];

  const getNetBadge = (net: WireNet) => {
    switch (net) {
      case 'power': return 'bg-red-50 text-red-700 border-red-200';
      case 'uart': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'spi': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'analog': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'digital': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(0.7, prev + delta), 1.6));
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#090d16] text-white p-6 overflow-y-auto' : ''}`}>
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono font-semibold text-emerald-800 uppercase tracking-wider">
            SAFEBREATH V3 CAD SCHEMATIC · REV 2.8F
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Circuit Diagram &amp; Pin Routing Matrix
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Physical wiring featuring DHT22 climate probe, 1.3&quot; ST7789 SPI display, 5x TTP223 touch array, dual CT inputs, and SD_MMC logging.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs text-slate-700">
            <button
              type="button"
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 hover:bg-white rounded transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-semibold tabular-nums">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => handleZoom(0.15)}
              className="p-1.5 hover:bg-white rounded transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:bg-white rounded transition-colors border-l border-slate-200 ml-1 cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen Schematic'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full Canvas'}</span>
          </button>
        </div>
      </div>

      {/* Layer Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        <span className="text-[11px] font-mono text-slate-500 uppercase px-2 font-semibold">Trace Net:</span>
        {[
          { id: 'all', label: 'All Interconnects', color: 'bg-slate-900 text-white' },
          { id: 'power', label: '5V / 3.3V Power & GND', color: 'bg-red-600 text-white' },
          { id: 'analog', label: 'Analog ADC (A0, A1, CT1/2)', color: 'bg-emerald-600 text-white' },
          { id: 'uart', label: 'UART Serial (Nano ↔ ESP32 ↔ CAM)', color: 'bg-amber-600 text-white' },
          { id: 'spi', label: 'SPI (ST7789 IPS) & SD_MMC', color: 'bg-purple-700 text-white' },
          { id: 'digital', label: 'Digital (DHT22 D2, 5x Touch, Buzzer GPIO 13)', color: 'bg-blue-600 text-white' }
        ].map((net) => (
          <button
            key={net.id}
            onClick={() => setActiveNet(net.id as WireNet)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeNet === net.id
                ? `${net.color} shadow-sm font-semibold`
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {net.label}
          </button>
        ))}
      </div>

      {/* Main Schematic CAD Surface & Pin Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left: Vector CAD Circuit Schematic Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-[#070b14] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl relative overflow-hidden">

          {/* Schematic Title Block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pb-3 mb-3 border-b border-slate-800 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white font-bold tracking-wider">DWG: SAFEBREATH-V3-SCH-REV2.8F</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="lg:hidden text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                ← Swipe / Drag Schematic →
              </span>
              <span className="hidden lg:inline text-slate-500">
                CLICK COMPONENT TO INSPECT PINOUT
              </span>
            </div>
          </div>

          {/* Scalable SVG Schematic Layout */}
          <div className="overflow-x-auto pb-2">
            <div
              className="min-w-[900px] h-[740px] relative transition-transform origin-top-left"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
            >
              <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 900 740">
                <defs>
                  {/* Subtle Grid Background */}
                  <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#cad-grid)" />

                {/* 1. MQ-135 AO to Arduino Nano A0 */}
                {(activeNet === 'all' || activeNet === 'analog') && (
                  <g className="transition-opacity">
                    <path d="M 150 155 L 150 190" fill="none" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="150" cy="172" r="3" fill="#10b981" />
                    <text x="156" y="176" fill="#10b981" fontSize="10" fontFamily="monospace">AO → Nano A0</text>
                  </g>
                )}

                {/* 2. MQ-6 AO to Arduino Nano A1 */}
                {(activeNet === 'all' || activeNet === 'analog') && (
                  <g className="transition-opacity">
                    <path d="M 150 490 L 150 460" fill="none" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="150" cy="475" r="3" fill="#10b981" />
                    <text x="156" y="479" fill="#10b981" fontSize="10" fontFamily="monospace">AO → Nano A1</text>
                  </g>
                )}

                {/* 3. DHT22 Data to Arduino Nano D2 */}
                {(activeNet === 'all' || activeNet === 'digital') && (
                  <g className="transition-opacity">
                    <path d="M 80 610 L 80 460" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="80" cy="535" r="3" fill="#3b82f6" />
                    <text x="86" y="540" fill="#3b82f6" fontSize="10" fontFamily="monospace">DHT22 DATA → D2</text>
                  </g>
                )}

                {/* 4. ZE07-CO UART Direct to ESP32 Dev Master (GPIO 16 RX / GPIO 17 TX) */}
                {(activeNet === 'all' || activeNet === 'uart') && (
                  <g className="transition-opacity">
                    <path d="M 420 145 L 420 170" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <text x="360" y="160" fill="#f59e0b" fontSize="10" fontFamily="monospace">TX → GPIO 16</text>
                    <path d="M 500 145 L 500 170" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                    <text x="506" y="160" fill="#f59e0b" fontSize="10" fontFamily="monospace">RX ← GPIO 17</text>
                  </g>
                )}

                {/* 5. Nano Hardware Serial (D0/D1) via Explicit 1kΩ/2kΩ Divider to ESP32 GPIO 23/22 */}
                {(activeNet === 'all' || activeNet === 'uart') && (
                  <g className="transition-opacity">
                    <path d="M 260 280 L 340 280" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <rect x="278" y="269" width="44" height="20" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="300" y="282" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">1k/2k DIV</text>
                    <text x="266" y="262" fill="#f59e0b" fontSize="9" fontFamily="monospace">TX(D1) → GPIO 23</text>

                    <path d="M 340 320 L 260 320" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="300" cy="320" r="3" fill="#f59e0b" />
                    <text x="266" y="335" fill="#f59e0b" fontSize="9" fontFamily="monospace">RX(D0) ← GPIO 22</text>
                  </g>
                )}

                {/* 6. ESP32 SPI Display Bus -> 1.3" ST7789 IPS (SCK 18, MOSI 19, DC 4, RST 15, CS 21) */}
                {(activeNet === 'all' || activeNet === 'spi') && (
                  <g className="transition-opacity">
                    <path d="M 590 205 L 618 205 L 618 90 L 650 90" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                    <text x="595" y="142" fill="#c084fc" fontSize="9" fontFamily="monospace">SPI: 18/19 (SCK/MOSI)</text>
                    <path d="M 590 222 L 632 222 L 632 115 L 650 115" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3 2" />
                    <text x="595" y="158" fill="#c084fc" fontSize="9" fontFamily="monospace">Ctrl: 4/15/21</text>
                  </g>
                )}

                {/* 7. 5x TTP223 Touch Array -> ESP32 GPIO 34, 35, 36, 39, 14 */}
                {(activeNet === 'all' || activeNet === 'digital') && (
                  <g className="transition-opacity">
                    <path d="M 650 420 L 590 420" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle cx="620" cy="420" r="3" fill="#38bdf8" />
                    <text x="592" y="410" fill="#38bdf8" fontSize="8.5" fontFamily="monospace">5x Touch: 34,35,36,39,14</text>
                  </g>
                )}

                {/* 8. ESP32 Buzzer Driver Stage (GPIO 13 -> NPN/MOSFET -> 5V Buzzer) */}
                {(activeNet === 'all' || activeNet === 'digital') && (
                  <g className="transition-opacity">
                    <path d="M 590 475 L 620 475 L 620 570 L 650 570" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                    <rect x="594" y="512" width="52" height="18" rx="4" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="620" y="524" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="monospace" fontWeight="bold">NPN/FET</text>
                    <text x="592" y="468" fill="#ef4444" fontSize="9" fontFamily="monospace">GPIO 13 → 5V</text>
                  </g>
                )}

                {/* 9. Experimental Conditioned Dual CT Inputs (GPIO 33 CT1 / GPIO 32 CT2 + Bias Network) */}
                {(activeNet === 'all' || activeNet === 'analog') && (
                  <g className="transition-opacity">
                    <path d="M 430 500 L 430 530" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 2" />
                    <text x="362" y="518" fill="#10b981" fontSize="9" fontFamily="monospace">CT1+Bias → GPIO33</text>
                    <path d="M 500 500 L 500 530" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 2" />
                    <text x="506" y="518" fill="#10b981" fontSize="9" fontFamily="monospace">CT2+Bias → GPIO32</text>
                  </g>
                )}

                {/* 10. ESP32 Master to ESP32-CAM Gateway Serial Bridge */}
                {(activeNet === 'all' || activeNet === 'uart') && (
                  <g className="transition-opacity">
                    <path d="M 590 290 L 650 290" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="620" cy="290" r="3.5" fill="#f59e0b" />
                    <text x="592" y="281" fill="#f59e0b" fontSize="9" fontFamily="monospace">Hardware Serial Bridge</text>
                  </g>
                )}

                {/* Power Rails (Top and Bottom Bus) */}
                {(activeNet === 'all' || activeNet === 'power') && (
                  <g className="transition-opacity">
                    <line x1="20" y1="20" x2="880" y2="20" stroke="#ef4444" strokeWidth="3" />
                    <text x="30" y="16" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">+5.0V / +3.3V POWER DISTRIBUTION BUS</text>

                    <line x1="20" y1="720" x2="880" y2="720" stroke="#475569" strokeWidth="3" strokeDasharray="6 3" />
                    <text x="30" y="714" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">COMMON GND GROUND PLANE (0V)</text>
                  </g>
                )}
              </svg>

              {/* Interactive Component Blocks (HTML clickable layers) */}
              {components.map((comp) => {
                const isSelected = comp.id === selectedCompId;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    style={{
                      left: `${comp.x}px`,
                      top: `${comp.y}px`,
                      width: `${comp.width}px`,
                      height: `${comp.height}px`
                    }}
                    className={`absolute p-3 rounded-xl border text-left flex flex-col justify-between transition-all group backdrop-blur-md ${
                      isSelected
                        ? 'bg-slate-900/95 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-950/50'
                        : 'bg-slate-950/85 border-slate-700/80 hover:border-slate-500 hover:bg-slate-900/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-emerald-400 tracking-wide">
                          {comp.id.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {comp.voltage}
                        </span>
                      </div>
                      <div className="text-white font-bold text-xs group-hover:text-emerald-300 transition-colors">
                        {comp.name}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                        {comp.type}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{comp.pins.length} Connections</span>
                      <span className="text-emerald-400 group-hover:underline">Inspect →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schematic Legend */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> +5V / +3.3V DC</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> UART Serial</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Analog ADC</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> SPI (ST7789) / SD_MMC</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Digital (5x Touch / DHT22)</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              SafeBreath Hardware Rev 2.8f
            </div>
          </div>
        </div>

        {/* Right: Component Pinout & Electrical Characteristics Inspector (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-emerald-700 uppercase font-semibold">COMPONENT PINOUT</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {selectedComp.voltage}
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">{selectedComp.name}</h4>
            <div className="text-xs text-slate-500 font-medium">{selectedComp.type}</div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {selectedComp.role}
          </div>

          {/* Pin Connections Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Pin / Terminal</span>
              <span>Net & Target</span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {selectedComp.pins.map((pin, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{pin.pin}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getNetBadge(pin.net)}`}>
                      {pin.net.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{pin.label}</span>
                    <span className="font-mono text-emerald-800">{pin.voltage}</span>
                  </div>
                  {pin.targetComponent && pin.targetComponent !== 'power-rail' && pin.targetComponent !== 'internal' && (
                    <div className="text-[10px] font-mono text-slate-600 pt-0.5">
                      → Connects to: <strong className="text-slate-800">{pin.targetComponent}</strong> ({pin.targetPin})
                    </div>
                  )}
                  {pin.note && (
                    <div className="text-[10px] text-amber-800 bg-amber-50/70 px-2 py-0.5 rounded border border-amber-200/70">
                      {pin.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Note on Inter-Board Logic Levels */}
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <Zap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>5V / 3.3V Logic Protection</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Arduino Nano outputs 5V TTL, routed through a 1kΩ / 2kΩ divider into ESP32 GPIO 23. Both the 1.3&quot; ST7789 SPI TFT and 5x TTP223 capacitive keys run directly at 3.3V logic.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
