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
