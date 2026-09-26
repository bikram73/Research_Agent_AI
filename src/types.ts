export type NavView = 
  | 'home'
  | 'upload'
  | 'investigate'
  | 'results'
  | 'citations'
  | 'pipeline'
  | 'library'
  | 'about';

export interface SourceFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'web';
  status: 'complete' | 'processing' | 'waiting';
  progress?: number;
  statusText: string;
  date?: string;
  url?: string;
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
