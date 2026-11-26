import React, { useState } from 'react';
import { NavSection } from '../types';
import { Play, Menu, X } from 'lucide-react';
import { DownloadAppButton } from './DownloadAppButton';
import { SafeBreathLogo } from './SafeBreathLogo';

interface HeaderProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNav: { id: NavSection; label: string }[] = [
    { id: 'technology', label: 'Hardware' },
    { id: 'data', label: 'Telemetry' },
    { id: 'safety', label: 'Safety' },
    { id: 'app', label: 'Mobile App' },
    { id: 'simulator', label: 'Simulator' },
  ];

  const handleNavClick = (section: NavSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-black/[0.08] text-[#1D1D1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Identity */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('product')}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 rounded-md py-1 transition-opacity hover:opacity-80 cursor-pointer"
            aria-label="SafeBreath Home"
          >
            <SafeBreathLogo variant="light" showSubtitle={false} className="w-[144px] sm:w-[152px] h-auto" />
          </button>
        </div>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-[#6E6E73]">
          {primaryNav.map((link) => {
            const isActive = currentSection === link.id;
            return (
              <button
                type="button"
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors relative hover:text-[#1D1D1F] cursor-pointer ${
                  isActive ? 'text-[#1D1D1F] font-semibold' : 'text-[#6E6E73]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[20px] left-0 right-0 h-[2px] bg-[#1D1D1F]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary CTA + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <DownloadAppButton variant="header" />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-[#1D1D1F] hover:bg-black/5 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-black/[0.08] px-4 pt-3 pb-6 space-y-1.5 shadow-xl">
          <button
            type="button"
            onClick={() => handleNavClick('product')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center justify-between cursor-pointer ${
              currentSection === 'product'
                ? 'bg-[#F5F5F7] text-[#1D1D1F] font-semibold'
                : 'text-[#6E6E73] hover:bg-[#F5F5F7]/70'
            }`}
          >
            <span>Overview</span>
            <span className="text-xs text-[#86868B]">Home</span>
          </button>

          {primaryNav.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center justify-between cursor-pointer ${
                currentSection === link.id
                  ? 'bg-[#F5F5F7] text-[#1D1D1F] font-semibold'
                  : 'text-[#6E6E73] hover:bg-[#F5F5F7]/70'
              }`}
            >
              <span>{link.label}</span>
              <span className="text-xs text-[#86868B]">Section</span>
            </button>
          ))}

          <div className="pt-3 space-y-2.5 border-t border-black/[0.08]">
            <DownloadAppButton variant="mobile-nav" />

            <button
              type="button"
              onClick={() => handleNavClick('simulator')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-semibold text-sm hover:bg-black/10 transition-colors min-h-[44px] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-emerald-600 shrink-0" />
              <span>Open Logic Simulator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
