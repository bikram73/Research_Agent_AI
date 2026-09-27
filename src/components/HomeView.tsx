import React, { useState } from 'react';
import { NavView } from '../types';
import { useResearch } from '../context/ResearchContext';

interface HomeViewProps {
  onNavigate: (view: NavView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { sources, currentQuery, setCurrentQuery, runInvestigation, isProcessing } = useResearch();
  const [homeQuery, setHomeQuery] = useState(currentQuery || '');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const totalChunks = sources.reduce((acc, s) => acc + (s.chunks?.length || 0), 0);

  const samplePrompts = [
    'What does Research Agent AI do?',
    'What file formats does the system support?',
    'How are citations verified against source documents?',
    'What technologies and processing methods are used across the documents?',
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
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
                Autonomous Grounded Synthesis
              </span>
            </div>

            <h1 className="font-['Manrope'] text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#191B23] leading-tight tracking-tight">
              Research Smarter with <br className="hidden sm:inline" />
              <span className="text-[#004AC1] italic">
                AI-Powered
              </span> Verified Citations
            </h1>

            <p className="font-['Work_Sans'] text-sm sm:text-base text-[#5C5D69] leading-relaxed max-w-xl">
              Synthesize complex datasets and academic papers with a digital research assistant that maps every claim back to its original source. Zero hallucinations, verified paragraph citations.
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
                    className="w-full text-xs sm:text-sm bg-transparent text-[#191B23] placeholder:text-[#808191] focus:outline-none py-1.5 font-['Work_Sans']"
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
                {samplePrompts.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setHomeQuery(prompt);
                      handleExecuteSearch(prompt);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8FF] hover:bg-[#EEECFF] text-[#004AC1] hover:text-[#003896] border border-[#E5E2FF] transition-all text-[11px] truncate max-w-[240px] cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <button
                onClick={() => onNavigate('upload')}
                className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold px-6 py-3.5 bg-[#004AC1] hover:bg-[#003896] text-white rounded-2xl shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>Import Knowledge Base</span>
              </button>

              <button
                onClick={() => onNavigate('investigate')}
                className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold px-6 py-3.5 bg-white hover:bg-[#FAF8FF] text-[#004AC1] border-2 border-[#004AC1]/20 rounded-2xl shadow-sm hover:border-[#004AC1]/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span>Open Workspace</span>
              </button>

              <button
                onClick={() => onNavigate('results')}
                className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold px-6 py-3.5 bg-[#F0EFFF] hover:bg-[#E5E2FF] text-[#004AC1] rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                <span>View Results</span>
              </button>
            </div>

            {/* Social Trust Avatars */}
            <div className="pt-4 border-t border-[#E0E0FF] flex items-center gap-4">
              <div className="flex -space-x-3">
                <img 
                  className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Researcher" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Analyst" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Academic" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-[#5C5D69] font-['Work_Sans']">
                <span className="font-bold text-[#191B23]">5,000+</span> Researchers, Data Scientists & Engineers rely on Research Agent AI
              </p>
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
                    {sources.length} Indexed Sources
                  </p>
                </div>
              </div>

              <div className="absolute bottom-6 right-2 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E0E0FF] shadow-xl flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <div>
                  <p className="text-xs font-extrabold text-[#191B23]">Zero Hallucinations</p>
                  <p className="text-[10px] text-emerald-600 font-bold font-['JetBrains_Mono']">
                    {totalChunks} Semantic Chunks Active
                  </p>
                </div>
              </div>

            </div>
          </div>

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
              <p className="text-xs text-[#5C5D69] font-medium font-['Work_Sans']">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Bento Grid Features */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#004AC1] uppercase tracking-wider font-['JetBrains_Mono']">
            Engineered For Precision
          </span>
          <h2 className="text-2xl lg:text-4xl font-extrabold text-[#191B23] font-['Manrope']">
            Designed for Rigorous Minds
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5D69]">
            Traditional AI models hallucinate. Our multi-agent neural pipeline verifies every claim against your uploaded sources and peer-reviewed journals.
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
            <p className="text-xs text-[#5C5D69] leading-relaxed max-w-md font-['Work_Sans']">
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
            <p className="text-xs text-[#5C5D69] leading-relaxed font-['Work_Sans']">
              Our proprietary Truth-Checker layer cross-references synthesized outputs with uploaded documents before generation completes.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-emerald-600 font-['JetBrains_Mono']">
              <span>Verified by Grounding Guardian</span>
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
            <p className="text-xs text-[#5C5D69] leading-relaxed font-['Work_Sans']">
              Feed the AI anything—PDF papers, Word manuscripts, CSV datasets, Markdown, JSON, or web URLs. We normalize disparate data into a single vector knowledge base.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-[#004AC1] gap-1 group-hover:translate-x-1 transition-transform font-['JetBrains_Mono']">
              <span>Upload Knowledge Base</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </div>
          </div>

          {/* Bento Card 4: Collaborative Lab Spaces */}
          <div 
            onClick={() => onNavigate('investigate')}
            className="md:col-span-8 group cursor-pointer p-8 rounded-3xl bg-gradient-to-r from-[#EEECFF] to-[#FAF8FF] border border-[#D5D1FF] shadow-sm hover:shadow-md hover:border-[#004AC1]/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold font-['JetBrains_Mono']">
                ENTERPRISE ENGINE
              </div>
              <h3 className="text-xl font-bold text-[#191B23] font-['Manrope']">
                Collaborative Lab Spaces
              </h3>
              <p className="text-xs text-[#5C5D69] leading-relaxed max-w-md font-['Work_Sans']">
                Bring your entire research team into a synchronized AI environment. Share collections, annotations, and grounded draft revisions in real time.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
                SR
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
                MK
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs shadow-md">
                AT
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section with Newsletter Signup */}
      <section className="p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-[#004AC1] to-[#6366F1] text-white shadow-xl text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-['Manrope']">
          Ready to elevate your research?
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto font-['Work_Sans']">
          Join thousands of PhDs and data scientists who have found a better way to work with zero hallucinations and authentic citations.
        </p>
        
        {/* Newsletter Subscription Form */}
        <div className="max-w-md mx-auto pt-2">
          {subscribed ? (
            <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-300">check_circle</span>
              <span>You are subscribed to Research Agent AI updates!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your academic or corporate email..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/15 border border-white/30 text-white placeholder:text-blue-100 text-xs focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-white text-[#004AC1] font-bold text-xs hover:bg-blue-50 transition-all cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#004AC1] rounded-2xl font-bold text-xs hover:bg-blue-50 shadow-xl transition-all cursor-pointer"
          >
            Import Knowledge Base
          </button>
          <button
            onClick={() => onNavigate('investigate')}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border-2 border-white/30 text-white rounded-2xl font-bold text-xs hover:bg-white/10 transition-all cursor-pointer"
          >
            Launch Deep Workspace
          </button>
        </div>
      </section>

    </div>
  );
};
