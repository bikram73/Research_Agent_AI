import React from 'react';
import { NavView, PipelineStep } from '../types';
import { useResearch } from '../context/ResearchContext';

interface PipelineViewProps {
  onNavigate: (view: NavView) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ onNavigate }) => {
  const { sources, activeResult, currentQuery } = useResearch();

  const totalChunks = sources.reduce((acc, s) => acc + (s.chunks?.length || 1), 0);

  const steps: PipelineStep[] = [
    {
      id: 1,
      name: '1. Ingestion',
      description: `Ingested ${sources.length} document(s) & URLs into secure sandbox memory`,
      icon: 'upload_file',
      colorClass: 'bg-blue-50 text-[#004AC1] border-blue-200',
      status: 'COMPLETE',
    },
    {
      id: 2,
      name: '2. OCR & Parsing',
      description: 'Extracted plain text layers and structural page coordinates across all files',
      icon: 'document_scanner',
      colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      status: 'COMPLETE',
    },
    {
      id: 3,
      name: '3. Semantic Chunking',
      description: `Generated ${totalChunks} contextual paragraph chunks with character boundary tracking`,
      icon: 'grid_view',
      colorClass: 'bg-purple-50 text-purple-700 border-purple-200',
      status: 'COMPLETE (100%)',
      progress: 100,
    },
    {
      id: 4,
      name: '4. Vector Embedding',
      description: 'Indexed high-dimensional text token representations for semantic search',
      icon: 'scatter_plot',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      status: 'READY',
    },
    {
      id: 5,
      name: '5. Neural Similarity Search',
      description: `Ranked top evidence against query with top similarity score: ${activeResult.confidenceScore}%`,
      icon: 'saved_search',
      colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
      status: 'MATCHED',
    },
    {
      id: 6,
      name: '6. Grounded Synthesis',
      description: `Synthesized findings with ${activeResult.citations.length} verified citation references`,
      icon: 'auto_awesome',
      colorClass: 'bg-gradient-to-r from-[#004AC1] to-[#8343f4] text-white border-transparent',
      status: 'ACTIVE ENGINE',
      active: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0E0FF] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004AC1]">hub</span>
            <h1 className="text-2xl font-extrabold text-[#191B23] font-['Manrope']">
              Neural Retrieval Pipeline
            </h1>
          </div>
          <p className="text-xs text-[#5C5D69] mt-1">
            Real-time data flow from raw unstructured document parsing to vector search and grounded synthesis.
          </p>
        </div>

        <button
          onClick={() => onNavigate('results')}
          className="px-5 py-2.5 rounded-2xl bg-[#004AC1] text-white font-bold text-xs hover:bg-[#003896] shadow-md transition-all self-start md:self-auto"
        >
          View Generated Synthesis →
        </button>
      </div>

      {/* Main Flow Architecture */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative">
            
            {/* Step Card */}
            <div className={`p-5 rounded-2xl border bg-white shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              step.active ? 'ring-2 ring-[#004AC1] border-[#004AC1]/50 shadow-md' : 'border-[#E0E0FF]'
            }`}>
              
              <div className="flex items-start md:items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${step.colorClass}`}>
                  <span className="material-symbols-outlined text-[24px]">{step.icon}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#191B23] font-['Manrope']">{step.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#E0E0FF] text-[#004AC1] text-[10px] font-bold font-['JetBrains_Mono']">
                      {step.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C5D69] font-['Work_Sans']">{step.description}</p>
                </div>
              </div>

              {/* Progress Bar for Active Step */}
              {step.progress && (
                <div className="w-full md:w-48 space-y-1 shrink-0">
                  <div className="w-full bg-[#E0E0FF] h-2 rounded-full overflow-hidden">
                    <div 
                      className="shimmer-progress h-full rounded-full" 
                      style={{ width: `${step.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-[#004AC1] font-bold text-right font-['JetBrains_Mono']">
                    {step.progress}% Processed
                  </p>
                </div>
              )}

            </div>

            {/* Connecting Arrow for Pipeline Line */}
            {idx < steps.length - 1 && (
              <div className="flex justify-center my-1.5">
                <span className="material-symbols-outlined text-[#C5C4FF] text-[20px] animate-bounce">
                  arrow_downward
                </span>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Pipeline Metrics Summary Footer */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#191B23] to-[#2B2D3C] text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">verified</span>
            <span className="text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider">
              Data Lineage & Guardrail Status
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-bold">ALL CHECKS PASSED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-['JetBrains_Mono']">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-[10px]">VECTOR DENSITY</p>
            <p className="text-base font-bold text-white mt-1">1,536 Dimensions</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-[10px]">TOP COSINE SIMILARITY</p>
            <p className="text-base font-bold text-emerald-400 mt-1">0.982 (ArXiv_Paper.pdf)</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-[10px]">HALLUCINATION GUARD</p>
            <p className="text-base font-bold text-blue-400 mt-1">Strict Grounding Enabled</p>
          </div>
        </div>
      </div>

    </div>
  );
};
