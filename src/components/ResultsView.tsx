import React, { useState } from 'react';
import { NavView, EvidenceSnippet } from '../types';

interface ResultsViewProps {
  onNavigate: (view: NavView) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ onNavigate }) => {
  const [insufficientContextMode, setInsufficientContextMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const evidenceSnippets: EvidenceSnippet[] = [
    {
      id: '1',
      sourceNumber: 1,
      sourceTitle: 'Quantum_Consensus_Paper.pdf',
      relevanceTag: 'HIGH RELEVANCE',
      quote: 'Instantaneous qubit state entanglement eliminates traditional Byzantine agreement network latency cycles by 34.8%.',
      location: 'Section 4.2 • Page 14',
      matchScore: 98.2,
    },
    {
      id: '2',
      sourceNumber: 2,
      sourceTitle: 'Market_Infrastructure_Q4.pdf',
      relevanceTag: 'VALIDATED CLAIM',
      quote: 'Energy consumption of quantum consensus nodes decreased by 2.4x compared to Proof-of-Stake validator clusters.',
      location: 'Figure 3.1 • Page 8',
      matchScore: 94.1,
    },
    {
      id: '3',
      sourceNumber: 3,
      sourceTitle: 'Cryptographic_Foundations.docx',
      relevanceTag: 'FOUNDATIONAL EVIDENCE',
      quote: 'No-cloning theorem ensures absolute protection against double-spend attacks without requiring computational proof-of-work.',
      location: 'Paragraph 18 • Page 2',
      matchScore: 91.5,
    },
  ];

  const handleDownloadExport = (format: 'md' | 'txt' | 'json') => {
    let content = '';
    let filename = `Research_Synthesis_Report.${format}`;

    if (format === 'md') {
      content = `# Impact of Quantum Entanglement on Distributed Ledger Consensus\n\n` +
        `**Confidence Score:** 92% (Verified RAG Synthesis)\n` +
        `**Date Generated:** ${new Date().toLocaleDateString()}\n\n` +
        `## Abstract Synthesis\n` +
        `Recent experiments in quantum network infrastructure demonstrate that deploying entangled photon states across distributed consensus nodes fundamentally solves the latency bottleneck inherent in traditional Byzantine Fault Tolerance (BFT) protocols [Source: Quantum_Consensus_Paper.pdf | Page 14].\n\n` +
        `## Core Findings\n` +
        `- Quantum state entanglement reduces block propagation overhead by 34.8%.\n` +
        `- Energy consumption of quantum consensus nodes decreased by 2.4x [Source: Market_Infrastructure_Q4.pdf | Page 8].\n` +
        `- No-cloning theorem guarantees security against 51% attacks [Source: Cryptographic_Foundations.docx | Page 2].\n\n` +
        `## Citations\n` +
        `1. Dr. Elena Rostova et al., "Quantum Entanglement Protocols for BFT", IEEE 2024.\n` +
        `2. Soren Lindqvist et al., "Q4 Enterprise Blockchain & Quantum Infrastructure Benchmarks", 2024.\n`;
    } else if (format === 'txt') {
      content = `RESEARCH AGENT AI - SYNTHESIS REPORT\n=========================================\n\n` +
        `Title: Impact of Quantum Entanglement on Distributed Ledger Consensus\n` +
        `Confidence Score: 92%\n\n` +
        `Synthesis:\nRecent experiments in quantum network infrastructure demonstrate that deploying entangled photon states across distributed consensus nodes fundamentally solves latency bottlenecks.\n\n` +
        `Citations:\n- [Source 1] Quantum_Consensus_Paper.pdf Page 14\n- [Source 2] Market_Infrastructure_Q4.pdf Page 8\n- [Source 3] Cryptographic_Foundations.docx Page 2\n`;
    } else {
      content = JSON.stringify({
        title: "Impact of Quantum Entanglement on Distributed Ledger Consensus",
        confidenceScore: 0.92,
        synthesis: "Recent experiments in quantum network infrastructure demonstrate that deploying entangled photon states across distributed consensus nodes fundamentally solves latency bottlenecks.",
        citations: [
          { id: 1, file: "Quantum_Consensus_Paper.pdf", page: 14, score: 0.982 },
          { id: 2, file: "Market_Infrastructure_Q4.pdf", page: 8, score: 0.941 },
          { id: 3, file: "Cryptographic_Foundations.docx", page: 2, score: 0.915 }
        ]
      }, null, 2);
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
                Impact of Quantum Entanglement on Distributed Ledger Consensus
              </h1>
            </div>

            {/* Synthesized Output Body */}
            {insufficientContextMode ? (
              <div className="p-6 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] space-y-3 text-xs text-[#5C5D69]">
                <p className="font-bold text-[#191B23]">
                  The uploaded sources do not contain enough information to answer this question.
                </p>
                <p>
                  None of the vector-embedded chunks in <code className="text-[#004AC1]">Q4_Market_Analysis.pdf</code> or <code className="text-[#004AC1]">Competitive_Landscape.docx</code> reached the required cosine similarity threshold (0.75) for this question.
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
                
                <p>
                  Recent experiments in quantum network infrastructure demonstrate that deploying entangled photon states across distributed consensus nodes fundamentally solves the latency bottleneck inherent in traditional Byzantine Fault Tolerance (BFT) protocols
                  <button 
                    onClick={() => onNavigate('citations')}
                    className="inline-flex items-center px-1.5 py-0.5 mx-1 rounded bg-[#E0E0FF] hover:bg-[#004AC1] hover:text-white text-[#004AC1] font-extrabold text-[11px] font-['JetBrains_Mono'] transition-all shadow-sm cursor-pointer"
                    title="Source: ArXiv_Quantum_Consensus_Paper.pdf Page 14"
                  >
                    [1]
                  </button>. 
                  By leveraging non-local quantum state collapse, validator nodes can achieve simultaneous block verification without waiting for multiple network round-trips.
                </p>

                {/* Key Finding Highlight Quote Box */}
                <div className="p-5 rounded-2xl bg-[#FAF8FF] border-l-4 border-[#004AC1] space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#004AC1]">
                    <span className="material-symbols-outlined text-[18px]">format_quote</span>
                    <span>Core Empirical Discovery</span>
                  </div>
                  <p className="text-xs font-semibold text-[#191B23] italic leading-normal">
                    "Quantum state entanglement reduces block propagation overhead by 34.8% while maintaining a 0% double-spend probability under adversarial network partition attacks."
                  </p>
                  <p className="text-[10px] text-[#808191] text-right font-['JetBrains_Mono']">
                    — Source Document: ArXiv_Quantum_Consensus_Paper.pdf (Page 14)
                  </p>
                </div>

                <p>
                  Furthermore, empirical testing across a 128-node simulated cluster showed a 2.4x decrease in energy consumption compared to Proof-of-Stake consensus mechanisms
                  <button 
                    onClick={() => onNavigate('citations')}
                    className="inline-flex items-center px-1.5 py-0.5 mx-1 rounded bg-[#E0E0FF] hover:bg-[#004AC1] hover:text-white text-[#004AC1] font-extrabold text-[11px] font-['JetBrains_Mono'] transition-all shadow-sm cursor-pointer"
                    title="Source: Market_Infrastructure_Q4.pdf Page 8"
                  >
                    [2]
                  </button>.
                  The quantum no-cloning theorem provides intrinsic mathematical guarantees against chain reorganization attacks, rendering standard 51% attacks impossible without physically breaking quantum coherence
                  <button 
                    onClick={() => onNavigate('citations')}
                    className="inline-flex items-center px-1.5 py-0.5 mx-1 rounded bg-[#E0E0FF] hover:bg-[#004AC1] hover:text-white text-[#004AC1] font-extrabold text-[11px] font-['JetBrains_Mono'] transition-all shadow-sm cursor-pointer"
                    title="Source: Cryptographic_Foundations.docx Page 2"
                  >
                    [3]
                  </button>.
                </p>

              </div>
            )}

            {/* Metadata Footer */}
            <div className="pt-6 border-t border-[#E0E0FF] flex flex-wrap items-center justify-between text-xs text-[#808191] gap-4">
              <div className="flex items-center gap-4">
                <span>⏱ 12s Synthesis</span>
                <span>•</span>
                <span>📄 2,400 Pages Scanned</span>
                <span>•</span>
                <span>🎯 3 Citations</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onNavigate('citations')}
                  className="text-[#004AC1] font-bold hover:underline flex items-center gap-1"
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
                  Used Sources (3)
                </span>
                <p className="font-bold text-emerald-950">ArXiv_Quantum, Market_Q4, Cryptographic_Docx</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 uppercase font-['JetBrains_Mono']">
                  Unused Sources (1)
                </span>
                <p className="font-bold text-blue-950">Research_Notes_Final.txt (Low similarity)</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <span className="text-[10px] font-bold text-purple-800 uppercase font-['JetBrains_Mono']">
                  Missing Info Detection
                </span>
                <p className="font-bold text-purple-950">Zero Hallucinations Guarantee Active</p>
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
                Visual Abstract
              </h3>
              <span className="text-[10px] text-[#004AC1] font-bold">AI Generated Map</span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#E0E0FF] relative group">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwjPDxOdFz1FwmivBbZ8jZwCTazsmq1pyfmU5ELFynM4FqQ6gV_lwGpIEaX7dW9Cys6MCLc982R7gpml9suPUHUsH08UIQIv2go93lDs110GG9Kmfs80b7pa2bgN-Mfsol_4LB4u3Z2ld6n9JbE-LhZ8fn-XV_zu_G0mutPb1-eDlLKfjDVPr008fcs7O1pZQSs6M96pDMTCEr7cHAi4w217ykdehFDsoR6J_adbYd5FprmKxYSaC-" 
                alt="Quantum Entanglement Visual Abstract" 
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3 text-white text-[11px] font-medium">
                Figure 1.1: Quantum State Superposition in Consensus Topology
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
                className="text-[11px] text-[#004AC1] font-bold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {[
                { num: 1, title: 'Quantum_Consensus_Paper.pdf', score: '98.2%', pages: '42 Pages' },
                { num: 2, title: 'Market_Infrastructure_Q4.pdf', score: '94.1%', pages: '18 Pages' },
                { num: 3, title: 'Cryptographic_Foundations.docx', score: '91.5%', pages: '12 Pages' },
              ].map((src) => (
                <div 
                  key={src.num}
                  onClick={() => onNavigate('citations')}
                  className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#E5E2FF] hover:border-[#004AC1] cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-6 h-6 rounded-lg bg-[#004AC1] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      [{src.num}]
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#191B23] truncate group-hover:text-[#004AC1] transition-colors">
                        {src.title}
                      </p>
                      <p className="text-[10px] text-[#808191]">{src.pages}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                    {src.score} Match
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
