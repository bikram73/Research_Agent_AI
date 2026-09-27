# 🏗️ Research Agent AI - System Architecture Document

This document outlines the complete architectural design, data pipelines, retrieval-augmented generation (RAG) mechanics, client-side processing workflows, and infrastructure for **Research Agent AI**.

---

## 📑 Architecture Overview

```
                                  USER INTERFACE (React 19 + Tailwind CSS)
       ┌────────────────────────────────────────────────────────────────────────────────────────┐
       │   Upload View   │   Investigate Workspace   │   Results / Synthesizer   │  Citation Explorer  │
       └──────────────┬──────────────────┬───────────────────────┬──────────────────────┬───────┘
                      │                  │                       │                      │
                      ▼                  ▼                       ▼                      ▼
       ┌────────────────────────────────────────────────────────────────────────────────────────┐
       │                            ResearchContext (Global State & Orchestrator)              │
       └──────────────┬──────────────────────────────────────────┬──────────────────────────────┘
                      │                                          │
                      ▼                                          ▼
   ┌────────────────────────────────────┐     ┌─────────────────────────────────────────────────┐
   │     Document Ingestion Pipeline    │     │       Semantic Retrieval & Synthesis Engine     │
   │  - PDF Parser (pdfjs-dist)         │     │  - Query Lexical & Semantic Tokenization        │
   │  - DOCX Parser (mammoth)           │     │  - Vector Similarity & Cosine Token Overlap     │
   │  - Text / MD / CSV / JSON Parsers  │     │  - Dynamic Chunk Ranking & Threshold Filtering  │
   │  - Semantic Chunker with Spans     │     │  - Citation Attribution Graph                   │
   │  - Page Coordinate Mapping         │     │  - Anti-Hallucination Verification Layer        │
   └────────────────────────────────────┘     └─────────────────────────────────────────────────┘
                      │                                          │
                      ▼                                          ▼
   ┌────────────────────────────────────┐     ┌─────────────────────────────────────────────────┐
   │      Client Memory Store / Cache   │     │        Optional LLM Server Integration          │
   │  - Chunk Inverted Index            │     │  - @google/genai SDK (Gemini 2.5 Flash / Pro)   │
   │  - Document Metastore              │     │  - Serverless API / Express Proxy (`/api/*`)    │
   │  - Citation Cross-References       │     │  - Grounding Verification Engine                │
   └────────────────────────────────────┘     └─────────────────────────────────────────────────┘
```

---

## 1. 🔄 Data Processing & Ingestion Pipeline

### 1.1 Ingestion Flow
1. **File Selection**: User uploads single or multiple files (`.pdf`, `.docx`, `.txt`, `.md`, `.csv`, `.json`).
2. **Type Detection**: MIME type and file extension are inspected to select the designated parser.
3. **Buffer Decoupling**: Binary files (`ArrayBuffer`) or text files (`string`) are streamed into dedicated parsing workers.
4. **Extraction Layer**:
   - **PDF**: Uses `pdfjs-dist` to extract structured text streams per page while preserving page numbers and formatting boundaries.
   - **Word DOCX**: Uses `mammoth` to extract clean paragraphs, headings, and lists from `.docx` XML archives.
   - **Structured / Plain Text**: Markdown, CSV, JSON, and text are partitioned by semantic section delimiters (`\n\n`, headers `#`, table rows).
5. **Semantic Chunking**:
   - Text is partitioned into chunks of 250–600 characters with 80-character sliding windows.
   - Each chunk retains metadata: `documentId`, `documentName`, `pageOrSection`, `charStart`, and `charEnd`.
6. **State Hydration**: Sources and chunks are stored in `ResearchContext` and immediately reflected in the Library, Pipeline View, and Investigation workspace.

---

## 2. 🧠 Retrieval-Augmented Synthesis (RAG) Architecture

```
User Query ──► Query Normalizer ──► Token Weighting & Stopword Stripping
                                              │
                                              ▼
Chunks Inverted Index ──────────────► Vector Similarity Scoring (Cosine + Jaccard)
                                              │
                                              ▼
                                    Ranked Chunks (Top-K)
                                              │
                         ┌────────────────────┴────────────────────┐
                         ▼                                         ▼
            Core Findings Extraction                  Executive Abstract Synthesis
                         │                                         │
                         ▼                                         ▼
                 Citation Mapping                         Grounding Score Compute
                         │                                         │
                         └────────────────────┬────────────────────┘
                                              ▼
                                  ResearchResult Data Object
```

### 2.1 Retrieval Mechanics
- **Token Overlap & Weighting**: Tokens from the query are extracted, normalized (lowercased, punctuation removed), and stemmed.
- **Lexical Density & Scoring**:
  $$\text{Score}(Q, C) = 0.6 \cdot \text{CosineOverlap}(Q, C) + 0.3 \cdot \text{JaccardTokenMatch}(Q, C) + 0.1 \cdot \text{ContextRelevance}(C)$$
- **Page Coordinate Indexing**: Chunks retain explicit page numbers and character offsets, enabling exact highlight rendering in Citation Explorer.

---

## 3. 🛡️ Anti-Hallucination & Grounding Engine

The platform enforces zero-hallucination discipline by binding every generated finding directly to an extracted document chunk:

1. **Quote Verification**: Every claim is cross-referenced against the chunk corpus to ensure substring or semantic alignment $> 85\%$.
2. **Confidence Computation**:
   $$\text{Confidence Score} = \min\left(99.4\%, \left(\frac{\sum_{i=1}^N \text{Score}(c_i)}{N} \times 100\right) + 12\%\right)$$
3. **Traceability**: Findings without an exact chunk source are automatically discarded or flagged as ungrounded.

---

## 4. 🌐 Deployment & Runtime Architecture

- **Static Frontend**: Compiled into high-performance static HTML/JS/CSS bundles via Vite.
- **Client-Side Execution**: Parsing, chunking, and ranking run directly in the user's browser, ensuring zero data leakage and 100% privacy for sensitive documents.
- **Netlify SPA Configuration**:
  - `netlify.toml` handles routing (`/* -> /index.html 200`), security headers, and asset caching.
  - `public/_redirects` provides fallback routing.
- **Extensible Full-Stack Route**: An optional Express server (`server.ts`) can be booted for server-side Gemini API inference when external LLM compute is requested.
