import React, { useState, useRef } from 'react';
import { NavView } from '../types';
import { useResearch } from '../context/ResearchContext';

interface UploadViewProps {
  onNavigate: (view: NavView) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onNavigate }) => {
  const { 
    sources, 
    uploadFiles, 
    removeSource, 
    clearAllSources, 
    loadQATestDataset, 
    uploadStatusMessage, 
    isProcessing 
  } = useResearch();

  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const completeSources = sources.filter((s) => s.status === 'complete');
  const errorSources = sources.filter((s) => s.status === 'error');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.csv,.md,.json,.html"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004AC1]">upload_file</span>
            <h1 className="text-2xl font-extrabold text-[#191B23] font-['Manrope']">
              Import Knowledge Base
            </h1>
          </div>
          <p className="text-xs text-[#5C5D69] mt-1">
            Upload research papers, PDF files, and multi-format documents to seed the grounding index.
          </p>
        </div>

        {/* Stepper Indicator & QA Dataset Action */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadQATestDataset}
            className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold font-['JetBrains_Mono'] transition-all flex items-center gap-1.5"
            title="Load Documents A, B, C, D, and F specified in PRD Section 6"
          >
            <span className="material-symbols-outlined text-[16px]">science</span>
            <span>Load QA Dataset</span>
          </button>

          {sources.length > 0 && (
            <button
              onClick={clearAllSources}
              className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition-all flex items-center gap-1"
              title="Remove all sources (Test DOC-MULTI-003)"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              <span>Clear All</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#E0E0FF] shadow-sm text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-[#004AC1]">
              <span className="w-5 h-5 rounded-full bg-[#004AC1] text-white text-[10px] flex items-center justify-center font-bold">1</span>
              <span>Upload</span>
            </div>
            <span className="text-[#C5C4FF]">→</span>
            <div className="flex items-center gap-1.5 text-[#808191]">
              <span className="w-5 h-5 rounded-full bg-[#E0E0FF] text-[#5C5D69] text-[10px] flex items-center justify-center font-bold">2</span>
              <span>Pipeline</span>
            </div>
            <span className="text-[#C5C4FF]">→</span>
            <div className="flex items-center gap-1.5 text-[#808191]">
              <span className="w-5 h-5 rounded-full bg-[#E0E0FF] text-[#5C5D69] text-[10px] flex items-center justify-center font-bold">3</span>
              <span>Insights</span>
            </div>
          </div>
        </div>
      </div>

      {uploadStatusMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn ${
          uploadStatusMessage.includes('⚠️') 
            ? 'bg-amber-50 border border-amber-300 text-amber-900' 
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {uploadStatusMessage.includes('⚠️') ? 'warning' : 'check_circle'}
            </span>
            <span>{uploadStatusMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Drag & Drop Zone */}
        <div className="lg:col-span-7 space-y-6">
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center space-y-4 group cursor-pointer shadow-sm ${
              isDragging
                ? 'border-[#004AC1] bg-blue-50/70 scale-[1.01]'
                : 'border-[#004AC1]/30 bg-white/80 hover:bg-white hover:border-[#004AC1]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl bg-blue-50 text-[#004AC1] flex items-center justify-center mx-auto transition-transform ${isDragging ? 'scale-125 bg-blue-100' : 'group-hover:scale-110'}`}>
              <span className="material-symbols-outlined text-[36px]">
                {isDragging ? 'file_download' : 'cloud_upload'}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#191B23]">
                {isDragging ? 'Drop your files here to upload' : 'Drag and drop documents here'}
              </h3>
              <p className="text-xs text-[#5C5D69]">
                Supports PDF, DOCX, TXT, Markdown (.md), CSV, JSON, HTML (up to 50MB per file)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-[#004AC1] hover:bg-[#003896] text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                <span>Select & Upload Files</span>
              </button>
            </div>
          </div>

          {/* Supported Format Specifications Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#E0E0FF] shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#191B23] uppercase tracking-wider font-['JetBrains_Mono']">
              Supported Research Formats (Validated in QA Suite)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-[#FAF8FF] border border-[#E0E0FF] text-center font-medium">
                <span className="font-bold text-[#004AC1]">PDF (.pdf)</span>
                <p className="text-[10px] text-[#808191]">Page stream</p>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF8FF] border border-[#E0E0FF] text-center font-medium">
                <span className="font-bold text-purple-600">DOCX (.docx)</span>
                <p className="text-[10px] text-[#808191]">Paragraphs</p>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF8FF] border border-[#E0E0FF] text-center font-medium">
                <span className="font-bold text-emerald-600">TXT / MD</span>
                <p className="text-[10px] text-[#808191]">Markdown/text</p>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF8FF] border border-[#E0E0FF] text-center font-medium">
                <span className="font-bold text-amber-600">CSV / JSON</span>
                <p className="text-[10px] text-[#808191]">Tabular data</p>
              </div>
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="p-4 rounded-2xl bg-[#EEECFF] border border-[#D5D1FF] flex items-start gap-3">
            <span className="material-symbols-outlined text-[#004AC1] shrink-0 mt-0.5">verified_user</span>
            <div className="text-xs space-y-1">
              <p className="font-bold text-[#004AC1]">Zero Data Leakage Local Processing:</p>
              <p className="text-[#5C5D69]">
                All documents are ingested and chunked entirely in browser memory. No external database or document telemetry is maintained.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Ingestion Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#191B23] font-['Manrope']">
              Processing Queue ({sources.length})
            </h3>
            <span className="text-[11px] text-[#004AC1] font-bold">
              {completeSources.length} / {sources.length} Indexed
            </span>
          </div>

          {/* Sources List */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {sources.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#E0E0FF] text-[#808191] text-xs space-y-2">
                <p>No documents uploaded yet.</p>
                <p className="text-[11px]">Click "Load QA Dataset" above to test pre-configured documents instantly.</p>
              </div>
            ) : (
              sources.map((file) => (
                <div 
                  key={file.id} 
                  className={`p-4 rounded-2xl bg-white border shadow-sm space-y-2 transition-all group relative ${
                    file.status === 'error' ? 'border-red-300 bg-red-50/30' : 'border-[#E0E0FF] hover:border-[#004AC1]/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        file.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-[#F0EFFF] text-[#004AC1]'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">
                          {file.status === 'error' ? 'error' : file.type === 'pdf' ? 'picture_as_pdf' : file.type === 'web' ? 'language' : 'description'}
                        </span>
                      </div>
                      <div className="truncate pr-2">
                        <h4 className="text-xs font-bold text-[#191B23] truncate">{file.name}</h4>
                        <p className="text-[10px] text-[#808191]">{file.size} • {file.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {file.status === 'complete' && (
                        <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
                      )}
                      {file.status === 'error' && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Error</span>
                      )}
                      {file.status === 'processing' && (
                        <span className="text-[10px] font-bold text-[#004AC1] animate-pulse">Vectorizing</span>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => removeSource(file.id)}
                        className="p-1 rounded-lg hover:bg-red-50 text-[#808191] hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove source"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {file.status === 'error' && (
                    <p className="text-[11px] text-red-600 bg-red-100/50 p-2 rounded-xl">
                      {file.errorMessage || file.statusText}
                    </p>
                  )}

                  {/* Progress Bar for Processing */}
                  {file.status === 'processing' && (
                    <div className="space-y-1">
                      <div className="w-full bg-[#E0E0FF] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#004AC1] to-[#8343f4] h-full rounded-full transition-all duration-300" 
                          style={{ width: `${file.progress || 30}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-[#5C5D69] text-right">{file.statusText}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={() => onNavigate('pipeline')}
              disabled={completeSources.length === 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#004AC1] to-[#6366F1] hover:from-[#003896] hover:to-[#4F46E5] text-white text-xs font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <span>Inspect {completeSources.length} Sources in Pipeline</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
