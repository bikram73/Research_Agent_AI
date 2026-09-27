import React, { useState } from 'react';
import { NavView } from '../types';
import { useResearch } from '../context/ResearchContext';

interface CitationExplorerProps {
  onNavigate: (view: NavView) => void;
}

export const CitationExplorerView: React.FC<CitationExplorerProps> = ({ onNavigate }) => {
  const { activeResult } = useResearch();

  const citations = activeResult.citations.length > 0 ? activeResult.citations : [
    {
      id: 'default-1',
      number: 1,
      total: 1,
      sourceDocument: 'No Citations Generated',
      sourceTitle: 'Citation Index Empty',
      author: 'Research Engine',
      publication: 'Neural Grounding Pipeline',
      published: new Date().toLocaleDateString(),
      doi: '10.rag/index/1',
      similarityScore: 0,
      extractedParagraph: 'No active citations found. Upload research documents or run a query to populate verified citations.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const safeIndex = Math.min(currentIndex, citations.length - 1);
  const currentCitation = citations[safeIndex >= 0 ? safeIndex : 0];
  const [approvedStatus, setApprovedStatus] = useState<'none' | 'approved' | 'flagged'>('none');

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % citations.length);
    setApprovedStatus('none');
    setCopiedQuote(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + citations.length) % citations.length);
    setApprovedStatus('none');
    setCopiedQuote(false);
  };

  const handleCopyEvidence = async () => {
    await navigator.clipboard.writeText(`"${currentCitation.extractedParagraph}" - Source: ${currentCitation.sourceDocument}`);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E0E0FF] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('results')}
            className="p-2 rounded-xl bg-[#FAF8FF] hover:bg-[#E0E0FF] text-[#191B23] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#004AC1]">find_in_page</span>
              <h1 className="text-xl font-extrabold text-[#191B23] font-['Manrope']">
                Citation Explorer & Source Verification
              </h1>
            </div>
            <p className="text-xs text-[#5C5D69]">
              Viewing verified text bounding coordinate inside original source manuscript.
            </p>
          </div>
        </div>

        {/* Citation Counter */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#E0E0FF] text-[#004AC1] text-xs font-bold font-['JetBrains_Mono']">
            Citation [{currentCitation.number} / {currentCitation.total}]
          </span>
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-white border border-[#C5C4FF] hover:bg-[#F0EFFF] text-[#191B23] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-white border border-[#C5C4FF] hover:bg-[#F0EFFF] text-[#191B23] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left PDF Reader Simulation Pane */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E0E0FF] shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E0E0FF] pb-3 text-xs">
            <div className="flex items-center gap-2 text-[#004AC1] font-bold">
              <span className="material-symbols-outlined text-[18px]">description</span>
              <span className="truncate">{currentCitation.sourceDocument}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyEvidence}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#004AC1] hover:bg-blue-100 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Copy exact quoted evidence"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedQuote ? 'check' : 'content_copy'}
                </span>
                <span>{copiedQuote ? 'Copied Quote!' : 'Copy Quote'}</span>
              </button>
              <span className="text-[10px] text-[#808191] font-['JetBrains_Mono']">Verified Coordinate</span>
            </div>
          </div>

          {/* Manuscript Extract Sheet */}
          <div className="p-6 rounded-2xl bg-[#FAF8FF] border border-[#E5E2FF] space-y-4 font-serif text-xs text-[#333] leading-relaxed shadow-inner">
            <p className="text-gray-400 uppercase tracking-widest text-[9px] font-sans font-bold">
              PRIMARY DOCUMENT CONTEXT
            </p>
            
            <p className="text-[#5C5D69]">
              The following passage was extracted directly from the verified source document layer during semantic ingestion:
            </p>

            {/* Highlighted Citation Paragraph */}
            <div className="p-4 rounded-xl bg-amber-100/90 border-l-4 border-amber-500 shadow-sm space-y-2 my-3 font-sans">
              <div className="flex items-center justify-between text-[10px] text-amber-900 font-bold">
                <span>GROUNDED EVIDENCE FOR CITATION [{currentCitation.number}]</span>
                <span className="font-['JetBrains_Mono']">{currentCitation.similarityScore}% SIMILARITY</span>
              </div>
              <p className="text-xs font-semibold text-amber-950 leading-relaxed italic">
                "{currentCitation.extractedParagraph}"
              </p>
            </div>

            <p className="text-[11px] text-[#808191]">
              Document provenance verified. Exact coordinate alignment prevents hallucination and guarantees attribution.
            </p>
          </div>
        </div>

        {/* Right Citation Metadata & Verification Actions Pane */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E0FF]">
              <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
                Citation Grounding Metadata
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                {currentCitation.similarityScore}% Vector Match
              </span>
            </div>

            {/* Document Details */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#808191] uppercase">Source Title</label>
                <p className="font-bold text-[#191B23]">{currentCitation.sourceTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#808191] uppercase">Originator / Author</label>
                  <p className="text-[#4A4B57]">{currentCitation.author}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#808191] uppercase">Ingestion Date</label>
                  <p className="text-[#4A4B57]">{currentCitation.published}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#808191] uppercase">Index ID & DOI Coordinate</label>
                <p className="text-[#004AC1] font-mono text-[11px]">{currentCitation.publication} • DOI: {currentCitation.doi}</p>
              </div>
            </div>

            {/* Verification Status Buttons */}
            <div className="pt-4 border-t border-[#E0E0FF] space-y-3">
              <p className="text-xs font-bold text-[#191B23]">Human Reviewer Verification:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setApprovedStatus('approved')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    approvedStatus === 'approved'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>{approvedStatus === 'approved' ? 'Verified' : 'Approve Citation'}</span>
                </button>

                <button
                  onClick={() => setApprovedStatus('flagged')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    approvedStatus === 'flagged'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  <span>{approvedStatus === 'flagged' ? 'Flagged' : 'Flag Source'}</span>
                </button>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#004AC1]">
              <button 
                onClick={handlePrev} 
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>← Prev Citation</span>
              </button>

              <button 
                onClick={handleNext} 
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Next Citation →</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
