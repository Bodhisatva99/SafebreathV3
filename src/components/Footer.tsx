import React from 'react';
import { NavSection } from '../types';
import { ArrowUpRight } from 'lucide-react';
import { DownloadAppButton } from './DownloadAppButton';
import { SafeBreathLogo } from './SafeBreathLogo';

interface FooterProps {
  onNavigate: (section: NavSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-black/[0.08] bg-[#F5F5F7] text-[#6E6E73] text-xs py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <button
            type="button"
            onClick={() => onNavigate('product')}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 rounded-md p-0.5 transition-opacity hover:opacity-80 block cursor-pointer"
            aria-label="SafeBreath Home"
          >
            <SafeBreathLogo width={160} variant="light" className="w-[152px] h-auto" />
          </button>
          <p className="text-[#6E6E73] text-xs leading-relaxed">
            Connected multi-gas safety and atmospheric telemetry uniting factory-calibrated electrochemical CO sensing, baseline-normalized gas indicators, autonomous physical alarms, offline MicroSD archiving, and real-time cloud observability.
          </p>
          <div className="pt-1">
            <DownloadAppButton variant="footer" />
          </div>
        </div>

        <div>
          <h4 className="text-[#1D1D1F] font-semibold text-xs mb-4">
            Hardware Platform
          </h4>
          <ul className="space-y-2.5 text-xs text-[#6E6E73]">
            <li>
              <button type="button" onClick={() => onNavigate('technology')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                ZE07-CO Electrochemical Cell
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('technology')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                MQ-135 VOC Ind. &amp; MQ-6 LPG
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('technology')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                ESP32 DevKit V1 &amp; Arduino Nano
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('technology')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                ESP32-CAM &amp; SD_MMC Gateway
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#1D1D1F] font-semibold text-xs mb-4">
            Safety &amp; Telemetry
          </h4>
          <ul className="space-y-2.5 text-xs text-[#6E6E73]">
            <li>
              <button type="button" onClick={() => onNavigate('safety')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                Autonomous Local Safety Loop
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('safety')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                Hysteresis &amp; Ambient Thresholds
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('data')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                Live Cloud Telemetry Stream
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('app')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                Android Companion Client
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#1D1D1F] font-semibold text-xs mb-4">
            Engineering Tools
          </h4>
          <ul className="space-y-2.5 text-xs text-[#6E6E73]">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('simulator')}
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Interactive Logic Simulator</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('technology')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                Rev 2.8f CAD Schematic &amp; Pinout
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate('data')} className="hover:text-[#1D1D1F] transition-colors cursor-pointer">
                Historical Sensor Logs
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#86868B]">
        <div>
          Copyright © {new Date().getFullYear()} SafeBreath Atmospheric Safety Systems · Hardware Revision 2.8f.
        </div>
        <div className="font-mono text-[#86868B]">
          CO · VOC Ind. · LPG · Ambient · Exp. Dual-CT
        </div>
      </div>
    </footer>
  );
};
