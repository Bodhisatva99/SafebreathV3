import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Activity, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  CheckCircle2, 
  Volume2, 
  Monitor, 
  HardDrive, 
  Wifi, 
  Camera, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

type WireNet = 'all' | 'power' | 'uart' | 'i2c' | 'spi' | 'analog' | 'digital';

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
  const [selectedCompId, setSelectedCompId] = useState<string>('arduino-nano');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Components based strictly on SafeBreath V3 Circuit Diagram
  const components: CircuitComponent[] = [
    {
      id: 'arduino-nano',
      name: 'Arduino Nano (ATmega328P)',
      type: 'Core Sensor & Alarm Microcontroller',
      voltage: '5V DC Logic',
      role: 'Dedicated primary sensor acquisition MCU, executes 10-bit analog conversion, local alarm buzzer latching, and SSD1306 OLED updates.',
      x: 320,
      y: 190,
      width: 220,
      height: 290,
      pins: [
        { pin: 'A0', label: 'ADC0 Analog In', targetComponent: 'mq-135', targetPin: 'AO', voltage: '0-5V Analog', net: 'analog', note: 'Air quality / VOC analog voltage' },
        { pin: 'A1', label: 'ADC1 Analog In', targetComponent: 'mq-6', targetPin: 'AO', voltage: '0-5V Analog', net: 'analog', note: 'LPG / combustible gas analog voltage' },
        { pin: 'D2', label: 'Digital GPIO', targetComponent: 'dht11', targetPin: 'DATA', voltage: '5V Digital', net: 'digital', note: '1-Wire DHT11 temperature/humidity with pull-up' },
        { pin: 'D3', label: 'Software RX', targetComponent: 'ze07-co', targetPin: 'TXD', voltage: '3.3V-5V UART', net: 'uart', note: 'Linear UART CO data packet 9600 baud' },
        { pin: 'D4', label: 'Software TX', targetComponent: 'ze07-co', targetPin: 'RXD', voltage: '3.3V-5V UART', net: 'uart', note: 'Sensor command & query mode' },
        { pin: 'D7', label: 'PWM Alarm Out', targetComponent: 'buzzer', targetPin: '(+)', voltage: '5V Active', net: 'digital', note: 'Direct hardwired emergency piezoelectric siren' },
        { pin: 'D9', label: 'SPI CS', targetComponent: 'microsd', targetPin: 'CS', voltage: '5V SPI', net: 'spi', note: 'MicroSD SPI chip select' },
        { pin: 'D11', label: 'SPI MOSI', targetComponent: 'microsd', targetPin: 'MOSI', voltage: '5V SPI', net: 'spi', note: 'Master Out Slave In' },
        { pin: 'D12', label: 'SPI MISO', targetComponent: 'microsd', targetPin: 'MISO', voltage: '5V SPI', net: 'spi', note: 'Master In Slave Out' },
        { pin: 'D13', label: 'SPI SCK', targetComponent: 'microsd', targetPin: 'SCK', voltage: '5V SPI', net: 'spi', note: 'SPI Clock line' },
        { pin: 'A4', label: 'I2C SDA', targetComponent: 'oled', targetPin: 'SDA', voltage: '5V/3.3V I2C', net: 'i2c', note: 'SSD1306 Display serial data' },
        { pin: 'A5', label: 'I2C SCL', targetComponent: 'oled', targetPin: 'SCL', voltage: '5V/3.3V I2C', net: 'i2c', note: 'SSD1306 Display serial clock' },
        { pin: 'TX (D1)', label: 'Hardware UART TX', targetComponent: 'esp32', targetPin: 'RX2 (GPIO16)', voltage: '5V -> 3.3V (Divider)', net: 'uart', note: 'Validated 16-byte packet to ESP32 through 1kΩ/2kΩ divider' },
        { pin: 'RX (D0)', label: 'Hardware UART RX', targetComponent: 'esp32', targetPin: 'TX2 (GPIO17)', voltage: '3.3V Logic HIGH', net: 'uart', note: 'ESP32 health handshake & sync' },
        { pin: '5V', label: 'Power Rail', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5.0V Regulated', net: 'power' },
        { pin: 'GND', label: 'Common GND', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V Reference', net: 'power' },
      ]
    },
    {
      id: 'esp32',
      name: 'ESP32 DevKit (ESP-WROOM-32)',
      type: 'Dual-Core IoT Gateway & Cloud Node',
      voltage: '3.3V Logic / 5V VIN',
      role: 'Receives validated telemetry from Arduino Nano, runs TLS cryptographic stack, transmits real-time telemetry to Supabase, and dispatches FCM notifications.',
      x: 630,
      y: 190,
      width: 220,
      height: 250,
      pins: [
        { pin: 'GPIO16 (RX2)', label: 'UART2 RX', targetComponent: 'arduino-nano', targetPin: 'TX (D1)', voltage: '3.3V Safe', net: 'uart', note: 'Fed via resistive divider R1=1kΩ, R2=2kΩ' },
        { pin: 'GPIO17 (TX2)', label: 'UART2 TX', targetComponent: 'arduino-nano', targetPin: 'RX (D0)', voltage: '3.3V', net: 'uart', note: 'Bidirectional heartbeat sync' },
        { pin: 'GPIO4 / 2', label: 'Sync / Cam Trigger', targetComponent: 'esp32-cam', targetPin: 'Trigger GPIO', voltage: '3.3V', net: 'digital', note: 'Triggers visual snapshot during hazard alert' },
        { pin: 'VIN (5V)', label: '5V Power In', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V', net: 'power' },
        { pin: '3.3V OUT', label: 'Regulated 3.3V', targetComponent: 'power-rail', targetPin: '3.3V BUS', voltage: '+3.3V', net: 'power', note: 'On-board AMS1117 LDO output' },
        { pin: 'GND', label: 'Common GND', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V Reference', net: 'power' },
        { pin: 'Wi-Fi RF', label: '802.11 b/g/n Antenna', targetComponent: 'cloud', targetPin: 'Supabase REST / Realtime', voltage: '2.4GHz RF', net: 'digital', note: 'Encrypted HTTPS / WSS communication' }
      ]
    },
    {
      id: 'esp32-cam',
      name: 'ESP32-CAM (OV2640 Module)',
      type: 'Optical Verification Subsystem',
      voltage: '5V Supply',
      role: 'Captures visual verification snapshots when gas thresholds cross warning/danger levels for remote operator assessment.',
      x: 630,
      y: 480,
      width: 220,
      height: 140,
      pins: [
        { pin: '5V', label: 'Power Input', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V', net: 'power' },
        { pin: 'GND', label: 'Common GND', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' },
        { pin: 'IO4 (Flash)', label: 'High-Brightness LED', targetComponent: 'internal', targetPin: 'LED', voltage: '3.3V PWM', net: 'digital' },
        { pin: 'U0R / U0T', label: 'Serial Interconnect', targetComponent: 'esp32', targetPin: 'GPIO Interconnect', voltage: '3.3V', net: 'uart' }
      ]
    },
    {
      id: 'ze07-co',
      name: 'ZE07-CO Electrochemical Sensor',
      type: 'Atmospheric Carbon Monoxide Cell',
      voltage: '3.7V - 5.5V Supply',
      role: 'Electrochemical fuel cell selectively oxidized by CO molecules. Provides 0–500 ppm readings via linearized digital UART.',
      x: 40,
      y: 50,
      width: 190,
      height: 120,
      pins: [
        { pin: 'VIN (Pin 1)', label: 'Power VCC', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '5V', net: 'power' },
        { pin: 'GND (Pin 2)', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' },
        { pin: 'TXD (Pin 4)', label: 'Serial TX (to Nano D3)', targetComponent: 'arduino-nano', targetPin: 'D3', voltage: '3.3V UART', net: 'uart' },
        { pin: 'RXD (Pin 5)', label: 'Serial RX (to Nano D4)', targetComponent: 'arduino-nano', targetPin: 'D4', voltage: '3.3V UART', net: 'uart' }
      ]
    },
    {
      id: 'mq-135',
      name: 'MQ-135 VOC & Air Quality Sensor',
      type: 'SnO2 Semiconductor Gas Probe',
      voltage: '5V Heater & Circuit',
      role: 'Broadband volatile organic compound sensor sensitive to benzene, alcohol, smoke, ammonia, and CO2 derivatives.',
      x: 40,
      y: 195,
      width: 190,
      height: 110,
      pins: [
        { pin: 'VCC', label: 'Heater +5V', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V @ 150mA', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' },
        { pin: 'AO', label: 'Analog Output', targetComponent: 'arduino-nano', targetPin: 'A0', voltage: '0.1V - 4.8V', net: 'analog' }
      ]
    },
    {
      id: 'mq-6',
      name: 'MQ-6 LPG & Propane Sensor',
      type: 'Catalytic Combustible Gas Probe',
      voltage: '5V Heater & Circuit',
      role: 'Highly selective catalytic sensor for liquefied petroleum gas (LPG), propane, and butane with minimal cross-sensitivity to alcohol.',
      x: 40,
      y: 330,
      width: 190,
      height: 110,
      pins: [
        { pin: 'VCC', label: 'Heater +5V', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V @ 160mA', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' },
        { pin: 'AO', label: 'Analog Output', targetComponent: 'arduino-nano', targetPin: 'A1', voltage: '0.1V - 4.9V', net: 'analog' }
      ]
    },
    {
      id: 'dht11',
      name: 'DHT11 Temp & Humidity',
      type: 'Digital Thermistor & Capacitive Probe',
      voltage: '3.3V - 5.5V',
      role: 'Measures environmental temperature and relative humidity for thermal safety runaway alarms and gas compensation curves.',
      x: 40,
      y: 465,
      width: 190,
      height: 105,
      pins: [
        { pin: 'VCC', label: 'Power', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V', net: 'power' },
        { pin: 'DATA', label: '1-Wire Bus', targetComponent: 'arduino-nano', targetPin: 'D2', voltage: '5V Digital', net: 'digital', note: 'Pulled up with 4.7kΩ resistor to 5V' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'oled',
      name: '0.96" I2C OLED Display (SSD1306)',
      type: 'Local Graphic Telemetry Screen',
      voltage: '3.3V - 5V',
      role: '128x64 monochrome OLED providing instantaneous on-device concentration readouts and immediate danger warnings without requiring network.',
      x: 320,
      y: 50,
      width: 220,
      height: 105,
      pins: [
        { pin: 'VCC', label: 'Power', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V / +3.3V', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' },
        { pin: 'SDA', label: 'I2C Data', targetComponent: 'arduino-nano', targetPin: 'A4', voltage: '5V I2C', net: 'i2c' },
        { pin: 'SCL', label: 'I2C Clock', targetComponent: 'arduino-nano', targetPin: 'A5', voltage: '5V I2C', net: 'i2c' }
      ]
    },
    {
      id: 'buzzer',
      name: 'Active Piezoelectric Buzzer',
      type: 'Autonomous Physical Siren',
      voltage: '5V Active Transducer',
      role: 'Direct hardwired emergency acoustic alarm (85 dB @ 10cm). Latches locally on danger states independent of Wi-Fi or cloud status.',
      x: 320,
      y: 520,
      width: 220,
      height: 95,
      pins: [
        { pin: '(+)', label: 'Positive Signal', targetComponent: 'arduino-nano', targetPin: 'D7', voltage: '5V Digital Trigger', net: 'digital' },
        { pin: '(-)', label: 'Negative Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'microsd',
      name: 'MicroSD SPI Module',
      type: 'Non-Volatile Black-Box Flight Recorder',
      voltage: '5V (on-board 3.3V regulator)',
      role: 'Logs every raw ADC sample, gas concentration, timestamp, and safety state to FAT32 microSD. Ensures zero telemetry loss during network drops.',
      x: 630,
      y: 50,
      width: 220,
      height: 110,
      pins: [
        { pin: 'CS', label: 'Chip Select', targetComponent: 'arduino-nano', targetPin: 'D9', voltage: '5V SPI', net: 'spi' },
        { pin: 'MOSI', label: 'Data In', targetComponent: 'arduino-nano', targetPin: 'D11', voltage: '5V SPI', net: 'spi' },
        { pin: 'MISO', label: 'Data Out', targetComponent: 'arduino-nano', targetPin: 'D12', voltage: '5V SPI', net: 'spi' },
        { pin: 'SCK', label: 'SPI Clock', targetComponent: 'arduino-nano', targetPin: 'D13', voltage: '5V SPI', net: 'spi' },
        { pin: 'VCC', label: 'Power', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    }
  ];

  const selectedComp = components.find(c => c.id === selectedCompId) || components[0];

  const getNetColor = (net: WireNet) => {
    switch (net) {
      case 'power': return '#ef4444'; // Red for 5V / 3.3V
      case 'uart': return '#f59e0b'; // Amber for Serial
      case 'i2c': return '#06b6d4'; // Cyan for I2C
      case 'spi': return '#8b5cf6'; // Violet for SPI
      case 'analog': return '#10b981'; // Emerald for Analog ADC
      case 'digital': return '#3b82f6'; // Blue for Digital
      default: return '#64748b';
    }
  };

  const getNetBadge = (net: WireNet) => {
    switch (net) {
      case 'power': return 'bg-red-50 text-red-700 border-red-200';
      case 'uart': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'i2c': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>SAFEBREATH V3 OFFICIAL HARDWARE SCHEMATIC</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Complete Circuit Diagram & Pin Routing Matrix
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Exact physical wiring, inter-controller serial buses, voltage dividers, and pull-up resistor networks.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs text-slate-700">
            <button 
              onClick={() => handleZoom(-0.15)} 
              className="p-1.5 hover:bg-white rounded hover:shadow-xs transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-semibold">{Math.round(zoomLevel * 100)}%</span>
            <button 
              onClick={() => handleZoom(0.15)} 
              className="p-1.5 hover:bg-white rounded hover:shadow-xs transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel(1)} 
              className="p-1.5 hover:bg-white rounded hover:shadow-xs transition-colors border-l border-slate-200 ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen Schematic'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full Canvas'}</span>
          </button>
        </div>
      </div>

      {/* Layer Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200">
        <span className="text-[11px] font-mono text-slate-500 uppercase px-2 font-medium">Trace Net:</span>
        {[
          { id: 'all', label: 'All Interconnects', color: 'bg-slate-900 text-white' },
          { id: 'power', label: '5V / 3.3V Power & GND', color: 'bg-red-600 text-white' },
          { id: 'analog', label: 'Analog ADC (A0, A1)', color: 'bg-emerald-600 text-white' },
          { id: 'uart', label: 'UART Serial (Nano ↔ ESP32)', color: 'bg-amber-600 text-white' },
          { id: 'i2c', label: 'I2C Bus (OLED SDA/SCL)', color: 'bg-cyan-700 text-white' },
          { id: 'spi', label: 'SPI Bus (MicroSD CS/MOSI/SCK)', color: 'bg-purple-700 text-white' },
          { id: 'digital', label: 'Digital (DHT11 D2, Buzzer D7)', color: 'bg-blue-600 text-white' }
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
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 mb-3 border-b border-slate-800 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white font-bold tracking-wider">DWG: SAFEBREATH-V3-SCH-REV3.0</span>
            </div>
            <div className="text-[11px] text-slate-500">
              CLICK COMPONENT TO INSPECT PINOUT
            </div>
          </div>

          {/* Scalable SVG Schematic Layout */}
          <div className="overflow-x-auto pb-2">
            <div 
              className="min-w-[880px] h-[640px] relative transition-transform origin-top-left"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
            >
              <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 880 640">
                <defs>
                  {/* Subtle Grid Background */}
                  <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#cad-grid)" />

                {/* Net Trace Lines */}
                {/* 1. MQ-135 AO to Nano A0 */}
                {(activeNet === 'all' || activeNet === 'analog') && (
                  <g className="transition-opacity">
                    <path d="M 230 250 L 275 250 L 275 250 L 320 250" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                    <circle cx="275" cy="250" r="3.5" fill="#10b981" />
                    <text x="245" y="242" fill="#10b981" fontSize="10" fontFamily="monospace">AO → A0</text>
                  </g>
                )}

                {/* 2. MQ-6 AO to Nano A1 */}
                {(activeNet === 'all' || activeNet === 'analog') && (
                  <g className="transition-opacity">
                    <path d="M 230 385 L 285 385 L 285 275 L 320 275" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                    <circle cx="285" cy="275" r="3.5" fill="#10b981" />
                    <text x="245" y="377" fill="#10b981" fontSize="10" fontFamily="monospace">AO → A1</text>
                  </g>
                )}

                {/* 3. ZE07-CO UART to Nano D3/D4 */}
                {(activeNet === 'all' || activeNet === 'uart') && (
                  <g className="transition-opacity">
                    <path d="M 230 110 L 275 110 L 275 220 L 320 220" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <text x="240" y="105" fill="#f59e0b" fontSize="10" fontFamily="monospace">TXD → D3 (RX)</text>
                    <path d="M 230 135 L 265 135 L 265 235 L 320 235" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="240" y="150" fill="#f59e0b" fontSize="9" fontFamily="monospace">RXD ← D4 (TX)</text>
                  </g>
                )}

                {/* 4. DHT11 Data to Nano D2 (with 4.7k pull-up) */}
                {(activeNet === 'all' || activeNet === 'digital') && (
                  <g className="transition-opacity">
                    <path d="M 230 515 L 285 515 L 285 300 L 320 300" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <circle cx="285" cy="460" r="3" fill="#ef4444" />
                    <text x="240" y="507" fill="#3b82f6" fontSize="10" fontFamily="monospace">DATA → D2 (4.7kΩ Pullup)</text>
                  </g>
                )}

                {/* 5. OLED I2C SDA/SCL to Nano A4/A5 */}
                {(activeNet === 'all' || activeNet === 'i2c') && (
                  <g className="transition-opacity">
                    <path d="M 370 155 L 370 190" fill="none" stroke="#06b6d4" strokeWidth="2" />
                    <path d="M 430 155 L 430 190" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" />
                    <text x="350" y="175" fill="#06b6d4" fontSize="10" fontFamily="monospace">SDA/SCL (A4/A5)</text>
                  </g>
                )}

                {/* 6. Buzzer to Nano D7 */}
                {(activeNet === 'all' || activeNet === 'digital') && (
                  <g className="transition-opacity">
                    <path d="M 430 480 L 430 520" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                    <text x="435" y="505" fill="#ef4444" fontSize="10" fontFamily="monospace">D7 → ALARM (+)</text>
                  </g>
                )}

                {/* 7. MicroSD SPI to Nano D9, D11, D12, D13 */}
                {(activeNet === 'all' || activeNet === 'spi') && (
                  <g className="transition-opacity">
                    <path d="M 540 215 L 585 215 L 585 105 L 630 105" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
                    <text x="555" y="100" fill="#8b5cf6" fontSize="10" fontFamily="monospace">SPI BUS (D9,11,12,13)</text>
                  </g>
                )}

                {/* 8. Inter-controller UART Link: Nano TX (D1) to ESP32 RX2 (GPIO16) via Voltage Divider */}
                {(activeNet === 'all' || activeNet === 'uart') && (
                  <g className="transition-opacity">
                    {/* Nano TX to Divider */}
                    <path d="M 540 280 L 575 280 L 575 280 L 630 280" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <rect x="570" y="272" width="22" height="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" rx="2" />
                    <text x="572" y="284" fill="#fbbf24" fontSize="9" fontFamily="monospace">DIV</text>
                    <text x="550" y="268" fill="#f59e0b" fontSize="10" fontFamily="monospace">TX(5V) → 1k/2k → RX2(3.3V)</text>

                    {/* ESP32 TX2 to Nano RX */}
                    <path d="M 630 320 L 585 320 L 585 320 L 540 320" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                    <text x="550" y="338" fill="#f59e0b" fontSize="10" fontFamily="monospace">TX2(3.3V) → RX(D0)</text>
                  </g>
                )}

                {/* 9. ESP32 to ESP32-CAM trigger */}
                {(activeNet === 'all' || activeNet === 'digital') && (
                  <g className="transition-opacity">
                    <path d="M 740 440 L 740 480" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="745" y="465" fill="#38bdf8" fontSize="10" fontFamily="monospace">GPIO Trigger / Sync</text>
                  </g>
                )}

                {/* Power Rails (Top and Bottom Bus) */}
                {(activeNet === 'all' || activeNet === 'power') && (
                  <g className="transition-opacity">
                    {/* +5V Main Bus */}
                    <line x1="20" y1="20" x2="860" y2="20" stroke="#ef4444" strokeWidth="3" />
                    <text x="30" y="16" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">+5.0V POWER DISTRIBUTION BUS</text>

                    {/* GND Common Ground Plane */}
                    <line x1="20" y1="630" x2="860" y2="630" stroke="#475569" strokeWidth="3" strokeDasharray="6 3" />
                    <text x="30" y="624" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">COMMON GND GROUND PLANE (0V)</text>
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
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> +5V DC</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> UART 9600 Baud</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Analog 10-Bit ADC</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> I2C (0x3C SSD1306)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> SPI (FAT32 SD)</span>
            </div>
            <div className="text-[11px] text-slate-500">
              SafeBreath Hardware Rev 3.0
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
                    <div className="text-[10px] text-amber-700 bg-amber-50/60 px-1.5 py-0.5 rounded border border-amber-200/50">
                      💡 {pin.note}
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
              <span>5V to 3.3V Logic Protection</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Arduino Nano outputs 5V TTL. The SafeBreath V3 circuit routes the Nano TX (Pin 1) through a 1kΩ / 2kΩ resistive voltage divider to protect ESP32 Pin GPIO16 (RX2), limiting the voltage to 3.33V maximum.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
