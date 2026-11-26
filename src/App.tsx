import React, { useState, useEffect } from 'react';
import { NavSection } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductPage } from './pages/ProductPage';

const SPY_SECTIONS: NavSection[] = ['data', 'safety', 'technology', 'app', 'simulator'];

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('product');

  useEffect(() => {
    const handleTopCheck = () => {
      if (window.scrollY < 260) {
        setCurrentSection('product');
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 260) {
          setCurrentSection('product');
          return;
        }
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.id as NavSection;
          if (SPY_SECTIONS.includes(id)) {
            setCurrentSection(id);
          }
        }
      },
      {
        rootMargin: '-22% 0px -55% 0px',
        threshold: [0.05, 0.2, 0.45],
      }
    );

    SPY_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleTopCheck, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleTopCheck);
    };
  }, []);

  const handleNavigate = (section: NavSection) => {
    setCurrentSection(section);

    if (section === 'product') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-600 selection:text-white font-sans antialiased">
      <Header
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 w-full">
        <ProductPage onNavigate={handleNavigate} />
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
