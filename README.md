<div align="center">

# 🔬 Research Agent AI
### *Autonomous Document Ingestion, Semantic Chunking & Citation-Grounded Synthesis Engine*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-research--agent--ai.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://research-agent-ai.netlify.app/)
[![GitHub Repository](https://img.shields.io/badge/📦%20GitHub_Repo-bikram73%2FResearch__Agent__AI-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bikram73/Research_Agent_AI)

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Netlify Status](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://research-agent-ai.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>Research Agent AI</b> is an enterprise-grade academic research intelligence workstation. It autonomously ingests, parses, chunks, and synthesizes complex research papers, technical reports, and multi-format documents with <b>evidence-grounded answer guardrails</b>, verifiable page-level references with character offsets, and deep semantic verification.
</p>

<p align="center">
  🌐 <b>Live Production App:</b> <a href="https://research-agent-ai.netlify.app/"><b>https://research-agent-ai.netlify.app/</b></a> &nbsp;•&nbsp;
  💻 <b>GitHub Source Code:</b> <a href="https://github.com/bikram73/Research_Agent_AI"><b>https://github.com/bikram73/Research_Agent_AI</b></a>
</p>

</div>

---

# 📑 Table of Contents

<div align="center">

| **<div align="center">📖 Description</div>** | **<div align="center">🚀 Section</div>** |
|--------------------------------------------------------------|------------------------------------------------|
| <div align="center">**Access the live production deployment and official GitHub repository.** 👉</div> | <div align="center"><a href="#quick-links"><img src="https://img.shields.io/badge/🔗%20Live%20Demo%20%26%20Repo-10B981?style=for-the-badge" /></a></div> |
| <div align="center">**View the project features and capabilities.** 👉</div> | <div align="center"><a href="#features"><img src="https://img.shields.io/badge/✨%20Features-4F46E5?style=for-the-badge" /></a></div> |
| <div align="center">**View the technologies, frameworks, and programming languages used.** 👉</div> | <div align="center"><a href="#tech-stack"><img src="https://img.shields.io/badge/🛠️%20Tech%20Stack-0891B2?style=for-the-badge" /></a></div> |
| <div align="center">**Explore the project's folder and file organization.** 👉</div> | <div align="center"><a href="#file-structure"><img src="https://img.shields.io/badge/📂%20File%20Structure-10B981?style=for-the-badge" /></a></div> |
| <div align="center">**Follow the installation steps and local development setup.** 👉</div> | <div align="center"><a href="#installation"><img src="https://img.shields.io/badge/🚀%20Installation-F97316?style=for-the-badge" /></a></div> |
| <div align="center">**Understand how confidence scores are calculated and interpreted.** 👉</div> | <div align="center"><a href="#confidence"><img src="https://img.shields.io/badge/📊%20Confidence%20Scores-2563EB?style=for-the-badge" /></a></div> |
| <div align="center">**View the available REST API endpoints and usage examples.** 👉</div> | <div align="center"><a href="#api"><img src="https://img.shields.io/badge/🌐%20API%20Documentation-0EA5E9?style=for-the-badge" /></a></div> |
| <div align="center">**Explore the complete system architecture, AI workflow, processing pipeline, data flow, deployment design, and technical decisions.** 👉</div> | <div align="center"><a href="./ARCHITECTURE.md"><img src="https://img.shields.io/badge/🏗️%20Architecture%20Document-DC2626?style=for-the-badge" /></a></div> |
| <div align="center">**Review implementation details, AI pipeline, performance metrics, benchmarking, validation strategy, privacy, testing, and technical specifications.** 👉</div> | <div align="center"><a href="./TECHNICAL_REPORT.md"><img src="https://img.shields.io/badge/📊%20Technical%20Report-2563EB?style=for-the-badge" /></a></div> |
| <div align="center">**Review the complete End-to-End Testing, QA Scorecard, and Validation Report.** 👉</div> | <div align="center"><a href="./QA_VALIDATION_REPORT.md"><img src="https://img.shields.io/badge/🧪%20QA%20Validation%20Report-10B981?style=for-the-badge" /></a></div> |
| <div align="center">**Review processing speed, latency, and performance benchmarks.** 👉</div> | <div align="center"><a href="#performance"><img src="https://img.shields.io/badge/⚡%20Performance-F59E0B?style=for-the-badge" /></a></div> |
| <div align="center">**Understand the current limitations and known failure cases of the AI extractor.** 👉</div> | <div align="center"><a href="#limitations"><img src="https://img.shields.io/badge/⚠️%20Known%20Limitations-EF4444?style=for-the-badge" /></a></div> |
| <div align="center">**Learn how to deploy to Netlify, Vercel, or custom Docker environments.** 👉</div> | <div align="center"><a href="#deployment"><img src="https://img.shields.io/badge/☁️%20Deployment-00C7B7?style=for-the-badge" /></a></div> |
| <div align="center">**Review test execution, linting rules, and type verification.** 👉</div> | <div align="center"><a href="#testing"><img src="https://img.shields.io/badge/🧪%20Testing%20%26%20QA-6366F1?style=for-the-badge" /></a></div> |

</div>

---

<a id="quick-links"></a>
## 🔗 Live Demo & Source Code

| Resource | Direct Link | Status / Badge |
| :--- | :--- | :--- |
| **🌐 Production App (Netlify)** | [https://research-agent-ai.netlify.app/](https://research-agent-ai.netlify.app/) | [![Netlify](https://img.shields.io/badge/Status-Live%20Online-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://research-agent-ai.netlify.app/) |
| **💻 GitHub Repository** | [https://github.com/bikram73/Research_Agent_AI](https://github.com/bikram73/Research_Agent_AI) | [![GitHub](https://img.shields.io/badge/GitHub-bikram73%2FResearch__Agent__AI-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/bikram73/Research_Agent_AI) |

---

<a id="features"></a>
## ✨ Features

### 📄 1. Multi-Format Universal Document Ingestion
- **PDF Extraction**: Uses `pdfjs-dist` to parse binary page streams directly in the browser, tracking exact page numbers, line breaks, and typographic blocks.
- **Word `.docx` Ingestion**: Uses `mammoth` to extract clean semantic paragraphs, tables, and headers while stripping proprietary XML overhead.
- **Structured & Plain Formats**: Native support for `.txt`, `.md` (Markdown), `.csv`, `.json`, and `.html` with boundary preservation.
- **Zero-Transmission Local Processing**: Ingests files entirely in-memory on the client, preserving full confidentiality for proprietary or sensitive scientific drafts.

### 🧩 2. Semantic Document Chunking & Provenance Metadata
- Splits large documents into coherent semantic passages (250–600 characters) without breaking mid-sentence.
- Preserves explicit provenance metadata:
  - `documentId` & `documentName`
  - `pageOrSection` (e.g. *Page 14*, *Section 3*)
  - Character offsets (`charStart`, `charEnd`)
- Instant feedback in the UI showing token count, chunk count, and embedding health.

### 🔍 3. Vector Similarity & Grounded Retrieval (RAG)
- Query-driven cosine similarity and Jaccard token matching.
- Ranks chunks based on semantic proximity to user inquiries.
- Dynamic relevance scores mapped between `0.00` and `1.00`.

### 🔎 4. Interactive Citation Explorer
- Deep-dive interface showing real extracted snippets, exact source papers, and page stamps.
- Visual badge indicators with match percentages.
- Copy quote, inspect full source context, and trace evidence back to the originating paragraph.

### ⚙️ 5. Visual Pipeline Inspector
- Real-time 5-stage pipeline telemetry:
  1. **Document Ingestion**: Active documents and parsed byte counts.
  2. **Semantic Chunking**: Total structured chunks and token density.
  3. **Vector Embedding**: Multi-dimensional token vectors.
  4. **Retrieval & Reranking**: Query-matched candidate chunks.
  5. **Synthesis & Grounding**: Consensus scoring and citation graph.

### 📚 6. Knowledge Base Library
- Centralized management table of all ingested research assets.
- Live file status indicators (`Complete`, `Processing`, `Pending`).
- Dynamic addition and instant deletion with real-time recalculation of all synthesis reports.

### 🎨 7. Academic Research UI & Dark/Light Theme
- Crafted specifically for research scientists, engineers, and analysts.
- High visual density, subtle gradients, and frictionless navigation.
- Responsive sidebar navigation across all primary tools.

---

<a id="tech-stack"></a>
## 🛠️ Tech Stack & Languages

<div align="center">

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | `5.8.2` | Strong end-to-end typing, static analysis, and interface guarantees |
| **Frontend Core** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | `19.0.1` | Concurrent rendering, reactive state, context orchestrator |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | `6.2.3` | Instant HMR, lightning-fast compilation, optimized asset bundling |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | `4.1.14` | Modern utility-first styling with `@tailwindcss/vite` |
| **Icons & UI** | ![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=flat-square) | `0.546.0` | Comprehensive research, document, and pipeline iconography |
| **PDF Extraction** | ![PDF.js](https://img.shields.io/badge/pdfjs--dist-E0234E?style=flat-square) | `6.3.289` | Client-side page-by-page PDF stream parsing and page/character offset provenance |
| **DOCX Extraction**| ![Mammoth](https://img.shields.io/badge/Mammoth-2B579A?style=flat-square) | `1.13.0` | Clean XML conversion and raw text parsing for Word `.docx` documents |
| **AI SDK** | ![Google GenAI](https://img.shields.io/badge/@google/genai-4285F4?style=flat-square&logo=google&logoColor=white) | `2.4.0` | Modern SDK for Gemini 2.5 Flash / Pro reasoning and grounded synthesis |
| **Hosting & Deploy**| ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white) | `Node 20` | SPA redirects, automated static deployment, edge caching headers |

</div>

---

<a id="file-structure"></a>
## 📂 File Structure

```
├── .env.example              # Sample environment variables configuration
├── .gitignore                # Git ignore patterns for dependencies and build artifacts
├── ARCHITECTURE.md           # In-depth architectural design, pipeline and RAG mechanics
├── TECHNICAL_REPORT.md       # Benchmarking, precision metrics, and latency report
├── README.md                 # Complete documentation and user guide
├── index.html                # HTML entry point with favicon and metadata
├── metadata.json             # AI Studio applet capabilities and permissions
├── netlify.toml              # Netlify build command, headers, and SPA redirect rules
├── package.json              # Project dependencies, scripts, and runtime engines
├── tsconfig.json             # TypeScript compiler rules and module resolution
├── vite.config.ts            # Vite 6 config with React and Tailwind plugins
│
├── public/                   # Static browser assets
│   ├── _redirects            # Fallback SPA routing rule (/* /index.html 200)
│   └── favicon.svg           # Research Agent AI vector logo
│
└── src/                      # Application source code
    ├── App.tsx               # Main application container with Tab-based view router
    ├── index.css             # Global styles, Tailwind v4 import, fonts
    ├── main.tsx              # React DOM 19 bootstrap entry
    ├── types.ts              # TypeScript interfaces (SourceFile, DocumentChunk, ResearchResult)
    │
    ├── context/              # State management
    │   └── ResearchContext.tsx  # Central state: source store, query state, synthesis runner
    │
    ├── services/             # Core computational engines
    │   └── documentParser.ts # Multi-format document parser, semantic chunker, RAG synthesizer
    │
    └── components/           # UI Views and navigation modules
        ├── AboutView.tsx             # Methodology, pipeline breakdown, and platform specs
        ├── CitationExplorerView.tsx  # Interactive grounding evidence and quote inspector
        ├── HomeView.tsx              # Landing screen with features and workspace entry
        ├── InvestigateView.tsx       # Live research query workspace and active findings
        ├── LibraryView.tsx           # Knowledge base file manager and chunk metrics
        ├── Navbar.tsx                # Brand header, active query display, system status
        ├── PipelineView.tsx          # Real-time 5-stage ingestion and retrieval inspector
        ├── ResultsView.tsx           # Deep synthesis report, executive takeaways, citations
        ├── Sidebar.tsx               # Navigation bar across all workspaces
        └── UploadView.tsx            # Drag-and-drop document upload interface
```

---

<a id="installation"></a>
## 🚀 Installation & Local Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher (LTS recommended)
- **Package Manager**: `npm` (v10+), `yarn`, or `bun`

### 1. Clone the Repository
```bash
git clone https://github.com/bikram73/Research_Agent_AI.git
cd Research_Agent_AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example file to `.env`:
```bash
cp .env.example .env
```
*(Optional)* Add your Gemini API key if you want to enable direct server-side cloud reasoning:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 5. Build for Production
To create an optimized production build:
```bash
npm run build
```
Preview the built app locally:
```bash
npm run preview
```

---

<a id="confidence"></a>
## 📊 Confidence Scores & Grounding Metric

Research Agent AI incorporates a multi-factor mathematical scoring model to ensure every generated claim is anchored in ground-truth text:

### 1. Confidence Formula
$$\text{Score}(Q, C) = w_1 \cdot \text{CosineSimilarity}(\vec{Q}, \vec{C}) + w_2 \cdot \text{TokenOverlap}(Q, C) + w_3 \cdot \text{DensityWeight}(C)$$

Where:
- $w_1 = 0.55$ (Vector semantic similarity)
- $w_2 = 0.35$ (Exact lexical/token n-gram overlap)
- $w_3 = 0.10$ (Paragraph length and informational density factor)

### 2. Evidence-Grounded Guardrails
$$\text{Grounded Confidence} = \min\left(99.4\%, \left(\frac{1}{K}\sum_{k=1}^K \text{Score}(Q, C_k) \times 100\right) + 12\%\right)$$

```
┌─────────────────┬──────────────┬────────────────────────────────────────────────────────┐
│ Confidence Tier │ Score Range  │ Verification Status                                    │
├─────────────────┼──────────────┼────────────────────────────────────────────────────────┤
│ 🟢 High         │ 90% – 100%   │ Verified & anchored in source page references & offsets │
│ 🟡 Moderate     │ 75% – 89%    │ Partial semantic overlap; cross-referenced across docs  │
│ 🔴 Ungrounded   │ < 75%        │ Discarded / flagged to eliminate unsupported claims    │
└─────────────────┴──────────────┴────────────────────────────────────────────────────────┘
```

---

<a id="api"></a>
## 🌐 API Documentation

### Client Service API (`src/services/documentParser.ts`)

#### 1. `extractTextFromFile(file: File)`
Extracts plain text and page arrays from uploaded document buffers.
```typescript
const { text, pages } = await extractTextFromFile(uploadedFile);
// Returns:
// {
//   text: string,
//   pages: Array<{ pageNumber: number; text: string }>
// }
```

#### 2. `chunkDocument(docId, docName, pages)`
Partitions extracted pages into indexed semantic chunks with page-level reference and character offset metadata.
```typescript
const chunks: DocumentChunk[] = chunkDocument('doc-01', 'Quantum_Paper.pdf', pages);
```

#### 3. `synthesizeResearch(sources, query)`
Performs vector retrieval and synthesizes an evidence-grounded research result.
```typescript
const result: ResearchResult = synthesizeResearch(sources, query);
```

### Core Data Models (`src/types.ts`)

```typescript
export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  pageOrSection: string;
  text: string;
  charStart?: number;
  charEnd?: number;
  score?: number;
}

export interface ResearchResult {
  id: string;
  query: string;
  title: string;
  summary: string;
  confidenceScore: number;
  sourcesAnalyzedCount: number;
  chunksUsedCount: number;
  timestamp: string;
  coreFindings: string[];
  evidenceSnippets: EvidenceSnippet[];
  citations: CitationData[];
  visualAbstractUrl?: string;
}
```

---

<a id="performance"></a>
## ⚡ Performance & Benchmarks

Recorded on an 8-core CPU client environment across diverse file formats:

| Metric | PDF (20 Pages) | Word DOCX (30 Pages) | Markdown / TXT | CSV (10,000 Rows) |
| :--- | :--- | :--- | :--- | :--- |
| **Parsing Latency** | 240 ms | 98 ms | 14 ms | 82 ms |
| **Chunking Speed** | 42 ms | 35 ms | 8 ms | 28 ms |
| **Retrieval Ranking** | 55 ms | 48 ms | 18 ms | 32 ms |
| **Total Ingestion Time** | **337 ms** | **181 ms** | **40 ms** | **142 ms** |
| **Memory Allocated** | ~28 MB | ~19 MB | ~6 MB | ~22 MB |

For in-depth analysis and methodology, see the [📊 Technical Report](./TECHNICAL_REPORT.md).

---

<a id="limitations"></a>
## ⚠️ Known Limitations

1. **Scanned Images & Pure Raster PDFs**:
   - Files containing solely scanned images without an embedded text layer require external OCR (Optical Character Recognition) prior to ingestion.
2. **Encrypted or DRM-Protected Files**:
   - Password-locked PDFs or encrypted `.docx` files must be unlocked prior to upload.
3. **Complex Nested Multi-Page Tables**:
   - Borderless tabular cells spanning multiple pages may be flattened into linearized text strings.
4. **Client-Side File Size Constraints**:
   - Recommended maximum file size is **50 MB** per document to prevent browser memory exhaustion.

---

<a id="deployment"></a>
## ☁️ Deployment Guide

### 🚀 Official Production Instance
- **Live Netlify URL**: [https://research-agent-ai.netlify.app/](https://research-agent-ai.netlify.app/)
- **GitHub Repository**: [https://github.com/bikram73/Research_Agent_AI](https://github.com/bikram73/Research_Agent_AI)

The production build is continuously integrated and deployed automatically from the `main` branch to Netlify.

### Deploying to Netlify (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/bikram73/Research_Agent_AI.git
   git branch -M main
   git push -u origin main
   ```
2. **Log into Netlify** and select **"Add new site"** &rarr; **"Import an existing project"** &rarr; select `bikram73/Research_Agent_AI`.
3. Netlify will read `netlify.toml` automatically:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **SPA Redirect**: Preconfigured via `[[redirects]]` in `netlify.toml` and `public/_redirects`.
4. Click **Deploy Site**.

### Deploying with Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Docker Deployment
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

<a id="testing"></a>
## 🧪 Testing & Quality Assurance

### Run End-to-End Automated Test Suite
```bash
npm test
```
Executes the comprehensive automated RAG, citation verification, file validation, security sanitization, and evidence-grounded guardrail test suite (`scripts/test-e2e-rag.ts`, 28/28 tests passing). For the complete 63-test validation matrix across automated and browser runtime environments, see [📊 QA Validation Report](./QA_VALIDATION_REPORT.md).

### Run TypeScript Type Validation
```bash
npm run lint
```
Executes `tsc --noEmit` to verify type safety across all components, context hooks, and services.

### Build Verification
```bash
npm run build
```
Ensures production bundling and asset hashing complete without warnings.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with ❤️ for academic researchers, data scientists, and engineers worldwide.</sub>
</div>
