import React, { useState } from 'react';
import { NavView } from '../types';
import { useResearch } from '../context/ResearchContext';

interface LibraryViewProps {
  onNavigate: (view: NavView) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNavigate }) => {
  const {
    sources,
    removeSource,
    history,
    loadHistoryItem,
    deleteHistoryItem,
    clearAllHistory,
    loadQATestDataset,
  } = useResearch();

  const [activeTab, setActiveTab] = useState<'history' | 'sources'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClearModal, setConfirmClearModal] = useState(false);

  // Filter history records based on search query
  const filteredHistory = history.filter((h) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.query.toLowerCase().includes(q) ||
      h.title.toLowerCase().includes(q) ||
      h.result.summary.toLowerCase().includes(q)
    );
  });

  // Filter sources
  const filteredSources = sources.filter((f) => {
    if (!searchQuery.trim()) return true;
    return f.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenHistoryItem = (id: string) => {
    loadHistoryItem(id);
    onNavigate('results');
  };

  const handleExportHistoryJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `research_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-['Work_Sans']">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004AC1] text-2xl">
              {activeTab === 'history' ? 'history_edu' : 'folder_open'}
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#191B23] font-['Manrope']">
              {activeTab === 'history' ? 'Research History' : 'Source Documents Library'}
            </h1>
          </div>
          <p className="text-xs text-[#5C5D69] mt-1">
            {activeTab === 'history'
              ? 'Locally stored research investigations, verified findings, and citations saved in browser storage.'
              : 'Vector-embedded documents, PDFs, and datasets powering semantic retrieval.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-[#F0EFFF] p-1.5 rounded-2xl self-start md:self-auto border border-[#E0E0FF]">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-[#004AC1] shadow-sm'
                : 'text-[#5C5D69] hover:text-[#191B23]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>Investigation History ({history.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sources'
                ? 'bg-white text-[#004AC1] shadow-sm'
                : 'text-[#5C5D69] hover:text-[#191B23]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            <span>Active Sources ({sources.length})</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004AC1] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">history_edu</span>
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#191B23] font-['Manrope']">{history.length}</p>
            <p className="text-[11px] text-[#5C5D69]">Saved Inquiries</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">storage</span>
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#191B23] font-['Manrope']">LocalStorage</p>
            <p className="text-[11px] text-[#5C5D69]">Browser Persistent</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">description</span>
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#191B23] font-['Manrope']">{sources.length}</p>
            <p className="text-[11px] text-[#5C5D69]">Active Sources</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#191B23] font-['Manrope']">Client-Only</p>
            <p className="text-[11px] text-[#5C5D69]">Zero Cloud Leaks</p>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#808191] text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder={activeTab === 'history' ? 'Search previous investigations...' : 'Search active source files...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF8FF] border border-[#DCD9FF] text-xs focus:outline-none focus:border-[#004AC1]"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'history' && history.length > 0 && (
            <>
              <button
                onClick={handleExportHistoryJSON}
                className="px-3 py-2 rounded-xl bg-[#FAF8FF] hover:bg-[#F0EFFF] text-[#004AC1] text-xs font-bold transition-all border border-[#DCD9FF] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => setConfirmClearModal(true)}
                className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all border border-rose-200 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                <span>Clear All History</span>
              </button>
            </>
          )}

          {activeTab === 'sources' && (
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 rounded-xl bg-[#004AC1] text-white text-xs font-bold hover:bg-[#003896] shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Upload New Documents</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: HISTORY VIEW */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            /* Clean Empty History Zero State */
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E0E0FF] shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#004AC1] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">history_toggle_off</span>
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-[#191B23] font-['Manrope']">
                  No Research History Yet
                </h3>
                <p className="text-xs text-[#5C5D69] leading-relaxed">
                  Your search questions, verified summaries, and source citations will automatically be saved here in your browser’s local storage.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('investigate')}
                  className="px-5 py-2.5 rounded-2xl bg-[#004AC1] hover:bg-[#003896] text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                  <span>Start First Investigation</span>
                </button>
                {sources.length === 0 && (
                  <button
                    onClick={() => {
                      loadQATestDataset();
                      onNavigate('investigate');
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-white border border-[#E0E0FF] hover:bg-[#F0EFFF] text-[#004AC1] text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">dataset</span>
                    <span>Load Benchmark QA Dataset</span>
                  </button>
                )}
              </div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E0E0FF] text-xs text-[#5C5D69]">
              No history found matching "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm hover:border-[#004AC1]/40 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-['JetBrains_Mono'] bg-blue-50 text-[#004AC1] border border-blue-100">
                        {item.dateFormatted}
                      </span>
                      {item.isInsufficientContext ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Refusal Guardrail (Insufficient Evidence)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>{Math.round(item.confidenceScore * 100)}% Grounded</span>
                        </span>
                      )}
                      <span className="text-[11px] text-[#808191]">
                        {item.findingsCount} findings • {item.citationsCount} citations
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#191B23] font-['Manrope'] truncate">
                      {item.query}
                    </h4>

                    <p className="text-xs text-[#5C5D69] line-clamp-2 leading-relaxed">
                      {item.result.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EFFF]">
                    <button
                      onClick={() => handleOpenHistoryItem(item.id)}
                      className="px-4 py-2 rounded-xl bg-[#004AC1] hover:bg-[#003896] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Open Report</span>
                    </button>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="p-2 rounded-xl text-[#808191] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete this history record"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SOURCES LIST */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          {sources.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E0E0FF] shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#004AC1] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">inventory_2</span>
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-[#191B23] font-['Manrope']">
                  No Active Sources Loaded
                </h3>
                <p className="text-xs text-[#5C5D69]">
                  Upload PDF, DOCX, TXT, MD, CSV, JSON, or HTML files to build your local research index.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('upload')}
                  className="px-5 py-2.5 rounded-2xl bg-[#004AC1] hover:bg-[#003896] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Go to Import Sources →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSources.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm hover:border-[#004AC1]/30 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004AC1] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">
                        {f.type === 'pdf' ? 'picture_as_pdf' : f.type === 'docx' ? 'article' : 'description'}
                      </span>
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-[#191B23] truncate">{f.name}</h4>
                      <p className="text-[10px] text-[#808191]">
                        {f.size} • {f.chunks?.length || 0} chunks • Added {f.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('citations')}
                      className="px-3 py-1.5 rounded-xl bg-[#F0EFFF] text-[#004AC1] hover:bg-[#E5E2FF] text-xs font-bold transition-all cursor-pointer"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => removeSource(f.id)}
                      className="p-1.5 rounded-xl text-[#808191] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove source"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirm Clear All Modal */}
      {confirmClearModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E0E0FF] p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">delete_sweep</span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#191B23]">Clear All History?</h3>
              <p className="text-xs text-[#5C5D69]">
                This will remove all saved investigation queries and results from your browser's local storage. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setConfirmClearModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#F0EFFF] text-[#5C5D69] hover:text-[#191B23] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllHistory();
                  setConfirmClearModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-sm"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
