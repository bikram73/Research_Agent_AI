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
1. Never use outside knowledge.
2. Never hallucinate.
3. Every paragraph must include citations (e.g., [Source Name - Page X]).
4. If evidence is missing, explicitly state: "The uploaded documents do not contain sufficient information to answer this question."

Return:
1. Direct Answer
2. Supporting Evidence
3. Citations
4. Confidence Score

Context:
{retrieved_chunks}

Question:
{user_question}`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptTemplate);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const faqs = [
    {
      q: 'How does Research Agent AI avoid hallucinations?',
      a: 'The application employs strict Evidence-Grounded Answer Guardrails. Before synthesizing an answer, it extracts relevant chunks from your uploaded documents, computes semantic relevance scores, and requires verified lexical/semantic matches. If no relevant evidence exists in the document corpus, the system explicitly returns an Insufficient Evidence declaration rather than fabricating answers or false citations.'
    },
    {
      q: 'Does this app store my documents in a database?',
      a: 'No. Document structures, term frequency tables, and parsed text chunks are stored strictly in-memory during your research session. Uploaded document content is processed in browser memory and is not persisted in an application database, ensuring privacy for proprietary academic and business documents.'
    },
    {
      q: 'What file formats are supported for document parsing?',
      a: 'Research Agent AI natively supports PDF files (via pdfjs-dist), Word DOCX files (via Mammoth), plain text (TXT), Markdown (.md), tabular CSV, structured JSON, and HTML documents.'
    },
    {
      q: 'How are citations formatted and linked?',
      a: 'Every finding includes bracketed citations linked to source document titles, page/section references, and exact character offsets. In Citation Explorer, users can inspect the source-derived evidence excerpt and verified Provenance ID.'
    },
    {
      q: 'How is the confidence score calculated?',
      a: 'The confidence score evaluates the weighted relevance score of top retrieved text chunks against the user query, bound to verified evidence snippets in the loaded sources.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 font-['Work_Sans']">
      
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0E0FF] text-[#004AC1] text-xs font-bold font-['JetBrains_Mono']">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>System Architecture & Overview</span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-extrabold text-[#191B23] font-['Manrope']">
          About Research Agent AI
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5D69] max-w-2xl mx-auto">
          An intelligent research workstation powered by Retrieval-Augmented Generation (RAG), semantic vector retrieval, and strict citation grounding.
        </p>
      </div>

      {/* RAG Workflow Diagram / Architecture Cards */}
      <section className="p-6 lg:p-8 rounded-3xl bg-white border border-[#E0E0FF] shadow-xl space-y-6">
        <div className="space-y-1 border-b border-[#E0E0FF] pb-4">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            System Architecture
          </span>
          <h2 className="text-xl font-bold text-[#191B23] font-['Manrope']">
            Retrieval-Augmented Generation (RAG) Workflow
          </h2>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          {[
            { step: '1', title: 'Upload & Ingest', desc: 'Client-side parsers (pdfjs-dist, Mammoth) extract text from PDF, DOCX, TXT, MD, CSV, JSON, HTML.', icon: 'upload_file' },
            { step: '2', title: 'Sentence Chunking', desc: 'Sentence-boundary chunking targeting ~250+ characters tracking page references and character offsets.', icon: 'grid_view' },
            { step: '3', title: 'TF-Vector Search', desc: 'TF-vector cosine similarity and domain synonym expansion retrieve candidate passages in-memory.', icon: 'travel_explore' },
            { step: '4', title: 'Grounded Synthesis', desc: 'Synthesizes findings using verified evidence with Provenance ID attributions and contradiction checks.', icon: 'auto_awesome' },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E0E0FF] space-y-2 relative">
              <div className="w-10 h-10 rounded-xl bg-[#004AC1] text-white flex items-center justify-center mx-auto font-bold text-sm shadow-md">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <h3 className="text-xs font-bold text-[#191B23] font-['Manrope']">{item.title}</h3>
              <p className="text-[11px] text-[#5C5D69] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            Technical Stack
          </span>
          <h2 className="text-2xl font-bold text-[#191B23] font-['Manrope']">
            Built with Rigorous Client-Side Tooling
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
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#004AC1]"></span><b>React 19 & TypeScript 5.8</b> — Concurrent rendering with strict static analysis</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#004AC1]"></span><b>Vite 6 & Tailwind CSS 4</b> — Lightning-fast compilation and utility design</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#004AC1]"></span><b>Lucide Icons & Material Symbols</b> — Unified research UI iconography</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#004AC1]"></span><b>React Context Orchestrator</b> — Zero-stale state management & live sync</li>
            </ul>
          </div>

          {/* Engine Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-purple-600">
              <span className="material-symbols-outlined text-[24px]">memory</span>
              <h3 className="text-sm font-bold text-[#191B23] font-['Manrope']">Document Processing & RAG Engine</h3>
            </div>
            <ul className="space-y-2 text-xs text-[#5C5D69]">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span><b>pdfjs-dist & Mammoth</b> — Client-side PDF page stream & DOCX text extraction</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span><b>In-Memory Inverted Index</b> — Vector cosine similarity and token matching</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span><b>Character-Offset Provenance</b> — Tracks pageOrSection and character spans</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span><b>Evidence-Grounded Guardrails</b> — Rejects unsupported claims with zero false citations</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Research Synthesis Prompt Template */}
      <section className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-[#191B23] to-[#2D303E] text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400 text-[24px]">psychology</span>
            <h2 className="text-lg font-bold font-['Manrope']">Research Synthesis Prompt Template</h2>
          </div>
          <button
            onClick={handleCopyPrompt}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold font-['JetBrains_Mono'] transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copiedPrompt ? 'check' : 'content_copy'}
            </span>
            <span>{copiedPrompt ? 'Copied!' : 'Copy Template'}</span>
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
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#191B23] hover:text-[#004AC1] transition-colors"
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
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('investigate')}
          className="px-8 py-4 rounded-2xl bg-[#004AC1] hover:bg-[#003896] text-white font-bold text-xs shadow-lg shadow-blue-600/25 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span>Launch Research Workspace</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

    </div>
  );
};
