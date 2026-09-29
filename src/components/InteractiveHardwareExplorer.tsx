import React, { useState } from 'react';
import { HARDWARE_COMPONENTS } from '../data/hardwareData';
import { 
  Cpu, 
  Activity, 
  Layers, 
  HardDrive, 
  Wifi, 
  Volume2, 
  Monitor, 
  ArrowRight, 
  Zap, 
  Radio, 
  CheckCircle2,
  Info
} from 'lucide-react';

export const InteractiveHardwareExplorer: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('esp32-devkit');

  const selectedComponent = HARDWARE_COMPONENTS.find(c => c.id === selectedId) || HARDWARE_COMPONENTS[0];

  const getComponentIcon = (category: string, id: string) => {
    switch (category) {
      case 'sensor': return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'controller': return <Cpu className="w-4 h-4 text-slate-800" />;
      case 'gateway': return <Wifi className="w-4 h-4 text-sky-600" />;
      case 'display': return <Monitor className="w-4 h-4 text-indigo-600" />;
      case 'actuator': return <Volume2 className="w-4 h-4 text-amber-600" />;
      case 'storage': return <HardDrive className="w-4 h-4 text-slate-600" />;
      default: return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Component Navigation Pill Strip */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/80">
        {HARDWARE_COMPONENTS.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                isSelected 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {getComponentIcon(item.category, item.id)}
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Diagram & Inspector Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Visual Interactive Hardware Bus Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
            <span className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              INTERACTIVE HARDWARE TOPOLOGY
            </span>
            <span className="font-mono text-[11px]">Hover or click node to trace bus</span>
          </div>

          {/* Graphical Blueprint Flow */}
          <div className="relative space-y-6 pt-2">
            
            {/* Stage 1: Sensor Cluster Layer */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>01. Physical Gas & Climate Sensing Layer</span>
                <span className="text-emerald-700 font-medium">Analog & Digital Inputs</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['ze07-co', 'mq-135', 'mq-6', 'dht11'].map((id) => {
                  const comp = HARDWARE_COMPONENTS.find(c => c.id === id)!;
                  const isCurrent = comp.id === selectedId;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCurrent 
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600' 
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900">{comp.name}</span>
                        {getComponentIcon(comp.category, comp.id)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{comp.busType.split(' ')[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interconnect Bus SVG Traces */}
            <div className="py-1 flex items-center justify-around px-8 text-slate-300">
              <div className={`h-8 w-0.5 transition-colors ${selectedId === 'ze07-co' ? 'bg-emerald-600 w-1' : 'bg-slate-200'}`} />
              <div className={`h-8 w-0.5 transition-colors ${selectedId === 'mq-135' ? 'bg-emerald-600 w-1' : 'bg-slate-200'}`} />
              <div className={`h-8 w-0.5 transition-colors ${selectedId === 'mq-6' ? 'bg-emerald-600 w-1' : 'bg-slate-200'}`} />
              <div className={`h-8 w-0.5 transition-colors ${selectedId === 'dht11' ? 'bg-emerald-600 w-1' : 'bg-slate-200'}`} />
            </div>

            {/* Stage 2: Processing Layer (Dual Microcontrollers) */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>02. Distributed Processing & Decision Layer</span>
                <span className="text-slate-600 font-medium">Dual Controller Core</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['arduino-nano', 'esp32-devkit'].map((id) => {
                  const comp = HARDWARE_COMPONENTS.find(c => c.id === id)!;
                  const isCurrent = comp.id === selectedId;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isCurrent 
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-sm ${isCurrent ? 'text-white' : 'text-slate-900'}`}>{comp.name}</span>
                        <Cpu className={`w-4 h-4 ${isCurrent ? 'text-emerald-400' : 'text-slate-600'}`} />
                      </div>
                      <div className={`text-xs ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                        {id === 'arduino-nano' ? 'Sensor ADC oversampling (100Hz)' : 'Safety state machine & 85dB alarm PWM'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interconnect Bus SVG Traces */}
            <div className="py-1 flex items-center justify-around px-8 text-slate-300">
              <div className={`h-8 w-0.5 transition-colors ${selectedId === 'oled' ? 'bg-emerald-600 w-1' : 'bg-slate-200'}`} />
              <div className={`h-8 w-0.5 transition-colors ${selectedId === 'buzzer' ? 'bg-emerald-600 w-1' : 'bg-slate-200'}`} />
              <div className={`h-8 w-0.5 transition-colors ${selectedId === 'esp32-cam' ? 'bg-emerald-600 w-1' : 'bg-slate-200'}`} />
              <div className={`h-8 w-0.5 transition-colors ${selectedId === 'microsd' ? 'bg-emerald-600 w-1' : 'bg-slate-200'}`} />
            </div>

            {/* Stage 3: Display, Local Alarm, Gateway & Persistence */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>03. Local Output, Gateway & Offline Persistence</span>
                <span className="text-slate-600 font-medium">Physical & Cloud Interfaces</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['oled', 'buzzer', 'esp32-cam', 'microsd'].map((id) => {
                  const comp = HARDWARE_COMPONENTS.find(c => c.id === id)!;
                  const isCurrent = comp.id === selectedId;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCurrent 
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600' 
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900">{comp.name}</span>
                        {getComponentIcon(comp.category, comp.id)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{comp.busType.split(' ')[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right: Selected Component Detailed Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              COMPONENT SPECIFICATION
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium capitalize">
              {selectedComponent.category}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {getComponentIcon(selectedComponent.category, selectedComponent.id)}
              <h3 className="text-xl font-bold text-slate-900">{selectedComponent.name}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">{selectedComponent.title}</p>
          </div>

          {/* Primary Role */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>Functional Purpose</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {selectedComponent.role}
            </p>
          </div>

          {/* Data Flow Details */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Telemetry / Signal Produced</span>
              <span className="font-semibold text-slate-800 text-[11px] block">{selectedComponent.dataProduced}</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Physical Data Destination</span>
              <span className="font-semibold text-emerald-800 text-[11px] block flex items-center gap-1">
                <span>{selectedComponent.dataDestination}</span>
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Electrical & Bus Protocol</span>
              <span className="font-semibold text-slate-800 text-[11px] block">{selectedComponent.busType}</span>
            </div>
          </div>

          {/* Technical Specs Metric */}
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Hardware Parameters
            </span>
            <p className="text-[11px] font-mono text-slate-700 bg-slate-100/60 p-2.5 rounded-lg border border-slate-200/80">
              {selectedComponent.specs}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
