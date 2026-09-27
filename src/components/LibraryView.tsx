import React, { useState } from 'react';
import { NavView } from '../types';
import { useResearch } from '../context/ResearchContext';

interface LibraryViewProps {
  onNavigate: (view: NavView) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNavigate }) => {
  const { sources, removeSource } = useResearch();
  const [filter, setFilter] = useState<'all' | 'pdf' | 'docx' | 'web'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (id: string) => {
    removeSource(id);
  };

  const filteredFiles = sources.filter((f) => {
    if (filter !== 'all' && f.type !== filter) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004AC1]">folder_open</span>
            <h1 className="text-2xl font-extrabold text-[#191B23] font-['Manrope']">
              Knowledge Base & Source Library
            </h1>
          </div>
          <p className="text-xs text-[#5C5D69] mt-1">
            Manage vector-embedded documents, web links, and datasets powering Research Agent AI.
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="px-5 py-2.5 rounded-2xl bg-[#004AC1] text-white text-xs font-bold hover:bg-[#003896] shadow-md flex items-center gap-2 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New Sources</span>
        </button>
      </div>

      {/* Library Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Index Sources', val: `${sources.length} Documents`, icon: 'folder_open' },
          { label: 'Semantic Chunks', val: `${sources.reduce((acc, s) => acc + (s.chunks?.length || 1), 0)} Chunks`, icon: 'auto_stories' },
          { label: 'Vector Density', val: '768-Dim Dense', icon: 'memory' },
          { label: 'Retrieval Guardrail', val: 'Active (Cosine)', icon: 'verified' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] text-[#004AC1] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
            </div>
            <div>
              <p className="text-base font-extrabold text-[#191B23] font-['Manrope']">{s.val}</p>
              <p className="text-[11px] text-[#5C5D69]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#808191] text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search documents by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF8FF] border border-[#DCD9FF] text-xs focus:outline-none focus:border-[#004AC1]"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'pdf', 'docx', 'web'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                filter === t
                  ? 'bg-[#004AC1] text-white shadow-sm'
                  : 'bg-[#F0EFFF] text-[#5C5D69] hover:text-[#191B23]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

      </div>

      {/* Files List */}
      <div className="space-y-3">
        {filteredFiles.map((f) => (
          <div
            key={f.id}
            className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm hover:border-[#004AC1]/30 transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004AC1] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  {f.type === 'pdf' ? 'picture_as_pdf' : f.type === 'web' ? 'language' : 'description'}
                </span>
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-[#191B23] truncate">{f.name}</h4>
                <p className="text-[10px] text-[#808191]">{f.size} • Added {f.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-['JetBrains_Mono']">
                {f.statusText}
              </span>

              <button
                onClick={() => onNavigate('citations')}
                className="px-3 py-1.5 rounded-xl bg-[#F0EFFF] text-[#004AC1] hover:bg-[#E5E2FF] text-xs font-bold transition-all"
              >
                Inspect
              </button>

              <button
                onClick={() => handleDelete(f.id)}
                className="p-1.5 rounded-xl text-[#808191] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove source"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
