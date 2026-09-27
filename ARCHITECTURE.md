# 🏗️ Research Agent AI - System Architecture Document

This document outlines the complete architectural design, data pipelines, deterministic retrieval-augmented generation mechanics, client-side processing workflows, and deployment design for **Research Agent AI**.

> 🌐 **Live Demo:** [https://research-agent-ai.netlify.app/](https://research-agent-ai.netlify.app/)  
> 💻 **GitHub Repository:** [https://github.com/bikram73/Research_Agent_AI](https://github.com/bikram73/Research_Agent_AI)

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
   │     Document Ingestion Pipeline    │     │       Deterministic Retrieval & Synthesis Engine│
   │  - PDF Parser (pdfjs-dist)         │     │  - Query Lexical & Semantic Tokenization        │
   │  - DOCX Parser (mammoth)           │     │  - TF-Vector Space & Cosine Similarity          │
   │  - Text / MD / CSV / JSON / HTML   │     │  - Domain Synonym Expansion Dictionary          │
   │  - Sentence-Boundary Chunker       │     │  - Multi-Source Contradiction Detection         │
   │  - Page Reference & Offset Mapping │     │  - Evidence-Grounded Citation Attribution Graph │
   └────────────────────────────────────┘     └─────────────────────────────────────────────────┘
                      │                                          │
                      ▼                                          ▼
   ┌────────────────────────────────────────────────────────────────────────────────────────────┐
   │                          Client Browser In-Memory Store & Cache                            │
   │  - Structured Document Chunks (`charStart`, `charEnd`, `pageOrSection`)                    │
   │  - Inverted Index & Term Frequency Tables                                                  │
   │  - Provenance Identifiers (`prov-[docId]-[index]`)                                         │
   └────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. 🔄 Data Processing & Ingestion Pipeline

### 1.1 Ingestion Flow
1. **File Selection**: User uploads single or multiple files (`.pdf`, `.docx`, `.txt`, `.md`, `.csv`, `.json`, `.html`).
2. **Type Detection & Validation**: MIME type and file extension are inspected against supported formats (`PDF, DOCX, TXT, MD, CSV, JSON, HTML`) and 50MB file size limits.
3. **Buffer Decoupling**: Binary files (`ArrayBuffer`) or text files (`string`) are streamed into dedicated parsing handlers.
4. **Extraction Layer**:
   - **PDF**: Uses `pdfjs-dist` to extract structured text streams per page while preserving page numbers and formatting boundaries.
   - **Word DOCX**: Uses `mammoth` to extract clean paragraphs, headings, and tables from `.docx` XML archives.
   - **Structured / Plain Text**: Markdown, CSV, JSON, HTML, and text are partitioned with semantic structure preserved.
5. **Sentence-Boundary Chunking**:
   - Sentence-boundary chunking targeting approximately 250+ characters, with the previous short sentence (<=150 chars) retained for contextual overlap.
   - Subdivides outlier sentences > 500 characters on clause boundaries to ensure compact passage limits.
   - Each chunk retains metadata: `documentId`, `documentName`, `pageOrSection`, `charStart`, and `charEnd`.
6. **State Hydration**: Sources and chunks are stored in `ResearchContext` and immediately reflected in the Library, Pipeline View, and Investigation workspace.

---

## 2. 🧠 Deterministic Retrieval & Grounded Synthesis Architecture

```
User Query ──► Query Normalizer ──► Stopword Stripping & Domain Synonym Expansion
                                              │
                                              ▼
Chunks Inverted Index ──────────────► TF-Vector Space Cosine Similarity + Token Overlap
                                              │
                                              ▼
                                    Ranked Chunks (Top-K)
                                              │
                         ┌────────────────────┴────────────────────┐
                         ▼                                         ▼
            Core Findings Extraction                  Executive Abstract Synthesis
                         │                                         │
                         ▼                                         ▼
           Citation Provenance Mapping                 Contradiction & Discrepancy Detection
                         │                                         │
                         └────────────────────┬────────────────────┘
                                              ▼
                                  ResearchResult Data Object
```

### 2.1 Retrieval Mechanics
- **Token Overlap & Weighting**: Tokens from the query are extracted, normalized (lowercased, punctuation removed), and enriched via domain synonym mappings (e.g. `voting` ↔ `consensus`, `delay` ↔ `latency`).
- **TF-Vector Cosine Similarity & Relevance Scoring**:
  $$\text{Combined Score} = 0.70 \cdot \text{TermMatchRatio} + 0.30 \cdot \text{NormalizedCosine} + \text{PhraseBonus}$$
  Explicitly evaluates to `0.00` when zero query tokens overlap with the chunk.
- **Evidence-Grounded Guardrail**: Queries with zero candidate chunks or insufficient query coverage (<50% keyword match) return an explicit *Insufficient Evidence* declaration.
- **Multi-Source Contradiction Detection**: Cross-references top retrieved chunks across multiple documents to identify divergent dates, quantitative metrics (TPS, ms, nodes), or opposing polarity statements.

---

## 3. 🛡️ Provenance Engine & Verification Layer

The platform enforces strict evidence grounding by binding every generated finding directly to an extracted document chunk:

1. **Source-Derived Excerpt Extraction**: Every claim is cross-referenced against the chunk corpus to ensure exact provenance mapping.
2. **Provenance Identification**: Each citation receives a unique **Provenance ID** (`prov-[docId]-[index]`) and exact page/character offsets (`charStart`, `charEnd`).
3. **Traceability**: Inquiries lacking grounded evidence are rejected with 0 false citations fabricated.

---

## 4. 🌐 Deployment & Runtime Architecture

- **Static Frontend**: Compiled into high-performance static HTML/JS/CSS bundles via Vite.
- **Client-Side Execution**: Parsing, chunking, and ranking run directly in the user's browser; uploaded document content is processed in browser memory and is not persisted in an application database.
- **Netlify SPA Configuration**:
  - `netlify.toml` handles routing (`/* -> /index.html 200`), security headers, and asset caching.
  - `public/_redirects` provides fallback routing.
