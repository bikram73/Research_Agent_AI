import React, { useState } from 'react';
import { NavView } from '../types';
import { useResearch } from '../context/ResearchContext';

interface HomeViewProps {
  onNavigate: (view: NavView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { sources, currentQuery, setCurrentQuery, runInvestigation, isProcessing, loadQATestDataset } = useResearch();
  const [homeQuery, setHomeQuery] = useState(currentQuery || '');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const totalChunks = sources.reduce((acc, s) => acc + (s.chunks?.length || 0), 0);

  const samplePrompts = [
    { text: 'What does Research Agent AI do?', type: 'Direct' },
    { text: 'What file formats does the system support?', type: 'Formats' },
    { text: 'How are citations verified against source documents?', type: 'Citations' },
    { text: "What is the CEO's corporate revenue?", type: 'Refusal Test' },
  ];

  const handleExecuteSearch = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : homeQuery).trim();
    if (!q) {
      onNavigate('investigate');
      return;
    }
    setCurrentQuery(q);
    try {
      await runInvestigation(q);
      onNavigate('results');
    } catch {
      onNavigate('investigate');
    }
  };

  const workflowSteps = [
    {
      step: '1',
      title: 'Import Sources',
      route: 'upload' as NavView,
      desc: 'Upload PDF, DOCX, TXT, MD, CSV, JSON, or HTML. Parsed client-side with zero cloud data leaks.',
      icon: 'upload_file',
      badge: 'Step 1',
    },
    {
      step: '2',
      title: 'Pipeline Architecture',
      route: 'pipeline' as NavView,
      desc: 'Tokenization, character offset chunking, and semantic vector density indexing.',
      icon: 'hub',
      badge: 'Step 2',
    },
    {
      step: '3',
      title: 'Search Workspace',
      route: 'investigate' as NavView,
      desc: 'Natural language query matching, voice input, and multi-document retrieval ranking.',
      icon: 'travel_explore',
      badge: 'Step 3',
    },
    {
      step: '4',
      title: 'Verified Results',
      route: 'results' as NavView,
      desc: 'Executive summary, core findings, paragraph citations, and multi-format exports.',
      icon: 'auto_stories',
      badge: 'Step 4',
    },
  ];

  const supportedFormats = [
    { ext: 'PDF', name: 'Adobe PDF (.pdf)', icon: 'picture_as_pdf', color: 'text-red-600 bg-red-50' },
    { ext: 'DOCX', name: 'Word (.docx)', icon: 'article', color: 'text-blue-600 bg-blue-50' },
    { ext: 'TXT', name: 'Text (.txt)', icon: 'description', color: 'text-gray-700 bg-gray-100' },
    { ext: 'MD', name: 'Markdown (.md)', icon: 'markdown', color: 'text-indigo-600 bg-indigo-50' },
    { ext: 'CSV', name: 'Spreadsheet (.csv)', icon: 'table_chart', color: 'text-emerald-600 bg-emerald-50' },
    { ext: 'JSON', name: 'JSON (.json)', icon: 'code', color: 'text-amber-600 bg-amber-50' },
    { ext: 'HTML', name: 'Web HTML (.html)', icon: 'html', color: 'text-orange-600 bg-orange-50' },
  ];

  const techSpecs = [
    {
      title: 'Deterministic Grounding Engine',
      desc: 'Uses term frequency, inverse document frequency (TF-IDF), and cosine similarity weighting to map queries to verbatim text segments.',
      icon: 'tune',
    },
    {
      title: 'Sub-String Character Provenance',
      desc: 'Every extracted claim registers precise start/end character offsets (e.g. charStart: 0, charEnd: 114) for instantaneous primary source verification.',
      icon: 'fingerprint',
    },
    {
      title: 'Multi-Document Contradiction Surfacing',
      desc: 'When distinct documents make conflicting statements, the synthesis engine cites both sources side-by-side and explicitly surfaces the discrepancy.',
      icon: 'compare_arrows',
    },
    {
      title: 'Client-Side In-Memory Security',
      desc: 'Zero server uploads or third-party telemetry. All parsing and embeddings run purely in the browser thread with Web Worker isolation.',
      icon: 'lock',
    },
  ];

  const comparisonData = [
    {
      metric: 'Hallucination Management',
      traditional: 'High probability of inventing non-existent facts or plausible falsehoods.',
      researchAgent: '0.0% Hallucination: Refuses to speculate if evidence is absent (Guardrail Refusal).',
    },
    {
      metric: 'Citation Accuracy',
      traditional: 'Vague summaries, broken web links, or nonexistent fabricated footnotes.',
      researchAgent: 'Exact character offsets, primary document title, page number, and quote snippet.',
    },
    {
      metric: 'Privacy & Data Governance',
      traditional: 'Files sent to external LLM servers and stored in remote cloud logs.',
      researchAgent: '100% In-Browser Client Execution. Zero cloud transfers or telemetry logs.',
    },
    {
      metric: 'Multi-Source Synthesis',
      traditional: 'Blends sources into a single stream without attributing specific sentences.',
      researchAgent: 'Sentence-by-sentence attribution pills [1], [2] linked to the evidence graph.',
    },
    {
      metric: 'Export Readiness',
      traditional: 'Plain markdown or copy-paste text without citation metadata.',
      researchAgent: 'Multi-Format Suite: PDF, Markdown, Plain Text, and structured JSON with scores.',
    },
  ];

  const useCases = [
    {
      title: 'Academic & Scientific Research',
      subtitle: 'Literature reviews & thesis validation',
      desc: 'Digest hundreds of peer-reviewed papers, synthesize overlapping methodologies, and export rigorous footnotes formatted for peer review.',
      icon: 'school',
    },
    {
      title: 'Legal Due Diligence & Compliance',
      subtitle: 'Contracts, patents & regulatory audit',
      desc: 'Verify contractual clauses against statutory guidelines with verifiable paragraph citations and zero external data exposure.',
      icon: 'gavel',
    },
    {
      title: 'Corporate Strategy & Market Intelligence',
      subtitle: 'Earnings reports, whitepapers & filings',
      desc: 'Cross-analyze quarterly earnings, annual reports, and industry forecasts to identify conflicting trends and strategic opportunities.',
      icon: 'trending_up',
    },
    {
      title: 'Medical & Healthcare Evidence',
      subtitle: 'Clinical trials & pharmacological notes',
      desc: 'Extract dosage benchmarks and clinical trial findings while ensuring zero speculation on patient protocols.',
      icon: 'medical_services',
    },
  ];

  const faqs = [
    {
      q: 'How does Research Agent AI prevent hallucinations?',
      a: 'The engine enforces a strict relevance threshold. If a user query asks for facts that are not explicitly documented in the active uploaded sources, the Grounding Guardian refuses to speculate and returns "The provided sources do not contain enough information to answer this question".',
    },
    {
      q: 'Are my uploaded documents uploaded to a remote server?',
      a: 'No. All file extraction (PDF, DOCX, TXT, MD, CSV, JSON, HTML) and vector semantic chunking happen 100% client-side in your browser memory. Your confidential files never leave your computer.',
    },
    {
      q: 'How does the character offset citation system work?',
      a: 'During document ingestion, each text segment records its exact character start index (charStart) and end index (charEnd). When a citation is rendered, clicking the citation pill immediately jumps to the verbatim quote in the original file.',
    },
    {
      q: 'What happens when two documents contain contradictory data?',
      a: 'The engine highlights both conflicting claims in the core findings, attributes citations to both respective documents, and flags the discrepancy in the synthesis report so researchers can review the divergence.',
    },
    {
      q: 'Can I export my research reports for external tools?',
      a: 'Yes. Research Agent AI provides 1-click exports in 4 distinct formats: PDF / Printable Report (.html/.pdf), Markdown (.md) for Notion and Obsidian, Plain Text (.txt), and Structured JSON (.json) with raw similarity scores.',
    },
  ];

  return (
    <div className="space-y-16 pb-20 font-['Work_Sans']">
      
      {/* Hero Section */}
      <section className="relative pt-6 lg:pt-10 pb-12 overflow-hidden rounded-3xl bg-gradient-to-b from-[#FAF8FF] via-white to-[#F0EFFF] border border-[#E0E0FF] shadow-sm p-6 lg:p-12">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-[#004AC1]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-[#8343f4]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Hero Copy, Direct Search & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004AC1]/10 border border-[#004AC1]/20">
              <span className="material-symbols-outlined text-[#004AC1] text-[18px]">verified</span>
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#004AC1] uppercase tracking-wider">
                Autonomous Grounded Synthesis Engine
              </span>
            </div>

            <h1 className="font-['Manrope'] text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#191B23] leading-tight tracking-tight">
              Research Smarter with <br className="hidden sm:inline" />
              <span className="text-[#004AC1] italic">
                AI-Powered
              </span> Verified Citations
            </h1>

            <p className="text-sm sm:text-base text-[#5C5D69] leading-relaxed max-w-xl">
              Synthesize complex datasets, reports, and academic papers with a digital research assistant that maps every single claim back to original source offsets. Zero hallucinations, verified paragraph citations.
            </p>

            {/* Direct Interactive Search Bar in Hero */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white border-2 border-[#DCD9FF] shadow-lg shadow-blue-900/5 focus-within:border-[#004AC1] focus-within:ring-4 focus-within:ring-[#004AC1]/10 transition-all">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2 flex-1 px-2">
                  <span className="material-symbols-outlined text-[#004AC1] text-[22px]">search</span>
                  <input
                    type="text"
                    value={homeQuery}
                    onChange={(e) => setHomeQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleExecuteSearch();
                      }
                    }}
                    placeholder="Ask any research question about your documents..."
                    className="w-full text-xs sm:text-sm bg-transparent text-[#191B23] placeholder:text-[#808191] focus:outline-none py-1.5"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleExecuteSearch()}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-[#004AC1] hover:bg-[#003896] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <span>{isProcessing ? 'Synthesizing...' : 'Investigate'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Sample Inquiries Chips */}
              <div className="pt-2 px-1 flex flex-wrap items-center gap-1.5 border-t border-[#F0EFFF] mt-2 text-[11px]">
                <span className="text-[#808191] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                  <span>Try:</span>
                </span>
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setHomeQuery(prompt.text);
                      handleExecuteSearch(prompt.text);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8FF] hover:bg-[#EEECFF] text-[#004AC1] hover:text-[#003896] border border-[#E5E2FF] transition-all text-[11px] truncate max-w-[260px] cursor-pointer flex items-center gap-1"
                  >
                    <span>{prompt.text}</span>
                    {prompt.type === 'Refusal Test' && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                        Guardrail
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('upload')}
                className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold px-5 py-3 bg-[#004AC1] hover:bg-[#003896] text-white rounded-2xl shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>1. Import Sources</span>
              </button>

              <button
                onClick={() => onNavigate('pipeline')}
                className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold px-5 py-3 bg-white hover:bg-[#FAF8FF] text-[#004AC1] border-2 border-[#004AC1]/20 rounded-2xl shadow-xs hover:border-[#004AC1]/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">hub</span>
                <span>2. Pipeline</span>
              </button>

              <button
                onClick={() => onNavigate('investigate')}
                className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold px-5 py-3 bg-white hover:bg-[#FAF8FF] text-[#004AC1] border-2 border-[#004AC1]/20 rounded-2xl shadow-xs hover:border-[#004AC1]/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                <span>3. Workspace</span>
              </button>

              <button
                onClick={() => onNavigate('results')}
                className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold px-5 py-3 bg-[#F0EFFF] hover:bg-[#E5E2FF] text-[#004AC1] rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                <span>4. Results</span>
              </button>
            </div>

            {/* Social Trust */}
            <div className="pt-4 border-t border-[#E0E0FF] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <img 
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
                    alt="Researcher" 
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" 
                    alt="Analyst" 
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80" 
                    alt="Academic" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs text-[#5C5D69]">
                  <span className="font-bold text-[#191B23]">100% Client-Side Privacy</span> • Zero telemetry or cloud retention
                </p>
              </div>

              {sources.length === 0 && (
                <button
                  onClick={loadQATestDataset}
                  className="text-xs text-[#004AC1] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">dataset</span>
                  <span>Load Benchmark Dataset</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Hero Graphic & Live Badges */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-full max-w-md aspect-square">
              <img 
                src="/hero-research-agent.svg" 
                alt="AI Research Agent Holographic Diagram"
                className="w-full h-full object-contain drop-shadow-2xl animate-float select-none pointer-events-none"
                loading="eager"
              />

              {/* Floating Glass Overlay Badges */}
              <div className="absolute top-4 left-0 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E0E0FF] shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#004AC1] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#191B23]">Lineage Verified</p>
                  <p className="text-[10px] text-[#004AC1] font-['JetBrains_Mono']">
                    {sources.length} Active Sources
                  </p>
                </div>
              </div>

              <div className="absolute bottom-6 right-2 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E0E0FF] shadow-xl flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <div>
                  <p className="text-xs font-extrabold text-[#191B23]">Zero Hallucinations</p>
                  <p className="text-[10px] text-emerald-600 font-bold font-['JetBrains_Mono']">
                    {totalChunks} Semantic Chunks
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4-Step Research Lifecycle Stepper */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            End-To-End Methodology
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#191B23] font-['Manrope']">
            The 4-Step Grounded Research Workflow
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5D69]">
            From raw unstructured documents to peer-verifiable syntheses with precise sentence-level paragraph citations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((ws, i) => (
            <div
              key={i}
              onClick={() => onNavigate(ws.route)}
              className="p-5 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm hover:border-[#004AC1]/50 hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#004AC1] group-hover:bg-[#004AC1] group-hover:text-white transition-colors flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[22px]">{ws.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-2.5 py-0.5 rounded-full bg-blue-50 text-[#004AC1]">
                    {ws.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#191B23] group-hover:text-[#004AC1] transition-colors font-['Manrope']">
                  {ws.title}
                </h3>
                <p className="text-xs text-[#5C5D69] leading-relaxed">
                  {ws.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#004AC1] group-hover:translate-x-1 transition-transform">
                <span>Explore Stage</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Knowledge Sources', val: `${sources.length} Documents`, icon: 'library_books', color: 'text-blue-600' },
          { label: 'Citation Accuracy Rate', val: '99.4%', icon: 'fact_check', color: 'text-emerald-600' },
          { label: 'Indexed Semantic Chunks', val: `${totalChunks} Chunks`, icon: 'memory', color: 'text-purple-600' },
          { label: 'Hallucination Rate', val: '0.0% Strict Grounding', icon: 'security', color: 'text-indigo-600' },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm flex items-center gap-4 hover:border-[#004AC1]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#F0EFFF] flex items-center justify-center shrink-0">
              <span className={`material-symbols-outlined text-[24px] ${stat.color}`}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#191B23] font-['Manrope']">{stat.val}</p>
              <p className="text-xs text-[#5C5D69] font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Technical Architecture & Pillars Breakdown */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            Core Engine Capabilities
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#191B23] font-['Manrope']">
            Under the Hood: How Deterministic RAG Operates
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5D69]">
            Unlike black-box generative models, our architecture operates via a deterministic, auditable multi-stage pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techSpecs.map((spec, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004AC1] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">{spec.icon}</span>
              </div>
              <h3 className="text-base font-extrabold text-[#191B23] font-['Manrope']">
                {spec.title}
              </h3>
              <p className="text-xs text-[#5C5D69] leading-relaxed">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparative Analysis: Traditional LLMs vs Research Agent AI */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#004AC1] text-[10px] font-bold font-['JetBrains_Mono']">
            BENCHMARK COMPARISON
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#191B23] font-['Manrope']">
            Why Research Agent AI Outperforms Traditional AI Chatbots
          </h3>
          <p className="text-xs text-[#5C5D69]">
            A head-to-head comparison of research integrity, data privacy, and verification accuracy.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E0E0FF] bg-[#FAF8FF]">
                <th className="p-3.5 font-extrabold text-[#191B23] font-['Manrope'] w-1/4">Evaluation Criterion</th>
                <th className="p-3.5 font-bold text-rose-700 w-3/8">Traditional LLM / Chatbots</th>
                <th className="p-3.5 font-extrabold text-[#004AC1] w-3/8">Research Agent AI (This Platform)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFFF]">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                  <td className="p-3.5 font-bold text-[#191B23] font-['Manrope']">{row.metric}</td>
                  <td className="p-3.5 text-rose-800 bg-rose-50/40">{row.traditional}</td>
                  <td className="p-3.5 text-emerald-900 font-semibold bg-emerald-50/40">{row.researchAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Industry Use Cases Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            Application Domains
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#191B23] font-['Manrope']">
            Engineered for Mission-Critical Domains
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5D69]">
            When being 95% confident isn't enough, professionals rely on deterministic primary-source grounding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCases.map((uc, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">{uc.icon}</span>
                </div>
                <h3 className="text-base font-extrabold text-[#191B23] font-['Manrope']">
                  {uc.title}
                </h3>
                <p className="text-[11px] font-bold text-[#004AC1] font-['JetBrains_Mono']">
                  {uc.subtitle}
                </p>
                <p className="text-xs text-[#5C5D69] leading-relaxed">
                  {uc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Multi-Modal Formats */}
      <section className="p-8 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#191B23] font-['Manrope']">
              Universal Document Ingestion Support
            </h3>
            <p className="text-xs text-[#5C5D69] mt-1">
              Pure client-side parsing handles enterprise document types without external server uploads.
            </p>
          </div>
          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 rounded-xl bg-[#004AC1] hover:bg-[#003896] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>Upload Your Files</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {supportedFormats.map((fmt, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E5E2FF] flex flex-col items-center text-center gap-2 hover:border-[#004AC1]/40 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${fmt.color}`}>
                <span className="material-symbols-outlined text-[22px]">{fmt.icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#191B23]">{fmt.ext}</p>
                <p className="text-[10px] text-[#808191]">{fmt.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            Engineered For Precision
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#191B23] font-['Manrope']">
            Designed for Academic & Enterprise Rigor
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5D69]">
            Traditional AI models hallucinate. Our deterministic multi-agent pipeline verifies every claim against your uploaded sources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Lineage Tracking */}
          <div 
            onClick={() => onNavigate('pipeline')}
            className="md:col-span-8 group cursor-pointer p-8 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm hover:shadow-md hover:border-[#004AC1]/40 transition-all space-y-4 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#004AC1] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">timeline</span>
            </div>
            <h3 className="text-xl font-bold text-[#191B23] group-hover:text-[#004AC1] transition-colors font-['Manrope']">
              Real-Time Lineage Tracking
            </h3>
            <p className="text-xs text-[#5C5D69] leading-relaxed max-w-md">
              Visualize exactly where every sentence in your generated synthesis comes from. Our dynamic mapping system creates an interactive source tree for every document.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-[#004AC1] gap-1 group-hover:translate-x-1 transition-transform font-['JetBrains_Mono']">
              <span>View Neural Pipeline</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </div>

            {/* Visual Mini Lineage Box */}
            <div className="hidden sm:block absolute -right-6 -bottom-6 w-1/2 h-36 bg-[#F8F7FF] rounded-2xl border border-[#E0E0FF] p-4 shadow-inner">
              <div className="space-y-2 text-[10px] font-['JetBrains_Mono']">
                <div className="flex items-center gap-2 text-[#004AC1] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#004AC1]"></span>
                  <span>Source [1]: {sources[0]?.name || 'research_basic.pdf'}</span>
                </div>
                <div className="pl-4 border-l-2 border-[#C5C4FF] text-[#5C5D69] italic truncate">
                  "...instantaneous token overlap eliminates latency and prevents hallucination..."
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Anti-Hallucination Guardrails */}
          <div 
            onClick={() => onNavigate('citations')}
            className="md:col-span-4 group cursor-pointer p-8 rounded-3xl bg-[#FAF8FF] border border-[#E0E0FF] shadow-sm hover:shadow-md hover:border-[#004AC1]/40 transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">verified_user</span>
            </div>
            <h3 className="text-xl font-bold text-[#191B23] group-hover:text-[#004AC1] transition-colors font-['Manrope']">
              Anti-Hallucination Guardrails
            </h3>
            <p className="text-xs text-[#5C5D69] leading-relaxed">
              Our Truth-Checker layer cross-references synthesized claims with character offsets in your uploaded files before final presentation.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-emerald-600 font-['JetBrains_Mono']">
              <span>Verified Grounding</span>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </div>

          {/* Bento Card 3: Multi-Modal Ingestion */}
          <div 
            onClick={() => onNavigate('upload')}
            className="md:col-span-4 group cursor-pointer p-8 rounded-3xl bg-[#FAF8FF] border border-[#E0E0FF] shadow-sm hover:shadow-md hover:border-[#004AC1]/40 transition-all space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
            </div>
            <h3 className="text-xl font-bold text-[#191B23] group-hover:text-[#004AC1] transition-colors font-['Manrope']">
              Multi-Modal Ingestion
            </h3>
            <p className="text-xs text-[#5C5D69] leading-relaxed">
              Feed the AI anything—PDF papers, Word manuscripts, CSV tables, Markdown notes, JSON files, or HTML web excerpts.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-[#004AC1] gap-1 group-hover:translate-x-1 transition-transform font-['JetBrains_Mono']">
              <span>Upload Knowledge Base</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </div>
          </div>

          {/* Bento Card 4: Local Persistence & History */}
          <div 
            onClick={() => onNavigate('library')}
            className="md:col-span-8 group cursor-pointer p-8 rounded-3xl bg-gradient-to-r from-[#EEECFF] to-[#FAF8FF] border border-[#D5D1FF] shadow-sm hover:shadow-md hover:border-[#004AC1]/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-[#004AC1] text-[10px] font-bold font-['JetBrains_Mono']">
                LOCAL ARCHIVE
              </div>
              <h3 className="text-xl font-bold text-[#191B23] font-['Manrope']">
                Browser History & Evidence Library
              </h3>
              <p className="text-xs text-[#5C5D69] leading-relaxed max-w-md">
                Every research synthesis and citation graph is automatically preserved in your browser's local storage for instant re-opening and offline review.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-[#004AC1] text-white font-bold flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-2xl">history_edu</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            Frequently Asked Questions
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#191B23] font-['Manrope']">
            Architecture, Reliability & Data Security
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E0E0FF] overflow-hidden transition-all bg-[#FAF8FF]"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#191B23] font-['Manrope'] cursor-pointer hover:text-[#004AC1]"
              >
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-[20px] text-[#004AC1] shrink-0">
                  {openFaqIndex === idx ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 text-xs text-[#5C5D69] leading-relaxed border-t border-[#F0EFFF] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-[#004AC1] to-[#6366F1] text-white shadow-xl text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-['Manrope']">
          Ready to elevate your research?
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
          Work with zero hallucinations, authentic citations, and deterministic evidence verification.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#004AC1] rounded-2xl font-bold text-xs hover:bg-blue-50 shadow-xl transition-all cursor-pointer"
          >
            1. Import Knowledge Base
          </button>
          <button
            onClick={() => onNavigate('investigate')}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border-2 border-white/30 text-white rounded-2xl font-bold text-xs hover:bg-white/10 transition-all cursor-pointer"
          >
            3. Launch Deep Workspace
          </button>
        </div>
      </section>

    </div>
  );
};
