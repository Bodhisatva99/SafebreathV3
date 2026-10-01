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

  // Components based strictly on SafeBreath V3 Hardware Rev 2.8f Pinout
  const components: CircuitComponent[] = [
    {
      id: 'esp32',
      name: 'ESP32 DevKit V1 (Dev Master)',
      type: 'Central Safety & Master Controller',
      voltage: '3.3V Logic / 5V VIN',
      role: 'Master safety controller: reads direct ZE07-CO UART (GPIO 16/17), receives Nano telemetry (GPIO 23/22), drives OLED (GPIO 4/15), sounds alarm (GPIO 13), samples CT1/CT2 (GPIO 33/32), and bridges to CAM gateway.',
      x: 340,
      y: 170,
      width: 250,
      height: 330,
      pins: [
        { pin: 'GPIO 4', label: 'I2C SDA', targetComponent: 'oled', targetPin: 'SDA', voltage: '3.3V I2C', net: 'i2c', note: 'SSD1306 OLED display data line' },
        { pin: 'GPIO 15', label: 'I2C SCL', targetComponent: 'oled', targetPin: 'SCL', voltage: '3.3V I2C', net: 'i2c', note: 'SSD1306 OLED display clock line' },
        { pin: 'GPIO 13', label: 'Buzzer Siren Driver', targetComponent: 'buzzer', targetPin: '(+)', voltage: '3.3V/5V Digital PWM', net: 'digital', note: 'Direct hardwired emergency siren drive' },
        { pin: 'GPIO 33', label: 'CT1 ADC Input', targetComponent: 'ct-sensors', targetPin: 'CT1', voltage: '0-3.3V Analog', net: 'analog', note: 'Current transformer channel 1 mains monitoring' },
        { pin: 'GPIO 32', label: 'CT2 ADC Input', targetComponent: 'ct-sensors', targetPin: 'CT2', voltage: '0-3.3V Analog', net: 'analog', note: 'Current transformer channel 2 equipment monitoring' },
        { pin: 'GPIO 23', label: 'Nano UART RX', targetComponent: 'arduino-nano', targetPin: 'TX (D1)', voltage: '3.3V UART', net: 'uart', note: 'Receives aggregated gas/climate packet stream from Nano' },
        { pin: 'GPIO 22', label: 'Nano UART TX', targetComponent: 'arduino-nano', targetPin: 'RX (D0)', voltage: '3.3V UART', net: 'uart', note: 'Transmits sync commands to Arduino Nano' },
        { pin: 'GPIO 16', label: 'ZE07-CO UART RX', targetComponent: 'ze07-co', targetPin: 'TXD', voltage: '3.3V UART', net: 'uart', note: 'Direct digital electrochemical CO concentration stream' },
        { pin: 'GPIO 17', label: 'ZE07-CO UART TX', targetComponent: 'ze07-co', targetPin: 'RXD', voltage: '3.3V UART', net: 'uart', note: 'Sensor mode configuration and calibration query' },
        { pin: 'U0TXD/U0RXD', label: 'Gateway Serial', targetComponent: 'esp32-cam', targetPin: 'Dev UART', voltage: '3.3V UART', net: 'uart', note: 'Bidirectional bridge to ESP32-CAM Gateway' },
        { pin: 'VIN (5V)', label: '5V Power Input', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5.0V Regulated', net: 'power' },
        { pin: 'GND', label: 'Common GND', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V Reference', net: 'power' }
      ]
    },
    {
      id: 'arduino-nano',
      name: 'Arduino Nano (ATmega328P)',
      type: 'Dedicated Sensor Acquisition MCU',
      voltage: '5V DC Logic',
      role: 'Continuous analog sampling of MQ-135 (A0) and MQ-6 (A1) gas sensors via 10-bit ADC, single-wire DHT11 (D2) decode, and serial streaming to ESP32 master.',
      x: 40,
      y: 190,
      width: 220,
      height: 270,
      pins: [
        { pin: 'A0', label: 'ADC0 Analog In', targetComponent: 'mq-135', targetPin: 'AO', voltage: '0-5V Analog', net: 'analog', note: 'MQ-135 VOC/Air quality analog voltage' },
        { pin: 'A1', label: 'ADC1 Analog In', targetComponent: 'mq-6', targetPin: 'AO', voltage: '0-5V Analog', net: 'analog', note: 'MQ-6 LPG/combustible gas analog voltage' },
        { pin: 'D2', label: 'Digital 1-Wire', targetComponent: 'dht11', targetPin: 'DATA', voltage: '5V Digital', net: 'digital', note: '1-Wire DHT11 temperature/humidity with pull-up' },
        { pin: 'TX (D1)', label: 'Hardware UART TX', targetComponent: 'esp32', targetPin: 'GPIO 23', voltage: '5V -> 3.3V Logic Safe', net: 'uart', note: 'Streams validated sensor telemetry to ESP32 Dev Master' },
        { pin: 'RX (D0)', label: 'Hardware UART RX', targetComponent: 'esp32', targetPin: 'GPIO 22', voltage: '3.3V Logic HIGH', net: 'uart', note: 'Receives heartbeat synchronization from ESP32' },
        { pin: '5V', label: 'Power Rail', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5.0V Regulated', net: 'power' },
        { pin: 'GND', label: 'Common GND', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V Reference', net: 'power' }
      ]
    },
    {
      id: 'esp32-cam',
      name: 'ESP32-CAM (CAM Gateway)',
      type: 'Cloud Gateway & Offline SD Logger',
      voltage: '5V Supply',
      role: 'Interconnects with ESP32 Dev Master via Hardware Serial. Manages circular local logging to onboard MicroSD via SD_MMC and Wi-Fi cloud synchronization. Camera sensor not used in this Rev 2.8f firmware.',
      x: 650,
      y: 200,
      width: 210,
      height: 250,
      pins: [
        { pin: 'Dev UART', label: 'Hardware Serial', targetComponent: 'esp32', targetPin: 'U0TXD/U0RXD', voltage: '3.3V UART', net: 'uart', note: 'Receives telemetry payload from ESP32 master' },
        { pin: 'SD_MMC', label: 'MicroSD Bus', targetComponent: 'internal', targetPin: 'MicroSD Slot', voltage: '3.3V SD Bus', net: 'spi', note: 'High-speed circular CSV local logging' },
        { pin: 'Wi-Fi', label: '802.11 b/g/n RF', targetComponent: 'cloud', targetPin: 'Supabase Realtime', voltage: 'Internal RF', net: 'digital', note: 'Cloud database synchronization' },
        { pin: 'Camera', label: 'OV2640 Interface', targetComponent: 'internal', targetPin: 'Disabled', voltage: 'N/A', net: 'digital', note: 'Not used by this Rev 2.8f firmware' },
        { pin: '5V', label: 'Power Input', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V', net: 'power' },
        { pin: 'GND', label: 'Common GND', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'ze07-co',
      name: 'ZE07-CO Electrochemical Sensor',
      type: 'Atmospheric Carbon Monoxide Cell',
      voltage: '3.7V - 5.5V Supply',
      role: 'Electrochemical fuel cell selectively oxidized by CO molecules. Provides calibrated digital readings via direct UART link to ESP32 Dev Master (GPIO 16/17).',
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
      id: 'dht11',
      name: 'DHT11 Temp & Humidity',
      type: 'Digital Thermistor & Capacitive Probe',
      voltage: '3.3V - 5.5V',
      role: 'Measures environmental temperature and relative humidity for thermal safety and gas compensation.',
      x: 40,
      y: 610,
      width: 220,
      height: 105,
      pins: [
        { pin: 'DATA', label: '1-Wire Bus', targetComponent: 'arduino-nano', targetPin: 'D2', voltage: '5V Digital', net: 'digital', note: 'Pulled up with 4.7kΩ resistor to 5V' },
        { pin: 'VCC', label: 'Power', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'ct-sensors',
      name: 'Dual CT Current Sensors (CT1 & CT2)',
      type: 'Current Transformers / Mains Load',
      voltage: '0 - 3.3V Analog AC Output',
      role: 'Monitors site electrical current and ventilation load: CT1 on GPIO 33 and CT2 on GPIO 32 of ESP32 Master.',
      x: 340,
      y: 530,
      width: 250,
      height: 105,
      pins: [
        { pin: 'CT1', label: 'Current Sensor 1 Out', targetComponent: 'esp32', targetPin: 'GPIO 33', voltage: '0-3.3V Analog', net: 'analog', note: 'Direct ADC input to ESP32 Dev Master' },
        { pin: 'CT2', label: 'Current Sensor 2 Out', targetComponent: 'esp32', targetPin: 'GPIO 32', voltage: '0-3.3V Analog', net: 'analog', note: 'Direct ADC input to ESP32 Dev Master' },
        { pin: 'GND', label: 'Ground Reference', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'oled',
      name: '0.96" I2C OLED Display (SSD1306)',
      type: 'Local Graphic Telemetry Screen',
      voltage: '3.3V - 5V',
      role: '128x64 monochrome OLED providing instantaneous on-device concentration readouts driven by ESP32 on GPIO 4 (SDA) and GPIO 15 (SCL).',
      x: 650,
      y: 40,
      width: 210,
      height: 125,
      pins: [
        { pin: 'SDA', label: 'I2C Data', targetComponent: 'esp32', targetPin: 'GPIO 4', voltage: '3.3V I2C', net: 'i2c', note: 'Connected to ESP32 GPIO 4' },
        { pin: 'SCL', label: 'I2C Clock', targetComponent: 'esp32', targetPin: 'GPIO 15', voltage: '3.3V I2C', net: 'i2c', note: 'Connected to ESP32 GPIO 15' },
        { pin: 'VCC', label: 'Power', targetComponent: 'power-rail', targetPin: '5V BUS', voltage: '+5V / +3.3V', net: 'power' },
        { pin: 'GND', label: 'Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
      ]
    },
    {
      id: 'buzzer',
      name: 'Active Piezoelectric Buzzer',
      type: 'Autonomous Physical Siren',
      voltage: '5V Active Transducer',
      role: 'Direct hardwired emergency acoustic alarm (85 dB @ 10cm). Latches locally on danger states driven directly by ESP32 GPIO 13.',
      x: 650,
      y: 480,
      width: 210,
      height: 110,
      pins: [
        { pin: '(+)', label: 'Positive Signal', targetComponent: 'esp32', targetPin: 'GPIO 13', voltage: '3.3V/5V Digital', net: 'digital', note: 'Driven directly by ESP32 GPIO 13' },
        { pin: '(-)', label: 'Negative Ground', targetComponent: 'power-rail', targetPin: 'GND BUS', voltage: '0V', net: 'power' }
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

                {/* Net Trace Lines for Rev 2.8f Pinout */}
                
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

                {/* 3. DHT11 Data to Arduino Nano D2 */}
                {(activeNet === 'all' || activeNet === 'digital') && (
                  <g className="transition-opacity">
                    <path d="M 80 610 L 80 460" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="80" cy="535" r="3" fill="#3b82f6" />
                    <text x="86" y="540" fill="#3b82f6" fontSize="10" fontFamily="monospace">DATA → Nano D2</text>
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

                {/* 5. Nano Hardware Serial (D0/D1) to ESP32 Dev Master (GPIO 23 RX / GPIO 22 TX) */}
                {(activeNet === 'all' || activeNet === 'uart') && (
                  <g className="transition-opacity">
                    <path d="M 260 280 L 340 280" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="300" cy="280" r="3" fill="#f59e0b" />
                    <text x="268" y="272" fill="#f59e0b" fontSize="10" fontFamily="monospace">Nano TX(D1) → ESP32 GPIO 23</text>

                    <path d="M 340 320 L 260 320" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="300" cy="320" r="3" fill="#f59e0b" />
                    <text x="268" y="335" fill="#f59e0b" fontSize="10" fontFamily="monospace">Nano RX(D0) ← ESP32 GPIO 22</text>
                  </g>
                )}

                {/* 6. ESP32 I2C OLED (GPIO 4 SDA / GPIO 15 SCL) */}
                {(activeNet === 'all' || activeNet === 'i2c') && (
                  <g className="transition-opacity">
                    <path d="M 590 210 L 620 210 L 620 90 L 650 90" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                    <text x="595" y="150" fill="#06b6d4" fontSize="10" fontFamily="monospace">I2C: GPIO 4 (SDA)</text>
                    <path d="M 590 230 L 635 230 L 635 110 L 650 110" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" />
                    <text x="595" y="165" fill="#06b6d4" fontSize="10" fontFamily="monospace">I2C: GPIO 15 (SCL)</text>
                  </g>
                )}

                {/* 7. ESP32 Buzzer Driver (GPIO 13 -> Buzzer (+)) */}
                {(activeNet === 'all' || activeNet === 'digital') && (
                  <g className="transition-opacity">
                    <path d="M 590 450 L 620 450 L 620 530 L 650 530" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                    <text x="598" y="490" fill="#ef4444" fontSize="10" fontFamily="monospace">GPIO 13 → BUZZER (+)</text>
                  </g>
                )}

                {/* 8. ESP32 ADC Dual CT Current Sensors (GPIO 33 CT1 / GPIO 32 CT2) */}
                {(activeNet === 'all' || activeNet === 'analog') && (
                  <g className="transition-opacity">
                    <path d="M 430 500 L 430 530" fill="none" stroke="#10b981" strokeWidth="2.5" />
                    <text x="370" y="518" fill="#10b981" fontSize="10" fontFamily="monospace">CT1 → GPIO 33</text>
                    <path d="M 500 500 L 500 530" fill="none" stroke="#10b981" strokeWidth="2.5" />
                    <text x="506" y="518" fill="#10b981" fontSize="10" fontFamily="monospace">CT2 → GPIO 32</text>
                  </g>
                )}

                {/* 9. ESP32 Master to ESP32-CAM Gateway Serial Bridge */}
                {(activeNet === 'all' || activeNet === 'uart') && (
                  <g className="transition-opacity">
                    <path d="M 590 320 L 650 320" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="620" cy="320" r="3.5" fill="#f59e0b" />
                    <text x="592" y="312" fill="#f59e0b" fontSize="9" fontFamily="monospace">Hardware Serial Bridge</text>
                  </g>
                )}

                {/* Power Rails (Top and Bottom Bus) */}
                {(activeNet === 'all' || activeNet === 'power') && (
                  <g className="transition-opacity">
                    {/* +5V Main Bus */}
                    <line x1="20" y1="20" x2="880" y2="20" stroke="#ef4444" strokeWidth="3" />
                    <text x="30" y="16" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">+5.0V POWER DISTRIBUTION BUS</text>

                    {/* GND Common Ground Plane */}
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
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> UART Serial (9600)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Analog ADC (Gas/CT)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> I2C (GPIO 4/15 OLED)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> SD_MMC Bus</span>
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
