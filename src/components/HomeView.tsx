import React, { useState, useEffect } from 'react';
import { NavView } from '../types';

interface HomeViewProps {
  onNavigate: (view: NavView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 25,
        y: (e.clientY - window.innerHeight / 2) / 25,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="space-y-16 pb-20 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-4 lg:pt-8 pb-12 overflow-hidden rounded-3xl bg-gradient-to-b from-[#FAF8FF] via-white to-[#F0EFFF] border border-[#E0E0FF] shadow-sm p-6 lg:p-12">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-[#004AC1]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-[#8343f4]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004AC1]/10 border border-[#004AC1]/20">
              <span className="material-symbols-outlined text-[#004AC1] text-[18px]">verified</span>
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#004AC1] uppercase tracking-wider">
                The Academic Gold Standard
              </span>
            </div>

            <h1 className="font-['Manrope'] text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#191B23] leading-tight tracking-tight">
              Research Smarter with <br className="hidden sm:inline" />
              <span className="text-[#004AC1] italic">
                AI-Powered
              </span> Verified Citations
            </h1>

            <p className="font-['Work_Sans'] text-sm sm:text-base text-[#5C5D69] leading-relaxed max-w-xl">
              Synthesize complex datasets and academic papers with a digital research assistant that maps every claim back to its original source. No hallucinations, just rigorous intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('upload')}
                className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold px-8 py-4 bg-[#004AC1] hover:bg-[#003896] text-white rounded-2xl shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Research</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigate('investigate')}
                className="font-['JetBrains_Mono'] text-xs sm:text-sm font-bold px-8 py-4 bg-white hover:bg-[#FAF8FF] text-[#004AC1] border-2 border-[#004AC1]/20 rounded-2xl shadow-sm hover:border-[#004AC1]/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                <span>View Demo Workspace</span>
              </button>
            </div>

            {/* Social Trust Avatars */}
            <div className="pt-6 border-t border-[#E0E0FF] flex items-center gap-4">
              <div className="flex -space-x-3">
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Researcher" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Analyst" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80" 
                  alt="Academic" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-[#5C5D69] font-['Work_Sans']">
                <span className="font-bold text-[#191B23]">5,000+</span> Researchers & Data Scientists trust Research Agent AI
              </p>
            </div>

          </div>

          {/* Right Column: Hero Graphic */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <div 
              className="relative w-full max-w-lg aspect-square"
              style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
            >
              <img 
                src="/hero-research-agent.svg" 
                alt="AI Research Agent Holographic Diagram"
                className="w-full h-full object-contain drop-shadow-2xl animate-float select-none pointer-events-none"
                loading="eager"
              />

              {/* Floating Glass Overlay Badges */}
              <div className="absolute top-4 left-0 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E0E0FF] shadow-xl flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#004AC1] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#191B23]">Lineage Verified</p>
                  <p className="text-[10px] text-[#004AC1] font-['JetBrains_Mono']">200M+ Articles</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-2 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E0E0FF] shadow-xl flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <div>
                  <p className="text-xs font-extrabold text-[#191B23]">Zero Hallucinations</p>
                  <p className="text-[10px] text-emerald-600 font-bold font-['JetBrains_Mono']">Strict Grounding Active</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Social Proof Section (Trusted Institutions) */}
      <section className="py-8 border-y border-[#E0E0FF] bg-[#F8F7FF]/50 rounded-2xl">
        <p className="text-center font-['JetBrains_Mono'] text-[11px] font-bold text-[#808191] uppercase tracking-[0.2em] mb-6">
          Trusted by Leading Research Institutions
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all font-bold text-sm text-[#4A4B57] tracking-widest font-['JetBrains_Mono']">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">school</span>
            <span>STANFORD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">account_balance</span>
            <span>MIT ACADEMY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">science</span>
            <span>CERN LABS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">psychology</span>
            <span>OXFORD RES</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">public</span>
            <span>NASA ARC</span>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Documents Synthesized', val: '1,000+', icon: 'library_books', color: 'text-blue-600' },
          { label: 'Citation Accuracy Rate', val: '99.4%', icon: 'fact_check', color: 'text-emerald-600' },
          { label: 'Avg Retrieval Latency', val: '1.2s', icon: 'bolt', color: 'text-purple-600' },
          { label: 'Unverified Claims', val: '0%', icon: 'security', color: 'text-indigo-600' },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm flex items-center gap-4 hover:border-[#004AC1]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#F0EFFF] flex items-center justify-center shrink-0">
              <span className={`material-symbols-outlined text-[24px] ${stat.color}`}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#191B23] font-['Manrope']">{stat.val}</p>
              <p className="text-xs text-[#5C5D69] font-medium font-['Work_Sans']">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Bento Grid Features ("Designed for Rigorous Minds") */}
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
              Visualize exactly where every sentence in your generated synthesis comes from. Our dynamic mapping system creates an interactive "source tree" for every document.
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
                  <span>Source [1]: Quantum_Paper.pdf</span>
                </div>
                <div className="pl-4 border-l-2 border-[#C5C4FF] text-[#5C5D69] italic">
                  "...instantaneous qubit state entanglement eliminates Byzantine latency..."
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
              Our proprietary "Truth-Checker" layer cross-references AI outputs with uploaded documents before generation completes.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-emerald-600 font-['JetBrains_Mono']">
              <span>Verified by AI Guardian</span>
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
              Feed the AI anything—PDF papers, Word manuscripts, CSV datasets, or web URLs. We normalize disparate data into a single vector knowledge base.
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
                PRO FEATURE
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

      {/* CTA Section */}
      <section className="p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-[#004AC1] to-[#6366F1] text-white shadow-xl text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-['Manrope']">
          Ready to elevate your research?
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto font-['Work_Sans']">
          Join the thousands of PhDs and data scientists who have found a better way to work with zero hallucinations.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#004AC1] rounded-2xl font-bold text-xs hover:bg-blue-50 shadow-xl transition-all cursor-pointer"
          >
            Create Free Account
          </button>
          <button
            onClick={() => onNavigate('investigate')}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-2xl font-bold text-xs hover:bg-white/10 transition-all cursor-pointer"
          >
            Try Demo Workspace
          </button>
        </div>
      </section>

      {/* Full Footer */}
      <footer className="pt-12 border-t border-[#E0E0FF] text-xs text-[#5C5D69] space-y-8 font-['Work_Sans']">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#004AC1] text-white flex items-center justify-center p-1 shadow-sm">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6C2 4.89543 2.89543 4 4 4H10C11.1046 4 12 4.89543 12 6V18C12 16.8954 11.1046 16 10 16H4C2.89543 16 2 16.8954 2 18V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6C22 4.89543 21.1046 4 20 4H14C12.8954 4 12 4.89543 12 6V18C12 16.8954 12.8954 16 14 16H20C21.1046 16 22 16.8954 22 18V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="15.5" cy="10.5" r="3" fill="#004AC1" stroke="white" strokeWidth="1.5"/>
                  <path d="M17.8 12.8L20.2 15.2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-lg font-extrabold text-[#191B23] font-['Manrope']">Research Agent AI</span>
            </div>
            <p className="text-xs leading-relaxed text-[#5C5D69] max-w-md">
              The world's most trusted AI assistant for academic research and professional data synthesis. Built for rigor, not just speed.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-bold text-[#191B23] uppercase tracking-wider font-['JetBrains_Mono'] text-[11px]">
              Product
            </p>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#004AC1]">Features</button></li>
              <li><button onClick={() => onNavigate('upload')} className="hover:text-[#004AC1]">Import Engine</button></li>
              <li><button onClick={() => onNavigate('investigate')} className="hover:text-[#004AC1]">Workspace</button></li>
              <li><button onClick={() => onNavigate('pipeline')} className="hover:text-[#004AC1]">Neural Pipeline</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-bold text-[#191B23] uppercase tracking-wider font-['JetBrains_Mono'] text-[11px]">
              Company
            </p>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#004AC1]">About System</button></li>
              <li><a href="#" className="hover:text-[#004AC1]">Careers</a></li>
              <li><a href="#" className="hover:text-[#004AC1]">Research Charter</a></li>
              <li><a href="#" className="hover:text-[#004AC1]">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-[#E0E0FF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#808191]">
          <p>© 2026 Research Agent AI / ScholarAI Research Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:underline">Ethical AI Charter</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
