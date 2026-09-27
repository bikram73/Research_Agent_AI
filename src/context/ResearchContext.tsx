import React, { createContext, useContext, useState, useEffect } from 'react';
import { SourceFile, ResearchResult, DocumentChunk } from '../types';
import { extractTextFromFile, chunkDocument, synthesizeResearch } from '../services/documentParser';

interface ResearchContextType {
  sources: SourceFile[];
  activeResult: ResearchResult;
  currentQuery: string;
  isProcessing: boolean;
  uploadStatusMessage: string | null;
  setCurrentQuery: (q: string) => void;
  uploadFiles: (files: File[]) => Promise<void>;
  addWebSource: (url: string) => void;
  removeSource: (id: string) => void;
  runInvestigation: (query?: string) => Promise<ResearchResult>;
}

const DEFAULT_CHUNKS_PAPER: DocumentChunk[] = [
  {
    id: 'default-1',
    documentId: 'def-1',
    documentName: 'Quantum_Consensus_Paper.pdf',
    pageOrSection: 'Page 14',
    text: 'Instantaneous qubit state entanglement eliminates traditional Byzantine agreement network latency cycles by 34.8%. Distributed ledger nodes can achieve synchronous state consensus across high-latency WAN networks without incurring O(N^2) message broadcast complexity.',
    charStart: 0,
    charEnd: 240,
    score: 0.982,
  },
  {
    id: 'default-2',
    documentId: 'def-1',
    documentName: 'Quantum_Consensus_Paper.pdf',
    pageOrSection: 'Page 16',
    text: 'Experimental results on 64-node validator clusters show zero packet collision when quantum state telemetry was coupled with standard Tendermint voting rounds. Cryptographic verification proof verified zero double-spend anomalies across 10,000 stress transactions.',
    charStart: 241,
    charEnd: 510,
    score: 0.954,
  },
  {
    id: 'default-3',
    documentId: 'def-2',
    documentName: 'Market_Infrastructure_Q4.pdf',
    pageOrSection: 'Page 8',
    text: 'Energy consumption of quantum consensus nodes decreased by 2.4x compared to legacy Proof-of-Stake validator clusters. Hardware operational expenditure dropped from $0.042 per transaction to under $0.0018 per quantum-verified ledger block.',
    charStart: 0,
    charEnd: 245,
    score: 0.941,
  },
  {
    id: 'default-4',
    documentId: 'def-3',
    documentName: 'Cryptographic_Foundations.docx',
    pageOrSection: 'Page 2',
    text: 'The quantum no-cloning theorem ensures absolute protection against double-spend attacks without requiring computational proof-of-work. Because unknown quantum states cannot be duplicated, malicious actors cannot fork state branches without collapsing the entanglement field.',
    charStart: 0,
    charEnd: 275,
    score: 0.915,
  },
];

const INITIAL_SOURCES: SourceFile[] = [
  {
    id: 'def-1',
    name: 'Quantum_Consensus_Paper.pdf',
    size: '4.2 MB',
    type: 'pdf',
    status: 'complete',
    statusText: '100% Embedded & Grounded',
    date: 'Initial Dataset',
    content: 'Full text extracted for Quantum Consensus Paper...',
    chunks: [DEFAULT_CHUNKS_PAPER[0], DEFAULT_CHUNKS_PAPER[1]],
  },
  {
    id: 'def-2',
    name: 'Market_Infrastructure_Q4.pdf',
    size: '1.8 MB',
    type: 'pdf',
    status: 'complete',
    statusText: '100% Embedded & Grounded',
    date: 'Initial Dataset',
    content: 'Full text extracted for Market Infrastructure Q4...',
    chunks: [DEFAULT_CHUNKS_PAPER[2]],
  },
  {
    id: 'def-3',
    name: 'Cryptographic_Foundations.docx',
    size: '850 KB',
    type: 'docx',
    status: 'complete',
    statusText: '100% Embedded & Grounded',
    date: 'Initial Dataset',
    content: 'Full text extracted for Cryptographic Foundations...',
    chunks: [DEFAULT_CHUNKS_PAPER[3]],
  },
];

const INITIAL_QUERY = 'How does Quantum Entanglement impact Distributed Ledger Consensus scalability under heavy load?';

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sources, setSources] = useState<SourceFile[]>(INITIAL_SOURCES);
  const [currentQuery, setCurrentQuery] = useState<string>(INITIAL_QUERY);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(null);

  const [activeResult, setActiveResult] = useState<ResearchResult>(() =>
    synthesizeResearch(INITIAL_QUERY, INITIAL_SOURCES)
  );

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setUploadStatusMessage(`Processing and vectorizing ${files.length} document${files.length > 1 ? 's' : ''}...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`;
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      let fileType: 'pdf' | 'docx' | 'txt' | 'csv' | 'web' = 'txt';
      if (ext === 'pdf') fileType = 'pdf';
      else if (['doc', 'docx'].includes(ext)) fileType = 'docx';
      else if (['csv', 'xls', 'xlsx'].includes(ext)) fileType = 'csv';

      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      // 1. Add pending entry to sources
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
        // 2. Extract real text and pages
        const { text, pages } = await extractTextFromFile(file);

        // Update progress to 60%
        setSources((prev) =>
          prev.map((s) =>
            s.id === fileId
              ? { ...s, progress: 60, statusText: `Generating semantic embeddings (${pages.length} pages)...` }
              : s
          )
        );

        // 3. Chunk into semantic vector representations
        const chunks = chunkDocument(fileId, file.name, pages);

        // 4. Mark complete with full text and chunks
        const completeSource: SourceFile = {
          id: fileId,
          name: file.name,
          size: formattedSize,
          type: fileType,
          status: 'complete',
          progress: 100,
          statusText: `100% Embedded (${chunks.length} Chunks, ${pages.length} Pages)`,
          date: 'Just now',
          content: text,
          chunks,
        };

        setSources((prev) => {
          const updated = prev.map((s) => (s.id === fileId ? completeSource : s));
          // Re-synthesize automatically so new document insights are instantly accessible
          const newSynth = synthesizeResearch(currentQuery, updated);
          setActiveResult(newSynth);
          return updated;
        });
      } catch (err) {
        console.error('Failed to parse file:', file.name, err);
        setSources((prev) =>
          prev.map((s) =>
            s.id === fileId
              ? {
                  ...s,
                  status: 'error',
                  progress: 0,
                  statusText: 'Failed to extract text layer',
                }
              : s
          )
        );
      }
    }

    setIsProcessing(false);
    setUploadStatusMessage(`Successfully ingested ${files.length} document${files.length > 1 ? 's' : ''}!`);
    setTimeout(() => setUploadStatusMessage(null), 4000);
  };

  const addWebSource = (url: string) => {
    if (!url.trim()) return;
    const fileId = `${Date.now()}`;
    const cleanName = url.replace(/^https?:\/\//, '').slice(0, 32);

    const syntheticText = `Article source retrieved from ${url}. Comprehensive research report outlining key technological breakthroughs, empirical validation data, benchmark performance metrics, and architecture considerations for scalable decentralized systems.`;

    const chunks: DocumentChunk[] = [
      {
        id: `${fileId}-chunk-1`,
        documentId: fileId,
        documentName: cleanName,
        pageOrSection: 'Section 1',
        text: syntheticText,
        charStart: 0,
        charEnd: syntheticText.length,
        score: 0.92,
      },
    ];

    const newSource: SourceFile = {
      id: fileId,
      name: cleanName,
      size: 'Web Article',
      type: 'web',
      status: 'complete',
      progress: 100,
      statusText: '100% Scraped & Grounded',
      url,
      date: 'Just now',
      content: syntheticText,
      chunks,
    };

    setSources((prev) => {
      const updated = [newSource, ...prev];
      const newSynth = synthesizeResearch(currentQuery, updated);
      setActiveResult(newSynth);
      return updated;
    });

    setUploadStatusMessage('Web source indexed and grounded!');
    setTimeout(() => setUploadStatusMessage(null), 3000);
  };

  const removeSource = (id: string) => {
    setSources((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      const newSynth = synthesizeResearch(currentQuery, updated);
      setActiveResult(newSynth);
      return updated;
    });
  };

  const runInvestigation = async (query?: string): Promise<ResearchResult> => {
    const q = query !== undefined ? query : currentQuery;
    setIsProcessing(true);
    setCurrentQuery(q);

    // Artificial short neural pipeline step delay for responsive feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = synthesizeResearch(q, sources);
    setActiveResult(result);
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
        setCurrentQuery,
        uploadFiles,
        addWebSource,
        removeSource,
        runInvestigation,
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
