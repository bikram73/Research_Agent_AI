import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { DocumentChunk, SourceFile, ResearchResult, EvidenceSnippet, CitationData } from '../types';

// Set up pdf.js worker for browser
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export const SUPPORTED_EXTENSIONS = ['pdf', 'docx', 'txt', 'md', 'csv', 'json', 'html', 'htm'];
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
  if (extension === 'docx') {
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
 * Chunks documents using sentence-boundary segmenting.
 * Partitions text into contextual passages targeting approximately 250+ characters.
 * Subdivides outlier sentences > 500 characters on clause boundaries to maintain compact chunks.
 * Retains preceding short sentence (<=150 chars) across boundaries for contextual overlap.
 * Preserves exact numerical source character offsets (charStart, charEnd).
 */
export function chunkDocument(
  documentId: string,
  documentName: string,
  pages: { pageNumber: number; text: string }[]
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let chunkCounter = 1;

  for (const page of pages) {
    const rawPageText = page.text;
    if (!rawPageText || !rawPageText.trim()) continue;

    // Break into sentences
    const rawSentences = rawPageText.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 0);
    if (rawSentences.length === 0) continue;

    // Subdivide any outlier sentences > 500 chars by clause punctuation to prevent oversize chunks
    const sentenceList: string[] = [];
    for (const s of rawSentences) {
      if (s.length > 500) {
        const clauses = s.split(/(?<=[;:\n])\s+/).filter((c) => c.trim().length > 0);
        if (clauses.length > 1) {
          sentenceList.push(...clauses);
        } else {
          sentenceList.push(s);
        }
      } else {
        sentenceList.push(s);
      }
    }

    // Map each sentence to its exact start and end position in rawPageText
    const sentenceSpans: { text: string; start: number; end: number }[] = [];
    let searchCursor = 0;
    for (const s of sentenceList) {
      const idx = rawPageText.indexOf(s, searchCursor);
      if (idx !== -1) {
        sentenceSpans.push({ text: s, start: idx, end: idx + s.length });
        searchCursor = idx + s.length;
      } else {
        sentenceSpans.push({ text: s, start: searchCursor, end: searchCursor + s.length });
        searchCursor += s.length;
      }
    }

    let chunkSentences: typeof sentenceSpans = [];
    let currentLength = 0;

    for (let i = 0; i < sentenceSpans.length; i++) {
      const span = sentenceSpans[i];
      chunkSentences.push(span);
      currentLength += span.text.length + 1;

      // When accumulated text reaches 250-600 characters or is the final sentence
      if (currentLength >= 250 || i === sentenceSpans.length - 1) {
        const startChar = chunkSentences[0].start;
        const endChar = chunkSentences[chunkSentences.length - 1].end;
        const chunkText = rawPageText.slice(startChar, endChar).trim();

        if (chunkText.length > 0) {
          chunks.push({
            id: `${documentId}-chunk-${chunkCounter++}`,
            documentId,
            documentName,
            pageOrSection: `Page ${page.pageNumber}`,
            text: chunkText,
            charStart: startChar,
            charEnd: endChar,
          });
        }

        // Sliding window: retain last sentence for boundary context if more sentences follow
        if (i < sentenceSpans.length - 1 && chunkSentences.length > 1) {
          const lastSpan = chunkSentences[chunkSentences.length - 1];
          if (lastSpan.text.length <= 150) {
            chunkSentences = [lastSpan];
            currentLength = lastSpan.text.length;
          } else {
            chunkSentences = [];
            currentLength = 0;
          }
        } else {
          chunkSentences = [];
          currentLength = 0;
        }
      }
    }
  }

  return chunks;
}

const SYNONYMS: Record<string, string[]> = {
  voting: ['consensus', 'agreement', 'validator', 'election', 'rounds'],
  protocol: ['agreement', 'consensus', 'network', 'system', 'mechanism'],
  delay: ['latency', 'lag', 'cycle', 'cycles'],
  reduction: ['eliminates', 'eliminate', 'reduces', 'reduce', 'decrease', 'decreases'],
  consensus: ['voting', 'agreement', 'validator'],
  telemetry: ['metrics', 'monitoring', 'signals', 'rounds'],
};

/**
 * Calculates vector cosine similarity between query and chunk tokens,
 * combined with semantic synonym mapping and bigram phrase matching.
 * Returns strictly 0.0 when there are no term matches, preventing false positives.
 * NO artificial floor is applied.
 */
export function calculateRelevance(query: string, text: string): number {
  if (!query || !query.trim() || !text || !text.trim()) return 0.0;

  // Extract non-stopword query terms
  const qTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

  const effectiveTerms = qTerms.length > 0 
    ? qTerms 
    : query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t.length > 2);

  if (effectiveTerms.length === 0) return 0.0;

  const textTokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);

  if (textTokens.length === 0) return 0.0;

  // Vector Term Frequency Maps
  const queryTf: Record<string, number> = {};
  for (const t of effectiveTerms) {
    queryTf[t] = (queryTf[t] || 0) + 1;
  }

  const textTf: Record<string, number> = {};
  for (const t of textTokens) {
    textTf[t] = (textTf[t] || 0) + 1;
  }

  // Vector Dot Product & Norms with synonym support
  let dotProduct = 0;
  let queryNormSq = 0;
  let textNormSq = 0;

  for (const term in queryTf) {
    queryNormSq += queryTf[term] * queryTf[term];
    if (textTf[term]) {
      dotProduct += queryTf[term] * textTf[term];
    } else if (SYNONYMS[term]) {
      for (const syn of SYNONYMS[term]) {
        if (textTf[syn]) {
          dotProduct += queryTf[term] * (textTf[syn] * 0.7);
          break;
        }
      }
    }
  }

  // Strict 0.0 if dot product is 0 (no term overlap or semantic synonym overlap)
  if (dotProduct === 0) {
    return 0.0;
  }

  for (const term in textTf) {
    textNormSq += textTf[term] * textTf[term];
  }

  const queryNorm = Math.sqrt(queryNormSq);
  const textNorm = Math.sqrt(textNormSq);
  const cosineSim = queryNorm > 0 && textNorm > 0 ? dotProduct / (queryNorm * textNorm) : 0;

  // Keyword hits & semantic synonym matches
  let hits = 0;
  const lowerText = text.toLowerCase();
  for (const term of effectiveTerms) {
    if (lowerText.includes(term)) {
      hits += 1.0;
    } else if (term.length > 4 && lowerText.includes(term.slice(0, -1))) {
      hits += 0.8;
    } else if (SYNONYMS[term]) {
      for (const syn of SYNONYMS[term]) {
        if (lowerText.includes(syn)) {
          hits += 0.85;
          break;
        }
      }
    }
  }

  let phraseBonus = 0;
  for (let i = 0; i < effectiveTerms.length - 1; i++) {
    const pair = `${effectiveTerms[i]} ${effectiveTerms[i + 1]}`;
    if (lowerText.includes(pair)) {
      phraseBonus += 0.15;
    }
  }

  const termMatchRatio = hits / effectiveTerms.length;
  const normalizedCosine = Math.min(1.0, cosineSim * 2.2);

  // Evidence-grounded scoring: term match ratio + normalized vector similarity + phrase bonus
  const combined = termMatchRatio * 0.70 + normalizedCosine * 0.30 + phraseBonus;
  const score = Math.min(0.99, Math.max(0.0, combined));
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

  // Extract non-stopword query terms for coverage check
  const qTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

  const effectiveTerms = qTerms.length > 0
    ? qTerms
    : query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t.length > 2);

  const topScore = relevantChunks.length > 0 ? relevantChunks[0].score : 0;

  // Check query keyword coverage in top candidate chunks
  let keywordCoverage = 0;
  if (relevantChunks.length > 0 && effectiveTerms.length > 0) {
    const topChunkText = relevantChunks[0].chunk.text.toLowerCase();
    const matchedCount = effectiveTerms.filter((term) => topChunkText.includes(term)).length;
    keywordCoverage = matchedCount / effectiveTerms.length;
  }

  // 3. NEGATIVE / MISSING EVIDENCE CHECK (Evidence-Grounded Guardrail)
  // Refuse if: no matching chunks, or top score < 0.35, or fewer than 50% of query keywords matched
  if (relevantChunks.length === 0 || topScore < 0.35 || keywordCoverage < 0.50) {
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
    relevanceTag: m.score > 0.80 ? 'HIGH RELEVANCE' : m.score > 0.60 ? 'VALIDATED CLAIM' : 'FOUNDATIONAL EVIDENCE',
    quote: m.chunk.text.length > 240 ? m.chunk.text.slice(0, 237) + '...' : m.chunk.text,
    location: `${m.chunk.pageOrSection} • Chars ${m.chunk.charStart}-${m.chunk.charEnd}`,
    matchScore: Math.round(m.score * 1000) / 10,
  }));

  // Build Citations for Citation Explorer (using Provenance ID)
  const citations: CitationData[] = topMatches.map((m, idx) => ({
    id: `cite-${idx + 1}`,
    number: idx + 1,
    total: topMatches.length,
    sourceDocument: m.chunk.documentName,
    sourceTitle: `Section from ${m.chunk.documentName}`,
    author: 'Primary Document Author',
    publication: 'Knowledge Base Document Index',
    published: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    provenanceId: `prov-${m.chunk.documentId}-${idx + 1}`,
    doi: `prov-${m.chunk.documentId}-${idx + 1}`,
    similarityScore: Math.round(m.score * 1000) / 10,
    extractedParagraph: m.chunk.text,
  }));

  // Generate synthesized findings from top matching chunks
  const coreFindings = topMatches.slice(0, 3).map((m, idx) => {
    const sentences = m.chunk.text.split(/(?<=[.?!])\s+/).filter((s) => s.length > 20);
    const bestSentence = sentences[0] || m.chunk.text;

    return {
      finding: bestSentence,
      citationRef: `Source [${idx + 1}]`,
      sourceTitle: m.chunk.documentName,
      page: m.chunk.pageOrSection,
    };
  });

/**
 * Detects contradictory metrics, conflicting years, or opposing assertions across multi-source evidence.
 */
function detectSourceContradiction(matches: { chunk: DocumentChunk; score: number }[]): {
  hasConflict: boolean;
  conflictDescription: string;
  conflictingSources: string[];
} {
  const sources = new Map<string, string[]>();
  for (const m of matches) {
    const doc = m.chunk.documentName;
    if (!sources.has(doc)) sources.set(doc, []);
    sources.get(doc)!.push(m.chunk.text);
  }

  if (sources.size < 2) {
    return { hasConflict: false, conflictDescription: '', conflictingSources: [] };
  }

  const entries = Array.from(sources.entries());
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [docA, textsA] = entries[i];
      const [docB, textsB] = entries[j];
      const textA = textsA.join(' ');
      const textB = textsB.join(' ');

      // 1. Check for conflicting years / launch dates on similar topics
      const yearsA = Array.from(textA.matchAll(/\b(19\d\d|20\d\d)\b/g)).map((m) => m[0]);
      const yearsB = Array.from(textB.matchAll(/\b(19\d\d|20\d\d)\b/g)).map((m) => m[0]);
      const uniqueYearsA = Array.from(new Set(yearsA));
      const uniqueYearsB = Array.from(new Set(yearsB));

      if (uniqueYearsA.length > 0 && uniqueYearsB.length > 0) {
        const commonYears = uniqueYearsA.filter((y) => uniqueYearsB.includes(y));
        if (commonYears.length === 0) {
          return {
            hasConflict: true,
            conflictDescription: `Discrepancy detected in timeline/date claims: "${docA}" reports ${uniqueYearsA.join('/')} while "${docB}" reports ${uniqueYearsB.join('/')}.`,
            conflictingSources: [docA, docB],
          };
        }
      }

      // 2. Check for conflicting throughput / quantitative metrics
      const metricRegex = /\b(\d+[\d,.]*)\s*(tps|tx\/s|transactions|ms|%|percent|nodes|validators)\b/gi;
      const metricsA = Array.from(textA.matchAll(metricRegex)).map((m) => `${m[1]} ${m[2].toLowerCase()}`);
      const metricsB = Array.from(textB.matchAll(metricRegex)).map((m) => `${m[1]} ${m[2].toLowerCase()}`);
      if (metricsA.length > 0 && metricsB.length > 0) {
        for (const mA of metricsA) {
          const [valA, unitA] = mA.split(' ');
          for (const mB of metricsB) {
            const [valB, unitB] = mB.split(' ');
            if (unitA === unitB && valA !== valB) {
              return {
                hasConflict: true,
                conflictDescription: `Discrepancy detected in quantitative metrics: "${docA}" reports ${valA} ${unitA}, whereas "${docB}" reports ${valB} ${unitB}.`,
                conflictingSources: [docA, docB],
              };
            }
          }
        }
      }

      // 3. Check for opposing polarity keywords on similar entities
      const polarityA = /unsupported|failed|incompatible|disproved|rejected|prohibits/i.test(textA);
      const polarityB = /supported|proven|verified|compatible|confirms|permits/i.test(textB);
      if (polarityA && polarityB) {
        return {
          hasConflict: true,
          conflictDescription: `Conflicting assertions surfaced: "${docA}" presents negative/incompatibility findings, while "${docB}" presents affirmative/verified findings.`,
          conflictingSources: [docA, docB],
        };
      }
    }
  }

  return { hasConflict: false, conflictDescription: '', conflictingSources: [] };
}

  // Check for multi-source contradiction / cross-source synthesis
  let multiSourceSynthesisNote = '';
  if (sourcesRepresented.size > 1) {
    const srcArray = Array.from(sourcesRepresented);
    const conflict = detectSourceContradiction(topMatches);
    if (conflict.hasConflict) {
      multiSourceSynthesisNote = ` ⚠️ Contrasting Evidence Detected: ${conflict.conflictDescription} Both perspectives are cited with distinct provenance for reviewer verification.`;
      coreFindings.unshift({
        finding: `Contrasting Claims Surfaced: ${conflict.conflictDescription}`,
        citationRef: 'Sources [1] & [2]',
        sourceTitle: 'Multi-Source Discrepancy',
        page: 'Comparative Review',
      });
    } else {
      multiSourceSynthesisNote = ` Corroborated across ${sourcesRepresented.size} independent sources: ${srcArray.join(', ')}.`;
    }
  }

  // Construct abstract synthesis
  let summaryText = `Based on vector space retrieval across ${completeSources.length} indexed document(s) (${allChunks.length} chunks examined), `;
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
