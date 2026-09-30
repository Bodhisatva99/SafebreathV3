import React, { useState } from 'react';
import { NavSection } from '../types';
import { ShieldAlert, Play, Menu, X, ArrowUpRight, Download } from 'lucide-react';
import { APP_DOWNLOAD_URL } from '../lib/supabase';
import { DownloadAppButton } from './DownloadAppButton';
import { SafeBreathLogo } from './SafeBreathLogo';

interface HeaderProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  alarmActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentSection, onNavigate, alarmActive = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNav: { id: NavSection; label: string }[] = [
    { id: 'technology', label: 'Technology' },
    { id: 'system', label: 'System' },
    { id: 'safety', label: 'Safety' },
    { id: 'data', label: 'Data' },
    { id: 'app', label: 'Ecosystem' },
  ];

  const handleNavClick = (section: NavSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Primary Brand Logo (150px - 175px wide on desktop, scalable on mobile) */}
        <div className="flex items-center">
          <button 
            onClick={() => handleNavClick('product')}
            className="group text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-lg p-1 transition-opacity hover:opacity-90"
            aria-label="SafeBreath Home"
          >
            <SafeBreathLogo width={168} className="w-[145px] sm:w-[168px] h-auto" />
          </button>
        </div>

        {/* Zone 2: Clean, single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-600">
          {primaryNav.map((link) => {
            const isActive = currentSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-1 text-sm tracking-tight transition-colors relative hover:text-slate-900 ${
                  isActive ? 'text-emerald-700 font-semibold' : 'text-slate-600'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-22px] left-0 right-0 h-0.5 bg-emerald-600" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DownloadAppButton variant="header" />

          <button
            onClick={() => handleNavClick('simulator')}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm shrink-0 whitespace-nowrap min-h-[38px] ${
              currentSection === 'simulator'
                ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
            title="Launch Interactive Test Bench"
          >
            <Play className="w-3 h-3 fill-current shrink-0" />
            <span className="hidden sm:inline">Interactive Test Bench</span>
            <span className="sm:hidden">Test Bench</span>
          </button>

          {/* Mobile menu toggle with 44px touch target */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none min-h-[42px] min-w-[42px] flex items-center justify-center transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 space-y-2.5 shadow-xl animate-fadeIn">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Platform Navigation</span>
            <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">v3.0 COTS Metrology</span>
          </div>

          <button
            onClick={() => handleNavClick('product')}
            className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center justify-between ${
              currentSection === 'product' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Product Overview</span>
            <span className="text-xs text-slate-400">Home</span>
          </button>

          {primaryNav.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center justify-between ${
                currentSection === link.id ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.label}</span>
              <span className="text-xs text-slate-400">#{link.id}</span>
            </button>
          ))}

          <div className="pt-3 space-y-2.5 border-t border-slate-100">
            <DownloadAppButton variant="mobile-nav" />

            <button
              onClick={() => handleNavClick('simulator')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm shadow-sm hover:bg-slate-800 active:scale-[0.99] transition-all min-h-[46px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Interactive Test Bench</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
