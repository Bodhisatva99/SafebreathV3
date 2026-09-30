import React from 'react';
import { NavSection } from '../types';
import { ShieldAlert, ArrowUpRight } from 'lucide-react';
import { DownloadAppButton } from './DownloadAppButton';
import { SafeBreathLogo } from './SafeBreathLogo';

interface FooterProps {
  onNavigate: (section: NavSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs py-12 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <button 
            onClick={() => onNavigate('product')}
            className="text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-lg p-0.5 transition-opacity hover:opacity-90 block"
            aria-label="SafeBreath Home"
          >
            <SafeBreathLogo width={155} variant="light" className="w-[145px] h-auto" />
          </button>
          <p className="text-slate-600 text-xs leading-relaxed">
            Smart Multi-Gas Detection & Environmental Safety System. A low-cost connected hardware platform uniting physical multi-gas sensing, autonomous local alarms, offline local logging, and cloud alerts.
          </p>
          <div className="text-[11px] font-mono text-slate-400">
            Open Atmospheric Metrology & Embedded Research
          </div>
          <div className="pt-2">
            <DownloadAppButton variant="footer" />
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 font-semibold uppercase tracking-wider text-[11px] mb-3">
            Hardware & Subsystems
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li>
              <button onClick={() => onNavigate('technology')} className="hover:text-emerald-800 transition-colors">
                ZE07-CO Electrochemical Cell
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('technology')} className="hover:text-emerald-800 transition-colors">
                MQ-135 VOC & MQ-6 LPG Sensors
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('system')} className="hover:text-emerald-800 transition-colors">
                Dual Controller (Nano + ESP32 DevKit)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('system')} className="hover:text-emerald-800 transition-colors">
                ESP32-CAM Wi-Fi & MicroSD Gateway
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-semibold uppercase tracking-wider text-[11px] mb-3">
            Safety & Observability
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li>
              <button onClick={() => onNavigate('safety')} className="hover:text-emerald-800 transition-colors">
                Multi-Gas Thresholds & Hysteresis
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('safety')} className="hover:text-emerald-800 transition-colors">
                Autonomous Local Safety Philosophy
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('data')} className="hover:text-emerald-800 transition-colors">
                Supabase Telemetry & Event Storage
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('app')} className="hover:text-emerald-800 transition-colors">
                Firebase Cloud Messaging Mobile Push
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-semibold uppercase tracking-wider text-[11px] mb-3">
            Interactive Test Bench
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li>
              <button 
                onClick={() => onNavigate('simulator')} 
                className="text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Interactive Hardware Simulator</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('technology')} className="hover:text-emerald-800 transition-colors">
                Interactive Sensor Topology Explorer
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('data')} className="hover:text-emerald-800 transition-colors">
                Historical Telemetry & Alert History
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div>
          © {new Date().getFullYear()} SafeBreath Project. Embedded atmospheric safety hardware and open telemetry architecture.
        </div>
        <div className="flex items-center gap-4">
          <span>Arduino · ESP32 · Supabase · FCM</span>
          <span>·</span>
          <span>Zero-Internet Local Safety Principle</span>
        </div>
      </div>
    </footer>
  );
};
