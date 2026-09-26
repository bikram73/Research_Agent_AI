import React, { useState, useRef } from 'react';
import { NavView, SourceFile } from '../types';

interface UploadViewProps {
  onNavigate: (view: NavView) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onNavigate }) => {
  const [sources, setSources] = useState<SourceFile[]>([
    {
      id: '1',
      name: 'Q4_Market_Analysis.pdf',
      size: '4.2 MB',
      type: 'pdf',
      status: 'complete',
      statusText: '100% Embedded',
      date: 'Just now',
    },
    {
      id: '2',
      name: 'Competitive_Landscape.docx',
      size: '1.8 MB',
      type: 'docx',
      status: 'processing',
      progress: 65,
      statusText: 'Chunking & Vectorizing (65%)',
      date: 'Uploading',
    },
    {
      id: '3',
      name: 'Research_Notes_Final.txt',
      size: '450 KB',
      type: 'txt',
      status: 'waiting',
      statusText: 'In Queue',
      date: 'Pending',
    },
  ]);

  const [urlInput, setUrlInput] = useState('');
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUploadedFiles = (files: File[]) => {
    if (files.length === 0) return;

    const newFiles: SourceFile[] = files.map((file, idx) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType: 'pdf' | 'docx' | 'txt' | 'csv' | 'web' = 'txt';
      if (extension === 'pdf') fileType = 'pdf';
      else if (['doc', 'docx'].includes(extension)) fileType = 'docx';
      else if (['csv', 'xls', 'xlsx'].includes(extension)) fileType = 'csv';

      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      return {
        id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        size: formattedSize,
        type: fileType,
        status: 'processing',
        progress: 15,
        statusText: 'Vectorizing document (15%)',
        date: 'Just now',
      };
    });

    setSources((prev) => [...newFiles, ...prev]);
    setUploadSuccess(`Successfully added ${files.length} document${files.length > 1 ? 's' : ''} to queue`);

    setTimeout(() => {
      setUploadSuccess(null);
    }, 4000);

    // Simulate progress animation for new files
    newFiles.forEach((f) => {
      let currentProg = 15;
      const interval = setInterval(() => {
        currentProg += 25;
        if (currentProg >= 100) {
          clearInterval(interval);
          setSources((prev) =>
            prev.map((item) =>
              item.id === f.id
                ? {
                    ...item,
                    status: 'complete',
                    progress: 100,
                    statusText: '100% Embedded & Grounded',
                  }
                : item
            )
          );
        } else {
          setSources((prev) =>
            prev.map((item) =>
              item.id === f.id
                ? {
                    ...item,
                    progress: currentProg,
                    statusText: `Chunking & Vectorizing (${currentProg}%)`,
                  }
                : item
            )
          );
        }
      }, 800);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(Array.from(e.target.files));
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
      processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const newFile: SourceFile = {
      id: Date.now().toString(),
      name: urlInput.replace(/^https?:\/\//, '').slice(0, 32) + '...',
      size: 'Web Article',
      type: 'web',
      status: 'processing',
      progress: 30,
      statusText: 'Scraping & Embedding...',
      url: urlInput,
      date: 'Just now',
    };
    setSources([newFile, ...sources]);
    setUrlInput('');
    setIsAddingUrl(false);
    setUploadSuccess('Web link added to indexing pipeline!');
    setTimeout(() => setUploadSuccess(null), 3000);

    setTimeout(() => {
      setSources((prev) =>
        prev.map((item) =>
          item.id === newFile.id
            ? {
                ...item,
                status: 'complete',
                progress: 100,
                statusText: '100% Scraped & Grounded',
              }
            : item
        )
      );
    }, 2000);
  };

  const handleRemoveSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.txt,.csv,.xls,.xlsx"
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
            Upload research papers, PDF files, documents, or Web URLs to seed the AI grounding index.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#E0E0FF] shadow-sm text-xs font-semibold">
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

      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
            <span>{uploadSuccess}</span>
          </div>
          <button onClick={() => setUploadSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
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
                Supports PDF, DOCX, TXT, CSV (up to 100MB per file)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-[#004AC1] hover:bg-[#003896] text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                <span>Browse Files</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddingUrl(!isAddingUrl)}
                className="px-5 py-2.5 rounded-xl bg-[#F0EFFF] hover:bg-[#E5E2FF] text-[#004AC1] text-xs font-bold transition-all border border-[#C5C4FF] flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">link</span>
                <span>Paste Web Link</span>
              </button>
            </div>
          </div>

          {/* Add Web Link Input Accordion */}
          {isAddingUrl && (
            <div className="p-4 rounded-2xl bg-white border border-[#004AC1]/30 shadow-md space-y-3 animate-fadeIn">
              <label className="text-xs font-bold text-[#191B23]">
                Enter Web Article or ArXiv URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://arxiv.org/abs/2401.00000"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#DCD9FF] text-xs focus:outline-none focus:border-[#004AC1]"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-4 py-2 rounded-xl bg-[#004AC1] text-white text-xs font-bold hover:bg-[#003896] transition-colors"
                >
                  Fetch
                </button>
              </div>
            </div>
          )}

          {/* Pro Tip Box */}
          <div className="p-4 rounded-2xl bg-[#EEECFF] border border-[#D5D1FF] flex items-start gap-3">
            <span className="material-symbols-outlined text-[#004AC1] shrink-0 mt-0.5">lightbulb</span>
            <div className="text-xs space-y-1">
              <p className="font-bold text-[#004AC1]">Pro Tip for Maximum Rigor:</p>
              <p className="text-[#5C5D69]">
                For best vector similarity scoring, ensure PDF documents contain selectable text rather than image-only scans. OCR is automatically performed if needed.
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
              {sources.filter(s => s.status === 'complete').length} / {sources.length} Indexed
            </span>
          </div>

          {/* Sources List */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {sources.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#E0E0FF] text-[#808191] text-xs">
                No documents uploaded yet. Upload a file or URL above to start.
              </div>
            ) : (
              sources.map((file) => (
                <div 
                  key={file.id} 
                  className="p-4 rounded-2xl bg-white border border-[#E0E0FF] shadow-sm space-y-2 hover:border-[#004AC1]/30 transition-all group relative"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-[#F0EFFF] text-[#004AC1] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">
                          {file.type === 'pdf' ? 'picture_as_pdf' : file.type === 'web' ? 'language' : 'description'}
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
                      {file.status === 'processing' && (
                        <span className="text-[10px] font-bold text-[#004AC1] animate-pulse">Vectorizing</span>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(file.id)}
                        className="p-1 rounded-lg hover:bg-red-50 text-[#808191] hover:text-red-600 transition-colors"
                        title="Remove source"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>

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
              disabled={sources.length === 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#004AC1] to-[#6366F1] hover:from-[#003896] hover:to-[#4F46E5] text-white text-xs font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <span>Analyze {sources.length} Sources in Pipeline</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

