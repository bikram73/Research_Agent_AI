import React, { useState, useRef } from 'react';
import { NavView } from '../types';
import { useResearch } from '../context/ResearchContext';

interface InvestigateViewProps {
  onNavigate: (view: NavView) => void;
}

export const InvestigateView: React.FC<InvestigateViewProps> = ({ onNavigate }) => {
  const {
    sources,
    currentQuery,
    setCurrentQuery,
    uploadFiles,
    runInvestigation,
    isProcessing,
    activeResult,
  } = useResearch();

  const [isListening, setIsListening] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(true);

  const attachInputRef = useRef<HTMLInputElement>(null);

  const suggestedTopics = [
    'Impact of Quantum Entanglement on Distributed Ledger Consensus',
    'Summarize Q4 Market Growth Drivers for AI Infrastructure',
    'How does Neural RAG eliminate LLM hallucination?',
    'Synthesize competitive benchmarks between Claude & Gemini',
  ];

  const handleSelectTopic = (topic: string) => {
    setCurrentQuery(topic);
  };

  const handleRunSearch = async () => {
    await runInvestigation(currentQuery);
    onNavigate('results');
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setCurrentQuery(
          (prev) => prev + (prev ? ' ' : '') + 'Evaluating Byzantine fault tolerance in quantum networks.'
        );
        setIsListening(false);
      }, 3000);
    }
  };

  const completeSources = sources.filter((s) => s.status === 'complete');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <input
        ref={attachInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.txt,.csv,.xls,.xlsx,.md,.json"
        className="hidden"
        onChange={handleFileAttach}
      />

      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0E0FF] text-[#004AC1] text-xs font-bold font-['JetBrains_Mono']">
          <span className="w-2 h-2 rounded-full bg-[#004AC1]"></span>
          <span>Deep Research Workspace</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-[#191B23] font-['Manrope']">
          What would you like to investigate today?
        </h1>
        <p className="text-xs text-[#5C5D69] max-w-xl mx-auto">
          Query your multi-modal document index. Responses will be grounded with exact paragraph citation overlays.
        </p>
      </div>

      {/* Main Research Input Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-xl space-y-4 relative">
        <div className="relative space-y-3">
          <textarea
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
            placeholder="Ask any research question about your uploaded documents..."
            rows={4}
            className="w-full p-4 rounded-2xl bg-[#FAF8FF] border border-[#DCD9FF] text-sm text-[#191B23] focus:outline-none focus:border-[#004AC1] focus:ring-2 focus:ring-[#004AC1]/20 font-['Work_Sans'] resize-none"
          />

          {/* Active indexed files summary */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {sources.slice(0, 5).map((f) => (
              <div
                key={f.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[#004AC1] text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {f.type === 'pdf' ? 'picture_as_pdf' : f.type === 'web' ? 'language' : 'description'}
                </span>
                <span className="truncate max-w-[180px]">{f.name}</span>
                <span className="text-[10px] text-blue-500">
                  {f.chunks ? `(${f.chunks.length} chunks)` : `(${f.size})`}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Bar inside Input */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#5C5D69]">
              <button
                type="button"
                onClick={() => attachInputRef.current?.click()}
                disabled={isProcessing}
                className="p-2 px-3 rounded-xl bg-white border border-[#E0E0FF] hover:bg-[#F0EFFF] hover:border-[#004AC1]/40 transition-colors flex items-center gap-1.5 font-medium cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px] text-[#004AC1]">attach_file</span>
                <span>{isProcessing ? 'Processing File...' : 'Attach Document'}</span>
              </button>

              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-2 px-3 rounded-xl border transition-colors flex items-center gap-1.5 font-medium cursor-pointer ${
                  isListening
                    ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                    : 'bg-white border-[#E0E0FF] hover:bg-[#F0EFFF]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-[#004AC1]">
                  {isListening ? 'mic_active' : 'mic'}
                </span>
                <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
              </button>

              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-[11px]">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>Neural Retrieval & Grounding</span>
              </div>
            </div>

            <button
              onClick={handleRunSearch}
              disabled={isProcessing || !currentQuery.trim()}
              className="px-6 py-3 rounded-2xl bg-[#004AC1] hover:bg-[#003896] text-white text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isProcessing ? 'Synthesizing...' : 'Ask Research Agent AI'}</span>
              <span className="material-symbols-outlined text-[18px]">
                {isProcessing ? 'sync' : 'auto_awesome'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Topics Pills */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-[#808191] uppercase tracking-wider font-['JetBrains_Mono']">
          Suggested Research Questions
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSelectTopic(topic)}
              className="px-4 py-2 rounded-xl bg-white border border-[#E0E0FF] hover:border-[#004AC1] hover:text-[#004AC1] text-xs font-medium text-[#4A4B57] transition-all text-left shadow-sm active:scale-98"
            >
              🔍 {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Section 1: Uploaded Sources */}
      <div className="rounded-2xl bg-white border border-[#E0E0FF] shadow-sm overflow-hidden">
        <button
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className="w-full px-5 py-3.5 bg-[#F8F7FF] flex items-center justify-between text-xs font-bold text-[#191B23]"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004AC1]">library_books</span>
            <span>
              Active Grounding Sources ({completeSources.length} Documents Indexed)
            </span>
          </div>
          <span className="material-symbols-outlined text-[#808191]">
            {sourcesOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {sourcesOpen && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sources.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E5E2FF] flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-[#004AC1] text-[20px]">
                  {doc.type === 'pdf' ? 'picture_as_pdf' : doc.type === 'web' ? 'language' : 'description'}
                </span>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#191B23] truncate">{doc.name}</p>
                  <p className="text-[10px] text-[#808191]">
                    {doc.type.toUpperCase()} • {doc.chunks ? `${doc.chunks.length} Chunks` : doc.size}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collapsible Section 2: Retrieval Preview */}
      <div className="rounded-2xl bg-white border border-[#E0E0FF] shadow-sm overflow-hidden">
        <button
          onClick={() => setPreviewOpen(!previewOpen)}
          className="w-full px-5 py-3.5 bg-[#F8F7FF] flex items-center justify-between text-xs font-bold text-[#191B23]"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600">manage_search</span>
            <span>
              Vector Retrieval Match Preview ({activeResult.evidenceSnippets.length} Matches Found)
            </span>
          </div>
          <span className="material-symbols-outlined text-[#808191]">
            {previewOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {previewOpen && (
          <div className="p-4 space-y-3 text-xs">
            {activeResult.evidenceSnippets.length === 0 ? (
              <p className="text-xs text-[#808191] italic">
                Upload a document or ask a question to see real-time vector matches here.
              </p>
            ) : (
              activeResult.evidenceSnippets.slice(0, 3).map((snippet, idx) => (
                <div
                  key={snippet.id || idx}
                  className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">
                      Source [{snippet.sourceNumber}]: {snippet.sourceTitle} ({snippet.location})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-800 text-[10px] font-bold">
                      {snippet.matchScore}% Similarity
                    </span>
                  </div>
                  <p className="text-[#5C5D69] italic">
                    "{snippet.quote}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
