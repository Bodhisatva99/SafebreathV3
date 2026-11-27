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
  Info,
  Fingerprint,
} from 'lucide-react';

export const InteractiveHardwareExplorer: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('esp32-devkit');

  const selectedComponent =
    HARDWARE_COMPONENTS.find((c) => c.id === selectedId) || HARDWARE_COMPONENTS[0];

  const getComponentIcon = (category: string) => {
    switch (category) {
      case 'sensor':
        return <Activity className="w-4 h-4 text-emerald-700" />;
      case 'controller':
        return <Cpu className="w-4 h-4 text-slate-800" />;
      case 'gateway':
        return <Wifi className="w-4 h-4 text-sky-700" />;
      case 'display':
        return <Monitor className="w-4 h-4 text-indigo-700" />;
      case 'input':
        return <Fingerprint className="w-4 h-4 text-cyan-700" />;
      case 'actuator':
        return <Volume2 className="w-4 h-4 text-amber-700" />;
      case 'storage':
        return <HardDrive className="w-4 h-4 text-slate-700" />;
      default:
        return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Component Selector Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        {HARDWARE_COMPONENTS.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              {getComponentIcon(item.category)}
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Topology Map + Detailed Spec Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Hardware Bus Topology */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200">
            <span className="font-mono font-bold text-slate-800 uppercase tracking-wider">
              HARDWARE BUS TOPOLOGY · REV 2.8F
            </span>
            <span className="font-mono text-[11px] text-slate-500">Select node to inspect</span>
          </div>

          <div className="space-y-5">
            {/* Layer 01: Sensors */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>01 · Sensing &amp; Load Acquisition</span>
                <span className="text-emerald-800 font-semibold">UART / Analog / Single-Wire</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {['ze07-co', 'mq-135', 'mq-6', 'dht22', 'ct-sensors'].map((id) => {
                  const comp = HARDWARE_COMPONENTS.find((c) => c.id === id)!;
                  const isCurrent = comp.id === selectedId;
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 truncate pr-1">
                          {comp.id === 'ct-sensors' ? 'CT1 / CT2' : comp.id === 'dht22' ? 'DHT22' : comp.name}
                        </span>
                        {getComponentIcon(comp.category)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {comp.busType.split(' ')[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bus Trace Divider */}
            <div className="flex items-center justify-around px-6">
              {['ze07-co', 'mq-135', 'mq-6', 'dht22', 'ct-sensors'].map((id) => (
                <div
                  key={id}
                  className={`h-6 w-0.5 transition-colors ${
                    selectedId === id ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Layer 02: Controllers */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>02 · Decoupled Controller Architecture</span>
                <span className="text-slate-700 font-semibold">Hardware Serial Bridge</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['arduino-nano', 'esp32-devkit'].map((id) => {
                  const comp = HARDWARE_COMPONENTS.find((c) => c.id === id)!;
                  const isCurrent = comp.id === selectedId;
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-sm ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                          {comp.name}
                        </span>
                        <Cpu className={`w-4 h-4 ${isCurrent ? 'text-emerald-400' : 'text-slate-600'}`} />
                      </div>
                      <div className={`text-xs ${isCurrent ? 'text-slate-300' : 'text-slate-600'}`}>
                        {id === 'arduino-nano'
                          ? '100 Hz ADC oversampling & DHT22 decode'
                          : 'Master state engine, ST7789 IPS & 5x touch'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bus Trace Divider */}
            <div className="flex items-center justify-around px-6">
              {['st7789', 'ttp223-array', 'buzzer', 'esp32-cam', 'microsd'].map((id) => (
                <div
                  key={id}
                  className={`h-6 w-0.5 transition-colors ${
                    selectedId === id ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Layer 03: Outputs, Touch UI & Storage */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>03 · ST7789 IPS, 5x Touch, Siren, Cloud &amp; SD</span>
                <span className="text-slate-700 font-semibold">SPI / GPIO / PWM / SD_MMC</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {['st7789', 'ttp223-array', 'buzzer', 'esp32-cam', 'microsd'].map((id) => {
                  const comp = HARDWARE_COMPONENTS.find((c) => c.id === id)!;
                  const isCurrent = comp.id === selectedId;
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 truncate pr-1">
                          {comp.id === 'st7789' ? '1.3" ST7789' : comp.id === 'ttp223-array' ? '5x TTP223' : comp.name}
                        </span>
                        {getComponentIcon(comp.category)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {comp.busType.split(' ')[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Component Inspector */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
              COMPONENT SPECIFICATION
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
              {selectedComponent.category}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getComponentIcon(selectedComponent.category)}
              <h3 className="text-lg font-bold text-slate-900">{selectedComponent.name}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">{selectedComponent.title}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-700" />
              <span>Functional Role</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {selectedComponent.role}
            </p>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Signal Output</span>
              <span className="font-semibold text-slate-900 text-[11px] block">
                {selectedComponent.dataProduced}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Hardware Target</span>
              <span className="font-semibold text-emerald-800 text-[11px] block">
                {selectedComponent.dataDestination}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Electrical Bus</span>
              <span className="font-semibold text-slate-900 text-[11px] block">
                {selectedComponent.busType}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
              Operating Parameters
            </span>
            <p className="text-[11px] font-mono text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {selectedComponent.specs}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
