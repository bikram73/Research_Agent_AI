import React, { createContext, useContext, useState, useEffect } from 'react';
import { SourceFile, ResearchResult, DocumentChunk, HistoryRecord } from '../types';
import { extractTextFromFile, chunkDocument, synthesizeResearch } from '../services/documentParser';

interface ResearchContextType {
  sources: SourceFile[];
  activeResult: ResearchResult;
  currentQuery: string;
  isProcessing: boolean;
  uploadStatusMessage: string | null;
  history: HistoryRecord[];
  setCurrentQuery: (q: string) => void;
  uploadFiles: (files: File[]) => Promise<void>;
  removeSource: (id: string) => void;
  clearAllSources: () => void;
  loadQATestDataset: () => void;
  runInvestigation: (query?: string) => Promise<ResearchResult>;
  loadHistoryItem: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
  clearAllHistory: () => void;
}

// Controlled Reference Research Dataset for testing & demonstration
export const QA_TEST_DATASET: SourceFile[] = [
  {
    id: 'qa-doc-a',
    name: 'research_basic.pdf',
    size: '4.2 MB',
    type: 'pdf',
    status: 'complete',
    statusText: '100% Indexed (5 Pages, 5 Chunks)',
    date: 'QA Dataset A',
    content: 'Page 1: Project name: Research Agent AI. Page 2: The system uses vector space retrieval. Page 3: The system generates citations. Page 4: The application supports PDF documents. Page 5: The application processes documents locally in browser memory.',
    chunks: [
      {
        id: 'qa-a-1',
        documentId: 'qa-doc-a',
        documentName: 'research_basic.pdf',
        pageOrSection: 'Page 1',
        text: 'Project name: Research Agent AI. An enterprise research intelligence workstation designed for autonomous document ingestion.',
        charStart: 0,
        charEnd: 125,
        score: 0.95,
      },
      {
        id: 'qa-a-2',
        documentId: 'qa-doc-a',
        documentName: 'research_basic.pdf',
        pageOrSection: 'Page 2',
        text: 'The system uses in-memory vector space retrieval and term frequency cosine similarity to match query intent with high accuracy.',
        charStart: 126,
        charEnd: 254,
        score: 0.96,
      },
      {
        id: 'qa-a-3',
        documentId: 'qa-doc-a',
        documentName: 'research_basic.pdf',
        pageOrSection: 'Page 3',
        text: 'The system generates citations linking every synthesized finding to primary originating page references and character offsets.',
        charStart: 255,
        charEnd: 382,
        score: 0.94,
      },
      {
        id: 'qa-a-4',
        documentId: 'qa-doc-a',
        documentName: 'research_basic.pdf',
        pageOrSection: 'Page 4',
        text: 'The application supports PDF documents, Word DOCX files, plain text, Markdown, CSV tables, and JSON data formats.',
        charStart: 383,
        charEnd: 498,
        score: 0.93,
      },
      {
        id: 'qa-a-5',
        documentId: 'qa-doc-a',
        documentName: 'research_basic.pdf',
        pageOrSection: 'Page 5',
        text: 'The application processes documents locally in browser memory, guaranteeing client-side privacy without persistent database storage.',
        charStart: 499,
        charEnd: 633,
        score: 0.92,
      },
    ],
  },
  {
    id: 'qa-doc-b',
    name: 'research_docx.docx',
    size: '1.2 MB',
    type: 'docx',
    status: 'complete',
    statusText: '100% Indexed (2 Chunks)',
    date: 'QA Dataset B',
    content: 'Research Agent AI processes unstructured papers into semantic chunks with rigorous citation verification.',
    chunks: [
      {
        id: 'qa-b-1',
        documentId: 'qa-doc-b',
        documentName: 'research_docx.docx',
        pageOrSection: 'Page 1',
        text: 'Document parsing decomposes unstructured papers into structured semantic chunks with character offset boundaries.',
        charStart: 0,
        charEnd: 114,
        score: 0.91,
      },
      {
        id: 'qa-b-2',
        documentId: 'qa-doc-b',
        documentName: 'research_docx.docx',
        pageOrSection: 'Page 2',
        text: 'Rigorous citation verification traces evidence back to primary originating documents, highlighting exact match quotes.',
        charStart: 115,
        charEnd: 237,
        score: 0.93,
      },
    ],
  },
  {
    id: 'qa-doc-c',
    name: 'research_notes.txt',
    size: '340 KB',
    type: 'txt',
    status: 'complete',
    statusText: '100% Indexed',
    date: 'QA Dataset C',
    content: 'Research Agent AI uses document chunks with character offsets. Citations reference source evidence directly to prevent hallucination.',
    chunks: [
      {
        id: 'qa-c-1',
        documentId: 'qa-doc-c',
        documentName: 'research_notes.txt',
        pageOrSection: 'Page 1',
        text: 'Research Agent AI uses document chunks with character offsets. Citations reference source evidence directly to prevent hallucination.',
        charStart: 0,
        charEnd: 135,
        score: 0.90,
      },
    ],
  },
  {
    id: 'qa-doc-d',
    name: 'research.md',
    size: '180 KB',
    type: 'md',
    status: 'complete',
    statusText: '100% Indexed',
    date: 'QA Dataset D',
    content: '# Research Agent\n## Retrieval\nThe system retrieves relevant document chunks based on vector similarity.\n## Limitations\nScanned PDFs with pure raster images require external OCR.',
    chunks: [
      {
        id: 'qa-d-1',
        documentId: 'qa-doc-d',
        documentName: 'research.md',
        pageOrSection: 'Section 1',
        text: 'The system retrieves relevant document chunks based on vector similarity. Scanned PDFs with pure raster images require external OCR.',
        charStart: 0,
        charEnd: 133,
        score: 0.89,
      },
    ],
  },
  {
    id: 'qa-doc-f',
    name: 'negative_dataset.txt',
    size: '120 KB',
    type: 'txt',
    status: 'complete',
    statusText: '100% Indexed (Negative Control)',
    date: 'QA Dataset F (Negative)',
    content: 'This document discusses culinary recipes, atmospheric weather patterns, and municipal bus routes in rural districts.',
    chunks: [
      {
        id: 'qa-f-1',
        documentId: 'qa-doc-f',
        documentName: 'negative_dataset.txt',
        pageOrSection: 'Page 1',
        text: 'This document discusses culinary recipes, atmospheric weather patterns, and municipal bus routes in rural districts.',
        charStart: 0,
        charEnd: 119,
        score: 0.1,
      },
    ],
  },
];

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with clean empty knowledge base by default (user can load QA dataset on demand)
  const [sources, setSources] = useState<SourceFile[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(null);

  // Search & Investigation History stored in browser LocalStorage (initially empty)
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('research_agent_history_v1');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [activeResult, setActiveResult] = useState<ResearchResult>(() =>
    synthesizeResearch('', [])
  );

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setUploadStatusMessage(`Concurrently processing ${files.length} document${files.length > 1 ? 's' : ''}...`);

    // Process files concurrently with Promise.all
    await Promise.all(
      files.map(async (file, i) => {
        const fileId = `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`;
        const ext = file.name.split('.').pop()?.toLowerCase() || '';

        let fileType: SourceFile['type'] = 'txt';
        if (ext === 'pdf') fileType = 'pdf';
        else if (ext === 'docx') fileType = 'docx';
        else if (ext === 'csv') fileType = 'csv';
        else if (ext === 'md') fileType = 'md';
        else if (ext === 'json') fileType = 'json';
        else if (['html', 'htm'].includes(ext)) fileType = 'html';

        const formattedSize =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.max(1, Math.round(file.size / 1024))} KB`;

        const pendingSource: SourceFile = {
          id: fileId,
          name: file.name,
          size: formattedSize,
          type: fileType,
          status: 'processing',
          progress: 25,
          statusText: 'Reading document layers (25%)...',
          date: 'Just now',
        };

        setSources((prev) => [pendingSource, ...prev]);

        try {
          const { text, pages } = await extractTextFromFile(file);

          setSources((prev) =>
            prev.map((s) =>
              s.id === fileId
                ? { ...s, progress: 60, statusText: `Indexing document passages (${pages.length} pages)...` }
                : s
            )
          );

          const chunks = chunkDocument(fileId, file.name, pages);

          const completeSource: SourceFile = {
            id: fileId,
            name: file.name,
            size: formattedSize,
            type: fileType,
            status: 'complete',
            progress: 100,
            statusText: `100% Indexed (${chunks.length} Chunks, ${pages.length} Pages)`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            content: text,
            chunks,
          };

          setSources((prev) => {
            const updated = prev.map((s) => (s.id === fileId ? completeSource : s));
            if (currentQuery) {
              const newSynth = synthesizeResearch(currentQuery, updated);
              setActiveResult(newSynth);
            }
            return updated;
          });
        } catch (err: any) {
          const errorMsg = err?.message || 'Failed to parse document layer';
          console.error('File parsing error:', file.name, errorMsg);
          setSources((prev) =>
            prev.map((s) =>
              s.id === fileId
                ? {
                    ...s,
                    status: 'error',
                    progress: 0,
                    statusText: errorMsg,
                    errorMessage: errorMsg,
                  }
                : s
            )
          );
          setUploadStatusMessage(`⚠️ Error with "${file.name}": ${errorMsg}`);
        }
      })
    );

    setIsProcessing(false);
    setTimeout(() => setUploadStatusMessage(null), 5000);
  };

  const removeSource = (id: string) => {
    setSources((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      const newSynth = synthesizeResearch(currentQuery, updated);
      setActiveResult(newSynth);
      return updated;
    });
  };

  const clearAllSources = () => {
    setSources([]);
    setActiveResult(synthesizeResearch(currentQuery, []));
    setUploadStatusMessage('All documents removed. Clean 0-state restored.');
    setTimeout(() => setUploadStatusMessage(null), 3000);
  };

  const loadQATestDataset = () => {
    setSources(QA_TEST_DATASET);
    const sampleQuery = 'What technologies, retrieval methods, and citation capabilities are used by Research Agent AI?';
    setCurrentQuery(sampleQuery);
    const synth = synthesizeResearch(sampleQuery, QA_TEST_DATASET);
    setActiveResult(synth);
    setUploadStatusMessage('QA Test Reference Dataset loaded successfully!');
    setTimeout(() => setUploadStatusMessage(null), 3000);
  };

  const loadHistoryItem = (id: string) => {
    const item = history.find((h) => h.id === id);
    if (item) {
      setCurrentQuery(item.query);
      setActiveResult(item.result);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('research_agent_history_v1', JSON.stringify(updated));
        }
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
      return updated;
    });
  };

  const clearAllHistory = () => {
    setHistory([]);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('research_agent_history_v1');
      }
    } catch (err) {
      console.error('LocalStorage remove error:', err);
    }
  };

  const runInvestigation = async (query?: string): Promise<ResearchResult> => {
    const q = (query ?? currentQuery).trim();
    if (!q) {
      throw new Error('Please enter a research query before running an investigation.');
    }
    setCurrentQuery(q);
    setIsProcessing(true);
    const result = synthesizeResearch(q, sources);
    setActiveResult(result);

    // Save to history and persist in LocalStorage
    const newRecord: HistoryRecord = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      query: q,
      title: result.title,
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      confidenceScore: result.confidenceScore,
      findingsCount: result.coreFindings.length,
      citationsCount: result.citations.length,
      sourcesCount: result.groundedSourcesCount,
      isInsufficientContext: result.isInsufficientContext,
      result,
    };

    setHistory((prev) => {
      // Avoid duplicate consecutive identical queries, keep top 100 history items
      const filtered = prev.filter((h) => h.query.toLowerCase() !== q.toLowerCase());
      const updated = [newRecord, ...filtered].slice(0, 100);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('research_agent_history_v1', JSON.stringify(updated));
        }
      } catch (err) {
        console.error('LocalStorage save error:', err);
      }
      return updated;
    });

    setIsProcessing(false);
    return result;
  };

  return (
    <ResearchContext.Provider
      value={{
        sources,
        activeResult,
        currentQuery,
        isProcessing,
        uploadStatusMessage,
        history,
        setCurrentQuery,
        uploadFiles,
        removeSource,
        clearAllSources,
        loadQATestDataset,
        runInvestigation,
        loadHistoryItem,
        deleteHistoryItem,
        clearAllHistory,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};
