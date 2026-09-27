import React, { useState } from 'react';
import { NavView } from '../types';
import { useResearch } from '../context/ResearchContext';

interface ResultsViewProps {
  onNavigate: (view: NavView) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ onNavigate }) => {
  const { activeResult, currentQuery, sources } = useResearch();
  const [insufficientContextSimulated, setInsufficientContextSimulated] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copySuccessToast, setCopySuccessToast] = useState(false);

  const isGuardrailActive = activeResult.isInsufficientContext || insufficientContextSimulated;
  const evidenceSnippets = activeResult.evidenceSnippets;

  const handleCopyClipboard = async () => {
    const textToCopy = `RESEARCH AGENT AI - SYNTHESIS REPORT\n` +
      `Title: ${activeResult.title}\n` +
      `Confidence Score: ${activeResult.confidenceScore}%\n` +
      `Date: ${activeResult.dateGenerated}\n\n` +
      `Abstract Synthesis:\n${activeResult.summary}\n\n` +
      `Core Findings:\n` +
      activeResult.coreFindings.map((cf) => `• ${cf.finding} [Source: ${cf.sourceTitle} | ${cf.page}]`).join('\n') +
      `\n\nCitations:\n` +
      activeResult.citations.map((c, i) => `[${i + 1}] ${c.sourceDocument} (${c.similarityScore}% match): "${c.extractedParagraph.slice(0, 160)}..."`).join('\n');

    await navigator.clipboard.writeText(textToCopy);
    setCopySuccessToast(true);
    setTimeout(() => setCopySuccessToast(false), 2500);
  };

  const handleDownloadExport = (format: 'md' | 'txt' | 'json' | 'pdf') => {
    let content = '';
    let filename = `Research_Synthesis_Report.${format === 'pdf' ? 'html' : format}`;
    let mimeType = 'text/plain;charset=utf-8';

    if (format === 'md') {
      content = `# ${activeResult.title}\n\n` +
        `**Confidence Score:** ${activeResult.confidenceScore}% (Grounded Neural Verification)\n` +
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
    } else if (format === 'json') {
      mimeType = 'application/json;charset=utf-8';
      content = JSON.stringify(activeResult, null, 2);
    } else if (format === 'pdf') {
      // Print/PDF View via HTML Print Container
      filename = `Research_Synthesis_Report_${Date.now()}.html`;
      mimeType = 'text/html;charset=utf-8';
      content = `<!DOCTYPE html><html><head><title>${activeResult.title}</title>
      <style>body{font-family:system-ui,sans-serif;line-height:1.6;padding:40px;max-width:800px;margin:auto;}h1{color:#004AC1;}
      .badge{display:inline-block;padding:4px 8px;background:#e0e0ff;color:#004ac1;border-radius:6px;font-weight:bold;}
      .card{border:1px solid #ddd;padding:16px;border-radius:8px;margin-bottom:16px;}
      @media print{button{display:none;}}</style></head><body>
      <button onclick="window.print()" style="padding:10px 16px;background:#004AC1;color:#fff;border:none;border-radius:8px;cursor:pointer;margin-bottom:20px;">🖨️ Print / Save as PDF</button>
      <h1>${activeResult.title}</h1>
      <p><span class="badge">Confidence: ${activeResult.confidenceScore}%</span> | Generated: ${activeResult.dateGenerated}</p>
      <h2>Abstract Synthesis</h2><p>${activeResult.summary}</p>
      <h2>Core Findings</h2><ul>${activeResult.coreFindings.map(cf => `<li><b>${cf.finding}</b> [${cf.sourceTitle} - ${cf.page}]</li>`).join('')}</ul>
      <h2>Verified Citations</h2><ol>${activeResult.citations.map(c => `<li><b>${c.sourceDocument}</b> (Match: ${c.similarityScore}%): "${c.extractedParagraph}"</li>`).join('')}</ol>
      </body></html>`;
    }

    const blob = new Blob([content], { type: mimeType });
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
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-['JetBrains_Mono'] ${
            isGuardrailActive ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isGuardrailActive ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            {isGuardrailActive ? 'GUARDRAIL VERIFIED' : 'RESEARCH COMPLETE'}
          </span>
          <span className="text-xs text-[#5C5D69]">
            Synthesis Engine v2.4 • Grounded Neural Pipeline
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Missing Info Test Toggle */}
          <button
            onClick={() => setInsufficientContextSimulated(!insufficientContextSimulated)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              insufficientContextSimulated 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-[#FAF8FF] text-[#5C5D69] border-[#E0E0FF] hover:border-[#004AC1]'
            }`}
            title="Toggle simulation of insufficient context query"
          >
            {insufficientContextSimulated ? '⚠️ Guardrail Simulation Active' : '🧪 Test Missing Info'}
          </button>

          <button
            onClick={handleCopyClipboard}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F0EFFF] text-[#191B23] text-xs font-bold transition-all border border-[#E0E0FF] flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Copy report to clipboard"
          >
            <span className="material-symbols-outlined text-[16px] text-[#004AC1]">
              {copySuccessToast ? 'check' : 'content_copy'}
            </span>
            <span>{copySuccessToast ? 'Copied!' : 'Copy'}</span>
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

      {/* Copy Toast Alert */}
      {copySuccessToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Synthesis report and citations copied to clipboard!</span>
        </div>
      )}

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
                className="text-[#808191] hover:text-[#191B23] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#5C5D69]">
              Choose export format for your synthesized research findings and verified citations:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleDownloadExport('pdf')}
                className="w-full p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] hover:border-[#004AC1] hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                  <div>
                    <p className="text-xs font-bold text-[#191B23]">PDF / Printable Report (.html/.pdf)</p>
                    <p className="text-[10px] text-[#808191]">Formatted for academic presentation or PDF export</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-red-600 text-[18px]">download</span>
              </button>

              <button
                onClick={() => handleDownloadExport('md')}
                className="w-full p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] hover:border-[#004AC1] hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer"
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
                className="w-full p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] hover:border-[#004AC1] hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer"
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
                className="w-full p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] hover:border-[#004AC1] hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer"
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

      {/* Insufficient Context Warning Banner (PRD Section 17 & 22) */}
      {isGuardrailActive && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-md space-y-2 text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold font-['JetBrains_Mono']">
            <span className="material-symbols-outlined text-amber-600 text-[20px]">warning</span>
            <span>RAG GROUNDING GUARDRAIL ACTIVE: INSUFFICIENT CONTEXT</span>
          </div>
          <p className="text-xs font-semibold">
            The provided sources do not contain enough information to answer this question. The system has declined to speculate or hallucinate facts not verified in the active document collection.
          </p>
          <p className="text-[11px] text-amber-700">
            To proceed, upload relevant documents containing this topic in the Upload tab or refine your query.
          </p>
        </div>
      )}

      {/* Query Bar */}
      <div className="p-5 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-1">
        <span className="text-[10px] font-bold text-[#808191] uppercase tracking-wider font-['JetBrains_Mono']">
          Active Research Query
        </span>
        <h2 className="text-lg font-bold text-[#191B23] font-['Manrope']">
          {currentQuery}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Abstract Synthesis & Core Findings */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Abstract Synthesis Card */}
          <div className="p-6 lg:p-8 rounded-3xl bg-white border border-[#E0E0FF] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0E0FF] pb-4">
              <div className="flex items-center gap-2 text-[#004AC1]">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
                <h3 className="text-base font-bold text-[#191B23] font-['Manrope']">
                  Executive Research Synthesis
                </h3>
              </div>
              <span className="text-xs text-[#5C5D69] font-['JetBrains_Mono']">
                {activeResult.dateGenerated}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-[#191B23] font-['Work_Sans']">
              {isGuardrailActive 
                ? `The provided sources do not contain enough information to answer this question: "${currentQuery}". No verified evidence or citations exist in the active documents.` 
                : activeResult.summary}
            </p>
          </div>

          {/* Core Findings Accordion */}
          <div className="p-6 lg:p-8 rounded-3xl bg-white border border-[#E0E0FF] shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E0E0FF] pb-3">
              <div className="flex items-center gap-2 text-[#004AC1]">
                <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                <h3 className="text-base font-bold text-[#191B23] font-['Manrope']">
                  Grounded Core Findings ({activeResult.coreFindings.length})
                </h3>
              </div>
              <span className="text-xs text-[#004AC1] font-bold">
                {isGuardrailActive ? '0 Citations' : '100% Citation Grounded'}
              </span>
            </div>

            <div className="space-y-4">
              {activeResult.coreFindings.map((finding, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] hover:border-[#004AC1]/30 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs text-[#191B23] font-medium leading-relaxed">
                      {finding.finding}
                    </p>
                    <span 
                      onClick={() => onNavigate('citations')}
                      className="px-2.5 py-1 rounded-lg bg-blue-100 text-[#004AC1] hover:bg-[#004AC1] hover:text-white text-[10px] font-bold font-['JetBrains_Mono'] shrink-0 cursor-pointer transition-colors"
                      title="Inspect evidence in Citation Explorer"
                    >
                      {finding.citationRef}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#808191] pt-1">
                    <span className="font-semibold text-[#5C5D69]">{finding.sourceTitle}</span>
                    <span className="font-['JetBrains_Mono']">{finding.page}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Score & Grounded Sources */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Confidence Metric Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#808191] uppercase tracking-wider font-['JetBrains_Mono']">
                Grounding Confidence
              </span>
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                {isGuardrailActive ? 'gpp_bad' : 'verified'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#191B23] font-['Manrope']">
                {isGuardrailActive ? '0%' : `${activeResult.confidenceScore}%`}
              </span>
              <span className={`text-xs font-bold ${isGuardrailActive ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isGuardrailActive ? 'Insufficient Evidence' : 'High Neural Grounding'}
              </span>
            </div>

            <p className="text-[11px] text-[#5C5D69] leading-relaxed">
              {isGuardrailActive 
                ? 'Evidence below confidence threshold. System has refused hallucination.' 
                : 'Weighted average cosine similarity score of top retrieved passages against source embeddings.'}
            </p>

            <div className="pt-2 border-t border-[#E0E0FF] space-y-2 text-xs">
              <div className="flex justify-between text-[#5C5D69]">
                <span>Chunks Examined:</span>
                <span className="font-bold text-[#191B23]">{activeResult.totalChunksExamined}</span>
              </div>
              <div className="flex justify-between text-[#5C5D69]">
                <span>Corroborating Sources:</span>
                <span className="font-bold text-[#191B23]">{activeResult.groundedSourcesCount}</span>
              </div>
            </div>
          </div>

          {/* Active Knowledge Sources */}
          <div className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#191B23] uppercase tracking-wider font-['JetBrains_Mono']">
                Grounded Knowledge Sources ({completeSources.length})
              </h4>
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
              Extracted Ground Evidence Snippets ({evidenceSnippets.length})
            </h3>
          </div>
          <span className="text-xs text-[#808191]">Click any card to inspect full passage provenance and offsets</span>
        </div>

        {evidenceSnippets.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-dashed border-[#E0E0FF] text-center text-xs text-[#808191]">
            No evidence snippets found for this inquiry.
          </div>
        ) : (
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
        )}
      </div>

    </div>
  );
};
