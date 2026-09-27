export type NavView = 
  | 'home'
  | 'upload'
  | 'investigate'
  | 'results'
  | 'citations'
  | 'pipeline'
  | 'library'
  | 'about';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  pageOrSection: string;
  text: string;
  charStart: number;
  charEnd: number;
  score?: number;
}

export interface SourceFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'web' | 'md' | 'json' | 'html';
  status: 'complete' | 'processing' | 'waiting' | 'error';
  progress?: number;
  statusText: string;
  errorMessage?: string;
  date?: string;
  url?: string;
  content?: string;
  chunks?: DocumentChunk[];
}

export interface ResearchResult {
  query: string;
  title: string;
  dateGenerated: string;
  confidenceScore: number;
  summary: string;
  coreFindings: { finding: string; citationRef: string; sourceTitle: string; page: string }[];
  evidenceSnippets: EvidenceSnippet[];
  citations: CitationData[];
  totalChunksExamined: number;
  groundedSourcesCount: number;
  isInsufficientContext?: boolean;
  unsupportedQuestion?: boolean;
}

export interface EvidenceSnippet {
  id: string;
  sourceNumber: number;
  sourceTitle: string;
  relevanceTag: string;
  quote: string;
  location: string;
  matchScore: number;
}

export interface CitationData {
  id: string;
  number: number;
  total: number;
  sourceDocument: string;
  author: string;
  published: string;
  similarityScore: number;
  extractedParagraph: string;
  publication: string;
  doi: string;
  sourceTitle: string;
}

export interface PipelineStep {
  id: number;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  status?: string;
  progress?: number;
  active?: boolean;
}
