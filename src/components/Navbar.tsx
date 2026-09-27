import React from 'react';
import { NavView } from '../types';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8FF]/90 backdrop-blur-md border-b border-[#E0E0FF] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#004AC1] via-[#1D60D8] to-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform ring-1 ring-white/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6C2 4.89543 2.89543 4 4 4H10C11.1046 4 12 4.89543 12 6V18C12 16.8954 11.1046 16 10 16H4C2.89543 16 2 16.8954 2 18V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 6C22 4.89543 21.1046 4 20 4H14C12.8954 4 12 4.89543 12 6V18C12 16.8954 12.8954 16 14 16H20C21.1046 16 22 16.8954 22 18V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="15.5" cy="10.5" r="3" fill="#004AC1" stroke="white" strokeWidth="1.5"/>
              <path d="M17.8 12.8L20.2 15.2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5.5 8H8.5M5.5 11H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg lg:text-xl tracking-tight text-[#004AC1] font-['Manrope'] transition-colors">
                Research Agent AI
              </span>
            </div>
            <p className="text-xs text-[#5C5D69] hidden md:block">
              Rigorous Citations & Verified Synthesis
            </p>
          </div>
        </div>

        {/* Center Nav Items (Desktop Quick Links) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F0EFFF] p-1 rounded-full border border-[#DCD9FF]">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'home'
                ? 'bg-white text-[#004AC1] shadow-sm'
                : 'text-[#5C5D69] hover:text-[#191B23]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'upload'
                ? 'bg-white text-[#004AC1] shadow-sm'
                : 'text-[#5C5D69] hover:text-[#191B23]'
            }`}
          >
            Import Sources
          </button>
          <button
            onClick={() => onNavigate('investigate')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'investigate'
                ? 'bg-white text-[#004AC1] shadow-sm'
                : 'text-[#5C5D69] hover:text-[#191B23]'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => onNavigate('results')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'results' || currentView === 'citations'
                ? 'bg-white text-[#004AC1] shadow-sm'
                : 'text-[#5C5D69] hover:text-[#191B23]'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => onNavigate('pipeline')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'pipeline'
                ? 'bg-white text-[#004AC1] shadow-sm'
                : 'text-[#5C5D69] hover:text-[#191B23]'
            }`}
          >
            Pipeline
          </button>
          <button
            onClick={() => onNavigate('library')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'library'
                ? 'bg-white text-[#004AC1] shadow-sm'
                : 'text-[#5C5D69] hover:text-[#191B23]'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'about'
                ? 'bg-white text-[#004AC1] shadow-sm'
                : 'text-[#5C5D69] hover:text-[#191B23]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right Actions & Engine Status */}
        <div className="flex items-center gap-3">
          {/* Active Model Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Neural RAG Engine</span>
          </div>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/bikram73/Research_Agent_AI"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E0E0FF] hover:border-[#004AC1] text-[#191B23] hover:text-[#004AC1] text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub</span>
          </a>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#004AC1] to-[#6366F1] hover:from-[#003896] hover:to-[#4F46E5] text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>New Research</span>
          </button>
        </div>

      </div>
    </header>
  );
};
