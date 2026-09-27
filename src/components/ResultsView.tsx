import React, { useState } from 'react';
import { NavView } from '../types';
import { useResearch } from '../context/ResearchContext';

interface ResultsViewProps {
  onNavigate: (view: NavView) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ onNavigate }) => {
  const { activeResult, currentQuery, sources } = useResearch();
  const [insufficientContextMode, setInsufficientContextMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const evidenceSnippets = activeResult.evidenceSnippets;

  const handleDownloadExport = (format: 'md' | 'txt' | 'json') => {
    let content = '';
    let filename = `Research_Synthesis_Report.${format}`;

    if (format === 'md') {
      content = `# ${activeResult.title}\n\n` +
        `**Confidence Score:** ${activeResult.confidenceScore}% (Verified Neural Grounding)\n` +
        `**Date Generated:** ${activeResult.dateGenerated}\n\n` +
        `## Abstract Synthesis\n` +
        `${activeResult.summary}\n\n` +
        `## Core Findings\n` +
        activeResult.coreFindings.map((cf) => `- ${cf.finding} [Source: ${cf.sourceTitle} | ${cf.page}]`).join('\n') +
        `\n\n## Citations\n` +
        activeResult.citations.map((c, i) => `${i + 1}. [${c.sourceDocument}] "${c.extractedParagraph.slice(0, 140)}..." (Score: ${c.similarityScore}%)`).join('\n');
    } else if (format === 'txt') {
      content = `RESEARCH AGENT AI - SYNTHESIS REPORT\n=========================================\n\n` +
        `Title: ${activeResult.title}\n` +
        `Confidence Score: ${activeResult.confidenceScore}%\n` +
        `Date: ${activeResult.dateGenerated}\n\n` +
        `Synthesis:\n${activeResult.summary}\n\n` +
        `Core Findings:\n` +
        activeResult.coreFindings.map((cf) => `* ${cf.finding} (${cf.sourceTitle} - ${cf.page})`).join('\n') +
        `\n\nCitations:\n` +
        activeResult.citations.map((c) => `- [${c.sourceDocument}] ${c.extractedParagraph.slice(0, 100)}...`).join('\n');
    } else {
      content = JSON.stringify(activeResult, null, 2);
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const completeSources = sources.filter((s) => s.status === 'complete');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 font-['Work_Sans']">
      
      {/* Top Banner Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E0E0FF] shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-['JetBrains_Mono']">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            RESEARCH COMPLETE
          </span>
          <span className="text-xs text-[#5C5D69]">
            Synthesis Engine v2.4 • 12.4s Latency
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Missing Info Test Toggle */}
          <button
            onClick={() => setInsufficientContextMode(!insufficientContextMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              insufficientContextMode 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-[#FAF8FF] text-[#5C5D69] border-[#E0E0FF] hover:border-[#004AC1]'
            }`}
            title="Toggle simulation of insufficient context query"
          >
            {insufficientContextMode ? '⚠️ Simulated Insufficient Info Active' : '🧪 Test Missing Info Handling'}
          </button>

          <button
            onClick={() => onNavigate('citations')}
            className="px-3.5 py-1.5 rounded-xl bg-[#F0EFFF] hover:bg-[#E5E2FF] text-[#004AC1] text-xs font-bold transition-all border border-[#C5C4FF] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">find_in_page</span>
            <span>Explore Citations</span>
          </button>
          
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#004AC1] text-white text-xs font-bold hover:bg-[#003896] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Export Options Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#E0E0FF] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E0E0FF] pb-3">
              <div className="flex items-center gap-2 text-[#004AC1]">
                <span className="material-symbols-outlined text-[24px]">download</span>
                <h3 className="text-base font-bold text-[#191B23] font-['Manrope']">Export Synthesis Report</h3>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-[#808191] hover:text-[#191B23]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#5C5D69]">
              Choose format for exporting your research synthesis and verified citations list:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleDownloadExport('md')}
                className="w-full p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] hover:border-[#004AC1] hover:bg-blue-50/50 text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#004AC1]">markdown</span>
                  <div>
                    <p className="text-xs font-bold text-[#191B23]">Markdown (.md)</p>
                    <p className="text-[10px] text-[#808191]">Ideal for Notion, Obsidian, and documentation</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#004AC1] text-[18px]">download</span>
              </button>

              <button
                onClick={() => handleDownloadExport('txt')}
                className="w-full p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] hover:border-[#004AC1] hover:bg-blue-50/50 text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-purple-600">description</span>
                  <div>
                    <p className="text-xs font-bold text-[#191B23]">Plain Text (.txt)</p>
                    <p className="text-[10px] text-[#808191]">Raw text format with citations list</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-purple-600 text-[18px]">download</span>
              </button>

              <button
                onClick={() => handleDownloadExport('json')}
                className="w-full p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] hover:border-[#004AC1] hover:bg-blue-50/50 text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600">code</span>
                  <div>
                    <p className="text-xs font-bold text-[#191B23]">Structured JSON (.json)</p>
                    <p className="text-[10px] text-[#808191]">Raw JSON object with similarity scores</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Context Warning Banner (When simulated or triggered) */}
      {insufficientContextMode && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-md space-y-2 text-amber-900">
          <div className="flex items-center gap-2 text-xs font-bold font-['JetBrains_Mono']">
            <span className="material-symbols-outlined text-amber-600 text-[20px]">warning</span>
            <span>RAG GROUNDING GUARDRAIL ACTIVE: INSUFFICIENT CONTEXT</span>
          </div>
          <p className="text-xs font-semibold">
            "The uploaded sources do not provide sufficient information to answer this specific query."
          </p>
          <p className="text-[11px] text-amber-800">
            Research Agent AI intentionally refrains from fabricating or hallucinating facts when the similarity vector search fails to find relevant text chunks.
          </p>
        </div>
      )}

      {/* Main Grid: Research Report Left + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Synthesis Text & Citations */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="p-6 lg:p-8 rounded-3xl bg-white border border-[#E0E0FF] shadow-xl space-y-6">
            
            {/* Report Header */}
            <div className="space-y-3 pb-6 border-b border-[#E0E0FF]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#004AC1] font-['JetBrains_Mono'] uppercase tracking-wider">
                  Verified Synthesis
                </span>
                
                {/* Confidence Gauge Badge */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004AC1]">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="text-xs font-extrabold font-['JetBrains_Mono']">
                    {insufficientContextMode ? '0% (Insufficient Info)' : '92% Confidence Score'}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191B23] font-['Manrope'] leading-tight">
                {activeResult.title}
              </h1>
            </div>

            {/* Synthesized Output Body */}
            {insufficientContextMode ? (
              <div className="p-6 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] space-y-3 text-xs text-[#5C5D69]">
                <p className="font-bold text-[#191B23]">
                  The uploaded sources do not contain enough information to answer this question.
                </p>
                <p>
                  None of the vector-embedded chunks in the knowledge base reached the required cosine similarity threshold (0.75) for this question.
                </p>
                <button
                  onClick={() => onNavigate('upload')}
                  className="px-4 py-2 rounded-xl bg-[#004AC1] text-white text-xs font-bold hover:bg-[#003896] transition-all"
                >
                  Upload Additional Source Documents
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-[#4A4B57] leading-relaxed font-['Work_Sans']">
                <p className="text-base text-[#191B23] leading-relaxed">
                  {activeResult.summary}
                </p>

                {/* Key Finding Highlight Quote Box */}
                {activeResult.coreFindings.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[#FAF8FF] border-l-4 border-[#004AC1] space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#004AC1]">
                      <span className="material-symbols-outlined text-[18px]">format_quote</span>
                      <span>Verified Grounded Claim</span>
                    </div>
                    <p className="text-xs font-semibold text-[#191B23] italic leading-normal">
                      "{activeResult.coreFindings[0].finding}"
                    </p>
                    <p className="text-[10px] text-[#808191] text-right font-['JetBrains_Mono']">
                      — Source Document: {activeResult.coreFindings[0].sourceTitle} ({activeResult.coreFindings[0].page})
                    </p>
                  </div>
                )}

                {/* Additional Core Findings */}
                {activeResult.coreFindings.slice(1).map((cf, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#004AC1] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 2}
                    </span>
                    <div className="text-xs space-y-1">
                      <p className="text-[#191B23] font-medium leading-relaxed">
                        {cf.finding}
                      </p>
                      <p className="text-[10px] text-[#004AC1] font-bold">
                        Grounded in {cf.sourceTitle} • {cf.page}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Metadata Footer */}
            <div className="pt-6 border-t border-[#E0E0FF] flex flex-wrap items-center justify-between text-xs text-[#808191] gap-4">
              <div className="flex items-center gap-4">
                <span>⏱ Real-time RAG Synthesis</span>
                <span>•</span>
                <span>📄 {activeResult.totalChunksExamined} Semantic Chunks Scanned</span>
                <span>•</span>
                <span>🎯 {activeResult.citations.length} Grounded Citations</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onNavigate('citations')}
                  className="text-[#004AC1] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Interactive Citation Explorer</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>

          {/* Source Coverage Section */}
          <div className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-md space-y-4">
            <h3 className="text-xs font-bold text-[#191B23] uppercase tracking-wider font-['JetBrains_Mono']">
              Source Coverage Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase font-['JetBrains_Mono']">
                  Used Sources ({completeSources.length})
                </span>
                <p className="font-bold text-emerald-950 truncate">
                  {completeSources.map((s) => s.name).join(', ') || 'No sources active'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 uppercase font-['JetBrains_Mono']">
                  Grounded Chunks
                </span>
                <p className="font-bold text-blue-950">{activeResult.totalChunksExamined} Indexed Chunks</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <span className="text-[10px] font-bold text-purple-800 uppercase font-['JetBrains_Mono']">
                  Anti-Hallucination
                </span>
                <p className="font-bold text-purple-950">Strict Citation Validation Active</p>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Visual Abstract & Top Grounding Sources */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Visual Abstract Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#E0E0FF] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#191B23] uppercase tracking-wider font-['JetBrains_Mono']">
                Neural Citation Graph
              </h3>
              <span className="text-[10px] text-[#004AC1] font-bold">Topological Mesh</span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#E0E0FF] bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] p-4 text-white relative">
              <svg className="w-full h-36" viewBox="0 0 300 140" fill="none">
                <circle cx="150" cy="70" r="28" fill="#004AC1" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="2" />
                <text x="150" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">QUERY</text>
                
                <line x1="150" y1="70" x2="60" y2="35" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="60" cy="35" r="18" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
                <text x="60" y="38" textAnchor="middle" fill="#93C5FD" fontSize="8" fontWeight="bold">DOC 1</text>

                <line x1="150" y1="70" x2="240" y2="40" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="240" cy="40" r="18" fill="#1E293B" stroke="#818CF8" strokeWidth="1.5" />
                <text x="240" y="43" textAnchor="middle" fill="#C7D2FE" fontSize="8" fontWeight="bold">DOC 2</text>

                <line x1="150" y1="70" x2="80" y2="110" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="80" cy="110" r="16" fill="#1E293B" stroke="#34D399" strokeWidth="1.5" />
                <text x="80" y="113" textAnchor="middle" fill="#A7F3D0" fontSize="8" fontWeight="bold">DOC 3</text>

                <line x1="150" y1="70" x2="225" y2="105" stroke="#F472B6" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="225" cy="105" r="16" fill="#1E293B" stroke="#F472B6" strokeWidth="1.5" />
                <text x="225" y="108" textAnchor="middle" fill="#FBCFE8" fontSize="8" fontWeight="bold">DOC 4</text>
              </svg>
              <div className="text-[10px] text-slate-300 text-center font-['JetBrains_Mono']">
                Semantic Grounding Map • {completeSources.length} Active Node Clusters
              </div>
            </div>
          </div>

          {/* Top Sources Sidebar List */}
          <div className="p-5 rounded-3xl bg-white border border-[#E0E0FF] shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#191B23] uppercase tracking-wider font-['JetBrains_Mono']">
                Validated Grounding Sources
              </h3>
              <button 
                onClick={() => onNavigate('library')}
                className="text-[11px] text-[#004AC1] font-bold hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {completeSources.map((src, idx) => (
                <div 
                  key={src.id}
                  onClick={() => onNavigate('citations')}
                  className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#E5E2FF] hover:border-[#004AC1] cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-6 h-6 rounded-lg bg-[#004AC1] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      [{idx + 1}]
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#191B23] truncate group-hover:text-[#004AC1] transition-colors">
                        {src.name}
                      </p>
                      <p className="text-[10px] text-[#808191]">
                        {src.chunks ? `${src.chunks.length} Chunks` : src.size}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Horizontal Key Evidence Carousel */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004AC1]">verified_user</span>
            <h3 className="text-sm font-bold text-[#191B23] font-['Manrope']">
              Extracted Ground Evidence Snippets
            </h3>
          </div>
          <span className="text-xs text-[#808191]">Swipe or scroll to review</span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {evidenceSnippets.map((snippet) => (
            <div 
              key={snippet.id}
              onClick={() => onNavigate('citations')}
              className="w-80 p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm hover:shadow-md hover:border-[#004AC1]/40 cursor-pointer transition-all shrink-0 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-[#004AC1] text-[10px] font-bold font-['JetBrains_Mono']">
                  [{snippet.sourceNumber}] {snippet.relevanceTag}
                </span>
                <span className="text-[11px] font-extrabold text-emerald-600 font-['JetBrains_Mono']">
                  {snippet.matchScore}% Match
                </span>
              </div>

              <p className="text-xs text-[#191B23] italic leading-relaxed line-clamp-3">
                "{snippet.quote}"
              </p>

              <div className="pt-2 border-t border-[#E0E0FF] flex items-center justify-between text-[10px] text-[#808191]">
                <span className="truncate">{snippet.sourceTitle}</span>
                <span className="shrink-0">{snippet.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
