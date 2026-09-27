import React from 'react';
import { NavView } from '../types';

interface FooterProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentView, onNavigate }) => {
  return (
    <footer className="mt-auto border-t border-[#E0E0FF] bg-white/70 backdrop-blur-sm text-xs text-[#5C5D69] font-['Work_Sans'] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-md bg-[#004AC1] text-white flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C2 4.89543 2.89543 4 4 4H10C11.1046 4 12 4.89543 12 6V18C12 16.8954 11.1046 16 10 16H4C2.89543 16 2 16.8954 2 18V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6C22 4.89543 21.1046 4 20 4H14C12.8954 4 12 4.89543 12 6V18C12 16.8954 12.8954 16 14 16H20C21.1046 16 22 16.8954 22 18V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="15.5" cy="10.5" r="3" fill="#004AC1" stroke="white" strokeWidth="1.5"/>
                <path d="M17.8 12.8L20.2 15.2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-[#191B23] font-['Manrope'] text-xs hover:text-[#004AC1] transition-colors">
              Research Agent AI
            </span>
          </div>
          <span className="text-[#C5C4FF] hidden sm:inline">•</span>
          <p className="text-[11px] text-[#808191] hidden sm:inline">
            Deterministic RAG & Evidence Grounding
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-medium">
          <button 
            onClick={() => onNavigate('home')} 
            className={`transition-colors hover:text-[#004AC1] ${currentView === 'home' ? 'text-[#004AC1] font-bold' : 'text-[#5C5D69]'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => onNavigate('upload')} 
            className={`transition-colors hover:text-[#004AC1] ${currentView === 'upload' ? 'text-[#004AC1] font-bold' : 'text-[#5C5D69]'}`}
          >
            Import
          </button>
          <button 
            onClick={() => onNavigate('investigate')} 
            className={`transition-colors hover:text-[#004AC1] ${currentView === 'investigate' ? 'text-[#004AC1] font-bold' : 'text-[#5C5D69]'}`}
          >
            Workspace
          </button>
          <button 
            onClick={() => onNavigate('citations')} 
            className={`transition-colors hover:text-[#004AC1] ${currentView === 'citations' ? 'text-[#004AC1] font-bold' : 'text-[#5C5D69]'}`}
          >
            Citations
          </button>
          <button 
            onClick={() => onNavigate('pipeline')} 
            className={`transition-colors hover:text-[#004AC1] ${currentView === 'pipeline' ? 'text-[#004AC1] font-bold' : 'text-[#5C5D69]'}`}
          >
            Pipeline
          </button>
          <button 
            onClick={() => onNavigate('library')} 
            className={`transition-colors hover:text-[#004AC1] ${currentView === 'library' ? 'text-[#004AC1] font-bold' : 'text-[#5C5D69]'}`}
          >
            Library
          </button>
          <button 
            onClick={() => onNavigate('about')} 
            className={`transition-colors hover:text-[#004AC1] ${currentView === 'about' ? 'text-[#004AC1] font-bold' : 'text-[#5C5D69]'}`}
          >
            About & Specs
          </button>
        </div>

        {/* GitHub & External Links */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://github.com/bikram73/Research_Agent_AI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F0EFFF] hover:bg-[#E2DEFF] text-[#004AC1] hover:text-[#003896] text-[11px] font-semibold border border-[#D5D1FF] transition-all cursor-pointer shadow-xs active:scale-95"
            title="View Source on GitHub"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub</span>
          </a>

          <span className="text-[10px] font-mono text-[#808191] hidden lg:inline px-2 py-0.5 rounded bg-[#FAF8FF] border border-[#E0E0FF]">
            MIT License
          </span>
        </div>
      </div>
    </footer>
  );
};
