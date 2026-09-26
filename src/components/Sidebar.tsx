import React from 'react';
import { NavView } from '../types';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  if (currentView === 'home') {
    return null;
  }

  const navItems: { id: NavView; label: string; icon: string; badge?: string }[] = [
    { id: 'home', label: 'Overview', icon: 'grid_view' },
    { id: 'upload', label: 'Import Sources', icon: 'upload_file', badge: '3' },
    { id: 'investigate', label: 'Workspace', icon: 'psychology' },
    { id: 'results', label: 'Synthesis & Insights', icon: 'auto_stories' },
    { id: 'citations', label: 'Citation Explorer', icon: 'find_in_page' },
    { id: 'pipeline', label: 'Neural Pipeline', icon: 'hub' },
    { id: 'library', label: 'Knowledge Base', icon: 'folder_open', badge: '128' },
    { id: 'about', label: 'About System', icon: 'info' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#F8F7FF] border-r border-[#E0E0FF] min-h-[calc(100vh-65px)] p-4 shrink-0 justify-between">
      <div className="space-y-6">
        
        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[11px] font-bold text-[#808191] uppercase tracking-wider mb-2 font-['JetBrains_Mono']">
            Research Navigation
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#004AC1] text-white shadow-md shadow-blue-600/20'
                      : 'text-[#4A4B57] hover:bg-[#EBEAFA] hover:text-[#191B23]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-[#6C6D7C]'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#E0E0FF] text-[#004AC1]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Context Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EEECFF] to-[#E5E2FF] border border-[#D5D1FF]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
              Active Context
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h4 className="text-xs font-bold text-[#191B23] truncate">
            Q4_Market_Analysis.pdf
          </h4>
          <p className="text-[11px] text-[#5C5D69] mt-0.5 line-clamp-2">
            3 sources loaded • 1,240 tokens in context.
          </p>
          <button 
            onClick={() => onNavigate('upload')}
            className="mt-3 w-full py-1.5 px-3 bg-white text-[#004AC1] hover:bg-[#FAF8FF] border border-[#004AC1]/30 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer"
          >
            Manage Sources
          </button>
        </div>

      </div>

      {/* Footer Status */}
      <div className="pt-4 border-t border-[#E0E0FF] text-[11px] text-[#808191] space-y-1">
        <div className="flex items-center justify-between">
          <span>Engine Status</span>
          <span className="text-emerald-600 font-bold">100% Operational</span>
        </div>
        <p className="text-[10px] text-[#A0A1B0]">ScholarAI / Research Agent v2.4</p>
      </div>
    </aside>
  );
};

export const BottomBar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const items: { id: NavView; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'upload', label: 'Upload', icon: 'upload_file' },
    { id: 'investigate', label: 'Research', icon: 'travel_explore' },
    { id: 'results', label: 'Results', icon: 'auto_stories' },
    { id: 'library', label: 'Library', icon: 'folder_open' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8FF]/95 backdrop-blur-xl border-t border-[#E0E0FF] shadow-2xl rounded-t-2xl flex justify-around items-center h-16 px-2">
      {items.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive 
                ? 'bg-[#004AC1] text-white px-3.5 py-1 rounded-full shadow-md scale-105' 
                : 'text-[#6C6D7C] opacity-80 hover:opacity-100'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px]`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-medium font-['Work_Sans']">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
