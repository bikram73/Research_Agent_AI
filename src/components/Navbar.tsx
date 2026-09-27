import React, { useState } from 'react';
import { NavView } from '../types';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavView; label: string; icon: string; badge?: string }[] = [
    { id: 'home', label: 'Overview', icon: 'home' },
    { id: 'upload', label: '1. Import Sources', icon: 'upload_file' },
    { id: 'pipeline', label: '2. Pipeline', icon: 'hub' },
    { id: 'investigate', label: '3. Workspace', icon: 'travel_explore' },
    { id: 'results', label: '4. Results', icon: 'auto_stories' },
    { id: 'citations', label: 'Citations Graph', icon: 'format_quote' },
    { id: 'library', label: 'History & Library', icon: 'history_edu' },
    { id: 'about', label: 'Architecture & About', icon: 'info' },
  ];

  const handleNavClick = (view: NavView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8FF]/95 backdrop-blur-md border-b border-[#E0E0FF] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#004AC1] via-[#1D60D8] to-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform ring-1 ring-white/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C2 4.89543 2.89543 4 4 4H10C11.1046 4 12 4.89543 12 6V18C12 16.8954 11.1046 16 10 16H4C2.89543 16 2 16.8954 2 18V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6C22 4.89543 21.1046 4 20 4H14C12.8954 4 12 4.89543 12 6V18C12 16.8954 12.8954 16 14 16H20C21.1046 16 22 16.8954 22 18V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="15.5" cy="10.5" r="3" fill="#004AC1" stroke="white" strokeWidth="1.5"/>
                <path d="M17.8 12.8L20.2 15.2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M5.5 8H8.5M5.5 11H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-[#004AC1] font-['Manrope'] transition-colors">
                  Research Agent AI
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#5C5D69] hidden md:block">
                Rigorous Citations & Grounded Synthesis
              </p>
            </div>
          </div>

          {/* Desktop & Wide Tablet Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F0EFFF] p-1 rounded-full border border-[#DCD9FF]">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-white text-[#004AC1] shadow-xs'
                  : 'text-[#5C5D69] hover:text-[#191B23]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleNavClick('upload')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'upload'
                  ? 'bg-white text-[#004AC1] shadow-xs'
                  : 'text-[#5C5D69] hover:text-[#191B23]'
              }`}
            >
              Import
            </button>
            <button
              onClick={() => handleNavClick('pipeline')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'pipeline'
                  ? 'bg-white text-[#004AC1] shadow-xs'
                  : 'text-[#5C5D69] hover:text-[#191B23]'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => handleNavClick('investigate')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'investigate'
                  ? 'bg-white text-[#004AC1] shadow-xs'
                  : 'text-[#5C5D69] hover:text-[#191B23]'
              }`}
            >
              Workspace
            </button>
            <button
              onClick={() => handleNavClick('results')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'results' || currentView === 'citations'
                  ? 'bg-white text-[#004AC1] shadow-xs'
                  : 'text-[#5C5D69] hover:text-[#191B23]'
              }`}
            >
              Results
            </button>
            <button
              onClick={() => handleNavClick('library')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'library'
                  ? 'bg-white text-[#004AC1] shadow-xs'
                  : 'text-[#5C5D69] hover:text-[#191B23]'
              }`}
            >
              History
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'about'
                  ? 'bg-white text-[#004AC1] shadow-xs'
                  : 'text-[#5C5D69] hover:text-[#191B23]'
              }`}
            >
              About
            </button>
          </nav>

          {/* Right Actions (Mobile Toggle & Primary CTA) */}
          <div className="flex items-center gap-2">
            {/* Active Status Badge (Tablet / Desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden md:inline">Deterministic</span>
              <span>RAG</span>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('upload')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#004AC1] to-[#6366F1] hover:from-[#003896] hover:to-[#4F46E5] text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">add_box</span>
              <span className="hidden xs:inline">New Research</span>
            </button>

            {/* Mobile & Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#E0E0FF] text-[#191B23] hover:bg-[#F0EFFF] transition-colors cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile & Tablet Slide-over Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-out Sheet */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-6 overflow-y-auto">
              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E0E0FF]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#004AC1] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[18px]">science</span>
                  </div>
                  <span className="font-extrabold text-sm text-[#191B23] font-['Manrope']">
                    Navigation Menu
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Navigation Items List */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-[#808191] uppercase tracking-wider font-['JetBrains_Mono'] px-2">
                  Research Workflow
                </p>
                {navLinks.map((link) => {
                  const isActive = currentView === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#004AC1] text-white shadow-md shadow-blue-600/20'
                          : 'bg-[#FAF8FF] hover:bg-[#F0EFFF] text-[#4A4B57]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[18px]">
                          {link.icon}
                        </span>
                        <span>{link.label}</span>
                      </div>
                      {isActive && (
                        <span className="material-symbols-outlined text-[16px]">
                          chevron_right
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* System Info Pill in Drawer */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#004AC1] font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>100% Grounded AI</span>
                </div>
                <p className="text-[11px] text-[#5C5D69] leading-relaxed">
                  All citations and extractions run in-memory inside your browser with complete privacy.
                </p>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-[#E0E0FF] space-y-2">
              <button
                onClick={() => handleNavClick('investigate')}
                className="w-full py-3 rounded-xl bg-[#004AC1] text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                <span>Open Search Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
