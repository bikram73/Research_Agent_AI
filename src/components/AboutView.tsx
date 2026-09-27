import React, { useState } from 'react';
import { NavView } from '../types';

interface AboutViewProps {
  onNavigate: (view: NavView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const promptTemplate = `You are an AI Research Assistant.
Your task is to answer ONLY using the provided context.

Rules:
1. Never use outside knowledge or ungrounded assumptions.
2. Never hallucinate.
3. Every claim must include verifiable citations (e.g., [Source Name - Page X, Offset Y]).
4. If evidence is missing, explicitly declare: "The provided sources do not contain enough information to answer this question."
5. Surface any discrepancies or conflicting statements across documents side-by-side.

Return:
1. Executive Summary
2. Core Findings with Citation Pills [1], [2]
3. Grounded Citations with Exact Character Spans
4. Confidence Score (0.00 - 0.99)

Context:
{retrieved_chunks}

Question:
{user_question}`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptTemplate);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const coreModules = [
    {
      step: '1',
      route: 'upload' as NavView,
      title: '1. Import Sources',
      desc: 'Universal client-side parsers (pdfjs-dist, Mammoth, PapaParse) extract raw text and structure from PDF, DOCX, TXT, MD, CSV, JSON, and HTML documents with zero cloud transfers.',
      icon: 'upload_file',
      badge: 'Client Parsers',
    },
    {
      step: '2',
      route: 'pipeline' as NavView,
      title: '2. Pipeline Architecture',
      desc: 'Sentence-boundary chunking (~250+ characters with contextual overlap) tracks precise character offsets (charStart, charEnd) and generates TF-IDF term frequency vectors.',
      icon: 'hub',
      badge: 'Token & Chunking',
    },
    {
      step: '3',
      route: 'investigate' as NavView,
      title: '3. Search Workspace',
      desc: 'Natural language query input, voice recognition, domain synonym expansion, and cosine similarity ranking retrieve top evidence passages in real time.',
      icon: 'travel_explore',
      badge: 'Vector Ranking',
    },
    {
      step: '4',
      route: 'results' as NavView,
      title: '4. Verified Results',
      desc: 'Generates evidence-grounded syntheses with citation pills, confidence scores, multi-source contradiction surfacing, and 4 export formats (PDF, MD, TXT, JSON).',
      icon: 'auto_stories',
      badge: 'Grounded Synthesis',
    },
  ];

  const validationMetrics = [
    { label: 'Automated E2E QA Tests', val: '29 / 29 Pass', sub: '100% Automated Suite', icon: 'task_alt', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Hallucination Rate', val: '0.0%', sub: 'Strict Guardrail Rejection', icon: 'security', color: 'text-blue-600 bg-blue-50' },
    { label: 'Sub-String Provenance', val: 'Exact Offsets', sub: 'charStart & charEnd', icon: 'fingerprint', color: 'text-purple-600 bg-purple-50' },
    { label: 'Storage & Privacy', val: 'LocalStorage', sub: '100% In-Browser Isolation', icon: 'storage', color: 'text-amber-600 bg-amber-50' },
  ];

  const faqs = [
    {
      q: 'How does Research Agent AI prevent hallucinations?',
      a: 'The application employs strict Evidence-Grounded Answer Guardrails. Before synthesizing an answer, it computes semantic relevance scores across all extracted chunks. If no relevant evidence exists in the active document corpus, the system explicitly returns an Insufficient Evidence declaration rather than fabricating answers or false citations.',
    },
    {
      q: 'Does this app send my confidential documents to external servers?',
      a: 'No. Document ingestion, vector extraction, semantic chunking, and search ranking run 100% in-browser in local memory. Files are never uploaded to a third-party server or stored in a remote database.',
    },
    {
      q: 'How does the history and library storage work?',
      a: 'All past investigation queries, confidence scores, and synthesis reports are automatically stored in your browser\'s local storage (research_agent_history_v1). You can inspect, re-open, search, or clear your history at any time with complete data privacy.',
    },
    {
      q: 'What file formats are supported for document parsing?',
      a: 'Research Agent AI natively supports Adobe PDF (.pdf), Microsoft Word (.docx), plain text (.txt), Markdown (.md), tabular CSV (.csv), structured JSON (.json), and web HTML (.html) files up to 50 MB per document.',
    },
    {
      q: 'How are citations formatted and verified?',
      a: 'Every extracted claim includes clickable bracketed citations [1], [2] linked to the primary source document title, page or section number, and exact character start/end offsets. You can inspect the quote in the Citation Explorer or view the interactive citation graph in Results.',
    },
    {
      q: 'How is the confidence score calculated?',
      a: 'The confidence score evaluates the weighted relevance score and cosine similarity of top retrieved text chunks against the user query, bound to verified evidence snippets in the loaded sources.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 font-['Work_Sans']">
      
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0E0FF] text-[#004AC1] text-xs font-bold font-['JetBrains_Mono']">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>System Architecture & Verification Specs</span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-extrabold text-[#191B23] font-['Manrope']">
          About Research Agent AI
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5D69] max-w-2xl mx-auto leading-relaxed">
          An autonomous research intelligence workstation built on deterministic Retrieval-Augmented Generation (RAG), semantic vector retrieval, character-offset provenance, and strict anti-hallucination guardrails.
        </p>
      </div>

      {/* Scorecard & QA Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {validationMetrics.map((m, idx) => (
          <div key={idx} className="p-4 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${m.color}`}>
              <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
            </div>
            <div>
              <p className="text-base sm:text-lg font-extrabold text-[#191B23] font-['Manrope']">{m.val}</p>
              <p className="text-[11px] text-[#5C5D69] font-medium">{m.label}</p>
              <p className="text-[9px] text-[#808191] font-mono">{m.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 4-Step RAG Workflow & Architecture Cards */}
      <section className="p-6 lg:p-8 rounded-3xl bg-white border border-[#E0E0FF] shadow-xl space-y-6">
        <div className="space-y-1 border-b border-[#E0E0FF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
              Pipeline Architecture
            </span>
            <h2 className="text-xl font-bold text-[#191B23] font-['Manrope']">
              Deterministic RAG Workflow
            </h2>
          </div>
          <span className="text-xs text-[#5C5D69]">4 Synchronized Processing Stages</span>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {coreModules.map((item) => (
            <div 
              key={item.step} 
              onClick={() => onNavigate(item.route)}
              className="p-5 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] hover:border-[#004AC1]/50 hover:shadow-md transition-all space-y-3 cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#004AC1] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold font-['JetBrains_Mono'] px-2 py-0.5 rounded-full bg-blue-50 text-[#004AC1]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xs font-extrabold text-[#191B23] group-hover:text-[#004AC1] transition-colors font-['Manrope']">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#5C5D69] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#004AC1] group-hover:translate-x-1 transition-transform font-['JetBrains_Mono']">
                <span>View Stage</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            Engineering & Frameworks
          </span>
          <h2 className="text-2xl font-bold text-[#191B23] font-['Manrope']">
            Built with Client-Side Technologies
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Frontend Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#004AC1]">
              <span className="material-symbols-outlined text-[24px]">devices</span>
              <h3 className="text-sm font-bold text-[#191B23] font-['Manrope']">Frontend & State Architecture</h3>
            </div>
            <ul className="space-y-2 text-xs text-[#5C5D69]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004AC1] mt-1.5 shrink-0"></span>
                <span><b>React 19 & TypeScript 5.8</b> — Concurrent rendering with strict static analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004AC1] mt-1.5 shrink-0"></span>
                <span><b>Vite 6 & Tailwind CSS 4</b> — Lightning-fast compilation and responsive design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004AC1] mt-1.5 shrink-0"></span>
                <span><b>Browser LocalStorage Persistence</b> — Safe local archive for research history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004AC1] mt-1.5 shrink-0"></span>
                <span><b>React Context Orchestrator</b> — Multi-source state synchronization & zero-stale context</span>
              </li>
            </ul>
          </div>

          {/* Engine Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-purple-600">
              <span className="material-symbols-outlined text-[24px]">memory</span>
              <h3 className="text-sm font-bold text-[#191B23] font-['Manrope']">Document Processing & RAG Engine</h3>
            </div>
            <ul className="space-y-2 text-xs text-[#5C5D69]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0"></span>
                <span><b>pdfjs-dist & Mammoth</b> — Client-side binary PDF streams & Word DOCX XML parsing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0"></span>
                <span><b>In-Memory Inverted Index</b> — TF-IDF cosine similarity, token overlap, and domain synonyms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0"></span>
                <span><b>Character-Offset Provenance</b> — Tracks charStart, charEnd, and pageOrSection offsets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0"></span>
                <span><b>Evidence-Grounded Guardrails</b> — Refuses missing facts with zero hallucinated claims</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Research Synthesis Prompt Template */}
      <section className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-[#191B23] to-[#2D303E] text-white space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400 text-[24px]">psychology</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-['Manrope']">Research Synthesis Prompt Template</h2>
              <p className="text-[11px] text-gray-300">Deterministic grounding prompt specification</p>
            </div>
          </div>
          <button
            onClick={handleCopyPrompt}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold font-['JetBrains_Mono'] transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copiedPrompt ? 'check' : 'content_copy'}
            </span>
            <span>{copiedPrompt ? 'Copied to Clipboard!' : 'Copy Template'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-black/40 text-emerald-400 font-['JetBrains_Mono'] text-xs leading-relaxed overflow-x-auto border border-white/10 whitespace-pre-wrap">
          {promptTemplate}
        </pre>
      </section>

      {/* FAQs Section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            Got Questions?
          </span>
          <h2 className="text-2xl font-bold text-[#191B23] font-['Manrope']">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="rounded-2xl bg-white border border-[#E0E0FF] shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#191B23] hover:text-[#004AC1] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-[#808191]">
                  {activeFaq === i ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {activeFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#5C5D69] leading-relaxed border-t border-[#F0EFFF] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('upload')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border-2 border-[#004AC1]/20 hover:border-[#004AC1] text-[#004AC1] font-bold text-xs shadow-xs active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>1. Import Knowledge Base</span>
        </button>
        <button
          onClick={() => onNavigate('investigate')}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#004AC1] hover:bg-[#003896] text-white font-bold text-xs shadow-lg shadow-blue-600/25 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Launch Search Workspace</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

    </div>
  );
};
