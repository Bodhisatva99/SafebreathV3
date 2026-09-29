import React, { useState } from 'react';
import { NavSection } from '../types';
import { ShieldAlert, Play, Menu, X, ArrowUpRight, Download } from 'lucide-react';
import { APP_DOWNLOAD_URL } from '../lib/supabase';
import { DownloadAppButton } from './DownloadAppButton';

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
        
        {/* Zone 1: Single text element wordmark with elegant brand icon */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleNavClick('product')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
            aria-label="SafeBreath Home"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              alarmActive 
                ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 group-hover:bg-emerald-100'
            }`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              SafeBreath
            </span>
          </button>
          
          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <span className="font-medium text-slate-600">Smart Atmospheric Safety</span>
            <span className="text-slate-300">·</span>
            <span className="font-mono text-slate-500">v1.2</span>
          </div>
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
        <div className="flex items-center gap-2.5 sm:gap-3">
          <DownloadAppButton variant="header" />

          <button
            onClick={() => handleNavClick('simulator')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm shrink-0 whitespace-nowrap ${
              currentSection === 'simulator'
                ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Play className="w-3 h-3 fill-current shrink-0" />
            <span>Interactive Test Bench</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Navigation</span>
            <span className="font-mono">SafeBreath Platform</span>
          </div>

          <button
            onClick={() => handleNavClick('product')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentSection === 'product' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Product Overview
          </button>

          {primaryNav.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentSection === link.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 space-y-2">
            <DownloadAppButton variant="mobile-nav" />

            <button
              onClick={() => handleNavClick('simulator')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm shadow-sm hover:bg-slate-800 transition-colors"
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
