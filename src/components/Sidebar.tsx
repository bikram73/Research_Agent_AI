import React from 'react';
import { NavView } from '../types';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  return null;
};

export const BottomBar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const items: { id: NavView; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'upload', label: 'Import', icon: 'upload_file' },
    { id: 'pipeline', label: 'Pipeline', icon: 'hub' },
    { id: 'investigate', label: 'Workspace', icon: 'travel_explore' },
    { id: 'results', label: 'Results', icon: 'auto_stories' },
    { id: 'library', label: 'History', icon: 'history_edu' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8FF]/95 backdrop-blur-xl border-t border-[#E0E0FF] shadow-2xl rounded-t-2xl flex justify-around items-center h-16 px-1 sm:px-4">
      {items.map((item) => {
        const isActive = currentView === item.id || (item.id === 'results' && currentView === 'citations');
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[52px] ${
              isActive 
                ? 'text-[#004AC1] font-bold scale-105' 
                : 'text-[#6C6D7C] hover:text-[#191B23]'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${isActive ? 'bg-[#004AC1] text-white shadow-xs' : ''}`}>
              <span className="material-symbols-outlined text-[18px] sm:text-[20px] block">
                {item.icon}
              </span>
            </div>
            <span className={`text-[10px] sm:text-[11px] font-['Work_Sans'] mt-0.5 ${isActive ? 'font-bold text-[#004AC1]' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
