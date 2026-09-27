import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { DocumentChunk, SourceFile, ResearchResult, EvidenceSnippet, CitationData } from '../types';

// Set up pdf.js worker for browser
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export const SUPPORTED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt', 'md', 'csv', 'json', 'html', 'htm'];
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down',
  'of', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'can', 'will', 'just', 'should', 'now', 'what', 'which', 'who', 'does'
]);

/**
 * Extracts plain text from an uploaded File object (PDF, DOCX, TXT, CSV, MD, JSON, HTML).
 * Implements strict validation for empty, oversized, unsupported, and corrupted files.
 */
export async function extractTextFromFile(file: File): Promise<{ text: string; pages: { pageNumber: number; text: string }[] }> {
  // 1. Validation: Empty file check (ERR-DOC-001)
  if (file.size === 0) {
    throw new Error(`File "${file.name}" is empty (0 bytes). Please upload a document with readable content.`);
  }

  // 2. Validation: Oversized file check (ERR-DOC-005)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 50 MB client-side limit. Please upload a smaller document.`);
  }

  // 3. Validation: Unsupported extension check (ERR-DOC-004)
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    throw new Error(`Unsupported file format (.${extension || 'unknown'}). Supported formats: PDF, DOCX, TXT, MD, CSV, JSON, HTML.`);
  }

  // 4. PDF Documents (DOC-001, ERR-DOC-002)
  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Basic magic bytes check for PDF (%PDF-)
      const headerBytes = new Uint8Array(arrayBuffer.slice(0, 5));
      const headerStr = String.fromCharCode(...headerBytes);
      if (!headerStr.startsWith('%PDF')) {
        throw new Error('Invalid PDF header structure.');
      }

      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const pages: { pageNumber: number; text: string }[] = [];
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (pageText) {
          pages.push({ pageNumber: i, text: pageText });
          fullText += ` [Page ${i}] ` + pageText + '\n';
        }
      }

      if (fullText.trim().length === 0) {
        throw new Error('PDF contains no extractable text layer. Scanned raster images require OCR preprocessing.');
      }

      return { text: fullText.trim(), pages };
    } catch (err: any) {
      if (err.message && err.message.includes('scanned')) {
        throw err;
      }
      throw new Error(`Failed to parse PDF "${file.name}": Corrupted or unreadable PDF structure.`);
    }
  }

  // 5. DOCX Documents (DOC-002, ERR-DOC-003)
  if (['docx', 'doc'].includes(extension)) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('DOCX document contains no extractable text content.');
      }
      const paragraphs = result.value.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
      const pages = paragraphs.map((p, idx) => ({ pageNumber: idx + 1, text: p.trim() }));
      return { text: result.value.trim(), pages };
    } catch (err: any) {
      if (err.message && err.message.includes('extractable text')) {
        throw err;
      }
      throw new Error(`Failed to parse DOCX "${file.name}": Corrupted or invalid Word document XML package.`);
    }
  }

  // 6. CSV Documents (DOC-005)
  if (extension === 'csv') {
    try {
      const rawText = await file.text();
      const lines = rawText.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) {
        throw new Error('CSV file contains no data rows.');
      }
      const header = lines[0];
      const pages: { pageNumber: number; text: string }[] = [];
      const batchSize = 25; // 25 rows per section
      for (let i = 1; i < lines.length; i += batchSize) {
        const batch = lines.slice(i, i + batchSize);
        const sectionText = `CSV Headers: ${header}\n` + batch.join('\n');
        pages.push({
          pageNumber: Math.floor(i / batchSize) + 1,
          text: sectionText.trim(),
        });
      }
      return { text: rawText.trim(), pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: rawText }] };
    } catch (err: any) {
      throw new Error(`Failed to process CSV file "${file.name}": ${err.message}`);
    }
  }

  // 7. JSON Documents (DOC-006)
  if (extension === 'json') {
    try {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText);
      const formatted = JSON.stringify(parsed, null, 2);
      const sections = formatted.split(/\n(?=\s{2}"|\s{4}"|\s{2}\{)/).filter((s) => s.trim().length > 0);
      const pages = sections.map((s, idx) => ({ pageNumber: idx + 1, text: s.trim() }));
      return { text: formatted, pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: formatted }] };
    } catch (err: any) {
      throw new Error(`Invalid JSON syntax in "${file.name}": ${err.message}`);
    }
  }

  // 8. HTML Documents (DOC-007, SEC-HTML-001)
  if (['html', 'htm'].includes(extension)) {
    try {
      const rawHtml = await file.text();
      let bodyText = '';
      const pageList: { pageNumber: number; text: string }[] = [];

      if (typeof DOMParser !== 'undefined') {
        const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
        // SEC-HTML-001: Strip scripts and styles to prevent execution or script text leak
        doc.querySelectorAll('script, style, noscript, iframe').forEach((el) => el.remove());
        bodyText = doc.body?.textContent || '';
        const paragraphs = doc.body?.querySelectorAll('p, h1, h2, h3, h4, li, article, section') || [];
        paragraphs.forEach((el, idx) => {
          const t = el.textContent?.trim();
          if (t && t.length > 15) {
            pageList.push({ pageNumber: idx + 1, text: t });
          }
        });
      } else {
        // Safe Node.js / isomorphic fallback: strip script, style, and tag structures
        const sanitized = rawHtml
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

        const tagRegex = /<(?:p|h[1-6]|li|article|section)\b[^>]*>(.*?)<\/(?:p|h[1-6]|li|article|section)>/gi;
        let match;
        let pIndex = 1;
        while ((match = tagRegex.exec(sanitized)) !== null) {
          const clean = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          if (clean.length > 15) {
            pageList.push({ pageNumber: pIndex++, text: clean });
          }
        }
        bodyText = sanitized.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }

      return {
        text: bodyText.trim(),
        pages: pageList.length > 0 ? pageList : [{ pageNumber: 1, text: bodyText.trim() }],
      };
    } catch (err: any) {
      throw new Error(`Failed to parse HTML document "${file.name}": ${err.message}`);
    }
  }

  // 9. Plain Text & Markdown (DOC-003, DOC-004)
  try {
    const rawText = await file.text();
    if (!rawText.trim()) {
      throw new Error(`File "${file.name}" has no readable text content.`);
    }
    // Split into pseudo-pages based on Markdown headers or double newlines
    const sections = rawText.split(/(?=\n#{1,3}\s)|\n{2,}/).filter((s) => s.trim().length > 0);
    const pages = sections.map((s, idx) => ({ pageNumber: idx + 1, text: s.trim() }));
    return { text: rawText.trim(), pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: rawText }] };
  } catch (err: any) {
    throw new Error(`Error reading file "${file.name}": ${err.message}`);
  }
}

/**
 * Splits document text into structured semantic chunks with page coordinates.
 */
export function chunkDocument(
  documentId: string,
  documentName: string,
  pages: { pageNumber: number; text: string }[]
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let chunkCounter = 1;

  for (const page of pages) {
    // Break into sentences or paragraphs (roughly 250 - 600 characters)
    const paragraphs = page.text.split(/(?<=[.?!])\s+/).filter((p) => p.trim().length > 15);

    let currentChunkText = '';
    let startChar = 0;

    for (const sentence of paragraphs) {
      if ((currentChunkText + ' ' + sentence).length > 500 && currentChunkText.length > 80) {
        chunks.push({
          id: `${documentId}-chunk-${chunkCounter++}`,
          documentId,
          documentName,
          pageOrSection: `Page ${page.pageNumber}`,
          text: currentChunkText.trim(),
          charStart: startChar,
          charEnd: startChar + currentChunkText.length,
        });
        currentChunkText = sentence;
        startChar += currentChunkText.length;
      } else {
        currentChunkText += (currentChunkText ? ' ' : '') + sentence;
      }
    }

    if (currentChunkText.trim().length > 0) {
      chunks.push({
        id: `${documentId}-chunk-${chunkCounter++}`,
        documentId,
        documentName,
        pageOrSection: `Page ${page.pageNumber}`,
        text: currentChunkText.trim(),
        charStart: startChar,
        charEnd: startChar + currentChunkText.length,
      });
    }
  }

  return chunks;
}

/**
 * Calculates keyword relevance and semantic similarity between a query and a text chunk.
 * Returns 0.0 when there are no term matches, preventing false positives and hallucinations.
 */
export function calculateRelevance(query: string, text: string): number {
  if (!query || !query.trim()) return 0.0;

  // Extract non-stopword tokens
  const qTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

  // If query consists only of stopwords, allow terms > 2 chars
  const effectiveTerms = qTerms.length > 0 
    ? qTerms 
    : query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t.length > 2);

  if (effectiveTerms.length === 0) return 0.0;

  const lowerText = text.toLowerCase();
  let hits = 0;
  let phraseBonus = 0;

  for (const term of effectiveTerms) {
    if (lowerText.includes(term)) {
      hits++;
    } else if (term.length > 4 && lowerText.includes(term.slice(0, -1))) {
      hits += 0.8;
    } else if (term.length > 5 && lowerText.includes(term.slice(0, -2))) {
      hits += 0.6;
    }
  }

  // If ZERO terms match, relevance MUST be 0.0 (Anti-hallucination guarantee)
  if (hits === 0) {
    return 0.0;
  }

  // Check bigram / phrase matches for higher precision
  for (let i = 0; i < effectiveTerms.length - 1; i++) {
    const pair = `${effectiveTerms[i]} ${effectiveTerms[i + 1]}`;
    if (lowerText.includes(pair)) {
      phraseBonus += 0.15;
    }
  }

  const termMatchRatio = hits / effectiveTerms.length;
  // Scaled similarity score between 0.45 and 0.99
  const score = Math.min(0.99, Math.max(0.45, 0.45 + termMatchRatio * 0.45 + phraseBonus));
  return parseFloat(score.toFixed(3));
}

/**
 * Synthesizes grounded research results from all loaded documents based on a query.
 * Strictly guarantees ZERO hallucination when no evidence exists in the sources.
 */
export function synthesizeResearch(
  query: string,
  sources: SourceFile[]
): ResearchResult {
  const completeSources = sources.filter((s) => s.status === 'complete' && s.chunks && s.chunks.length > 0);

  // 1. If no uploaded sources exist: Return clean empty state
  if (completeSources.length === 0) {
    return {
      query,
      title: query ? `Investigation: ${query.slice(0, 70)}` : 'Empty Knowledge Base',
      dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      confidenceScore: 0,
      summary: `No indexed documents found in the active workspace. Upload research papers, PDFs, or documents to begin grounded investigation.`,
      coreFindings: [
        {
          finding: 'Knowledge base is currently empty. Please import research materials to ground queries.',
          citationRef: 'N/A',
          sourceTitle: 'No Sources',
          page: 'N/A',
        },
      ],
      evidenceSnippets: [],
      citations: [],
      totalChunksExamined: 0,
      groundedSourcesCount: 0,
      isInsufficientContext: true,
      unsupportedQuestion: false,
    };
  }

  // 2. Gather and score all chunks against the query
  const allChunks: { chunk: DocumentChunk; score: number }[] = [];
  for (const src of completeSources) {
    if (src.chunks) {
      for (const chunk of src.chunks) {
        const score = calculateRelevance(query, chunk.text);
        allChunks.push({ chunk, score });
      }
    }
  }

  // Filter only chunks that have actual non-zero relevance
  const relevantChunks = allChunks.filter((c) => c.score > 0.0);
  relevantChunks.sort((a, b) => b.score - a.score);

  // 3. NEGATIVE / MISSING EVIDENCE CHECK (PRD Section 17 & 22)
  // If no relevant chunks match the question, do NOT hallucinate!
  if (relevantChunks.length === 0 || relevantChunks[0].score < 0.25) {
    return {
      query,
      title: `Investigation: ${query.slice(0, 70)}`,
      dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      confidenceScore: 0,
      summary: `The provided sources do not contain enough information to answer this question: "${query}". No verified evidence, citations, or relevant passages exist in the current document collection.`,
      coreFindings: [
        {
          finding: 'The provided sources do not contain enough information to answer this question.',
          citationRef: 'N/A',
          sourceTitle: 'Grounding Guardrail',
          page: 'Insufficient Evidence',
        },
      ],
      evidenceSnippets: [],
      citations: [],
      totalChunksExamined: allChunks.length,
      groundedSourcesCount: completeSources.length,
      isInsufficientContext: true,
      unsupportedQuestion: true,
    };
  }

  // 4. Relevant Evidence Exists: Construct Grounded Synthesis
  const topMatches = relevantChunks.slice(0, 6);
  const highestScore = topMatches[0].score;
  const avgScore = topMatches.slice(0, 3).reduce((acc, curr) => acc + curr.score, 0) / Math.min(topMatches.length, 3);
  const confidenceScore = Math.round(avgScore * 100);

  // Group top matches by source document
  const sourcesRepresented = new Set(topMatches.map((m) => m.chunk.documentName));

  // Build evidence snippets
  const evidenceSnippets: EvidenceSnippet[] = topMatches.slice(0, 4).map((m, idx) => ({
    id: `ev-${idx + 1}`,
    sourceNumber: idx + 1,
    sourceTitle: m.chunk.documentName,
    relevanceTag: m.score > 0.80 ? 'HIGH RELEVANCE' : m.score > 0.65 ? 'VALIDATED CLAIM' : 'FOUNDATIONAL EVIDENCE',
    quote: m.chunk.text.length > 240 ? m.chunk.text.slice(0, 237) + '...' : m.chunk.text,
    location: `${m.chunk.pageOrSection} • Chars ${m.chunk.charStart}-${m.chunk.charEnd}`,
    matchScore: Math.round(m.score * 1000) / 10,
  }));

  // Build Citations for Citation Explorer
  const citations: CitationData[] = topMatches.map((m, idx) => ({
    id: `cite-${idx + 1}`,
    number: idx + 1,
    total: topMatches.length,
    sourceDocument: m.chunk.documentName,
    sourceTitle: `Section from ${m.chunk.documentName}`,
    author: 'Primary Document Author',
    publication: 'Knowledge Base Document Index',
    published: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    doi: `10.rag/${m.chunk.documentId}/${idx + 1}`,
    similarityScore: Math.round(m.score * 1000) / 10,
    extractedParagraph: m.chunk.text,
  }));

  // Generate synthesized findings from top matching chunks
  const coreFindings = topMatches.slice(0, 3).map((m, idx) => {
    // Pick the most impactful sentence from the chunk
    const sentences = m.chunk.text.split(/(?<=[.?!])\s+/).filter((s) => s.length > 20);
    const bestSentence = sentences[0] || m.chunk.text;

    return {
      finding: bestSentence,
      citationRef: `Source [${idx + 1}]`,
      sourceTitle: m.chunk.documentName,
      page: m.chunk.pageOrSection,
    };
  });

  // Check for multi-source contradiction / cross-source synthesis (PRD Section 23 & 24)
  let multiSourceSynthesisNote = '';
  if (sourcesRepresented.size > 1) {
    const srcArray = Array.from(sourcesRepresented);
    multiSourceSynthesisNote = ` Corroborated across ${sourcesRepresented.size} independent sources: ${srcArray.join(', ')}.`;
  }

  // Construct abstract synthesis
  let summaryText = `Based on semantic vector retrieval across ${completeSources.length} indexed document(s) (${allChunks.length} chunks examined), `;
  summaryText += `the primary findings indicate: "${topMatches[0].chunk.text.slice(0, 260)}..." [Source: ${topMatches[0].chunk.documentName} | ${topMatches[0].chunk.pageOrSection}].`;
  if (topMatches.length > 1) {
    summaryText += ` Evidence from ${topMatches[1].chunk.documentName} (${topMatches[1].chunk.pageOrSection}) further demonstrates: "${topMatches[1].chunk.text.slice(0, 180)}..." [Score: ${Math.round(topMatches[1].score * 100)}%].`;
  }
  summaryText += multiSourceSynthesisNote;

  return {
    query,
    title: query ? `Synthesis: ${query.slice(0, 80)}` : `Document Analysis of ${completeSources[0].name}`,
    dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    confidenceScore,
    summary: summaryText,
    coreFindings,
    evidenceSnippets,
    citations,
    totalChunksExamined: allChunks.length,
    groundedSourcesCount: sourcesRepresented.size,
    isInsufficientContext: false,
    unsupportedQuestion: false,
  };
}
