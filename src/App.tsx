import React, { useState } from 'react';
import { NavSection } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductPage } from './pages/ProductPage';
import { PrecisionHardwareSimulator } from './components/PrecisionHardwareSimulator';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('product');

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
    <div className="min-h-screen flex flex-col bg-[#fafbfc] text-slate-900 selection:bg-emerald-600 selection:text-white font-sans">
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
