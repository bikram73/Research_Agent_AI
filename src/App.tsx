import React, { useState } from 'react';
import { NavView } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, BottomBar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { UploadView } from './components/UploadView';
import { InvestigateView } from './components/InvestigateView';
import { ResultsView } from './components/ResultsView';
import { CitationExplorerView } from './components/CitationExplorerView';
import { PipelineView } from './components/PipelineView';
import { LibraryView } from './components/LibraryView';
import { AboutView } from './components/AboutView';

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('home');

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={setCurrentView} />;
      case 'upload':
        return <UploadView onNavigate={setCurrentView} />;
      case 'investigate':
        return <InvestigateView onNavigate={setCurrentView} />;
      case 'results':
        return <ResultsView onNavigate={setCurrentView} />;
      case 'citations':
        return <CitationExplorerView onNavigate={setCurrentView} />;
      case 'pipeline':
        return <PipelineView onNavigate={setCurrentView} />;
      case 'library':
        return <LibraryView onNavigate={setCurrentView} />;
      case 'about':
        return <AboutView onNavigate={setCurrentView} />;
      default:
        return <HomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#191B23] flex flex-col font-['Inter',sans-serif]">
      {/* Top Navbar */}
      <Navbar currentView={currentView} onNavigate={setCurrentView} />

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomBar currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
}
