import React, { useState, useEffect } from 'react';
import { NavSection } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductPage } from './pages/ProductPage';
import { PrecisionHardwareSimulator } from './components/PrecisionHardwareSimulator';
import { SafeBreathShieldSymbol } from './components/SafeBreathLogo';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('product');
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    // Very short brand transition (~500ms) with shield symbol
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (section: NavSection) => {
    setCurrentSection(section);
    
    if (section === 'product') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Attempt to scroll to target anchor section if it exists on the page
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] text-slate-900 selection:bg-emerald-600 selection:text-white font-sans relative">
      {/* Short Brand Splash Transition */}
      {splashVisible && (
        <div 
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center animate-pulse">
            <SafeBreathShieldSymbol size={54} />
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em] mt-3.5">
              SafeBreath Platform
            </div>
          </div>
        </div>
      )}

      <Header 
        currentSection={currentSection} 
        onNavigate={handleNavigate} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <ProductPage onNavigate={handleNavigate} />
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
