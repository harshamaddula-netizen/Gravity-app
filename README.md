# TruthLens AI

> **Verify before you trust or share.**  
> An evidence-first misinformation verification assistant with an integrated uncertainty layer.

---

## 1. Project Overview

**TruthLens AI** is an intelligent, evidence-grounded verification platform engineered to evaluate factual claims and viral headlines without acting as an unconstrained "truth machine." 

Traditional AI assistants often act as overconfident guessers, manufacturing hallucinations or forcing binary True/False verdicts. TruthLens AI introduces an **evidence-first pipeline** and an independent **Uncertainty Layer** that enforces four distinct assessment states:

- **Supported**: Primary authoritative literature empirically corroborates the claim.
- **Contradicted**: Credible investigative, scientific, or regulatory benchmarks actively refute the assertion.
- **Mixed Evidence**: Peer-reviewed studies or authoritative accounts present conflicting outcomes, genotype-specific variances, or conditional trade-offs.
- **Insufficient Evidence**: The system refuses to manufacture certainty when verified corpus evidence is inadequate or below configured quality thresholds.

---

## 2. Key Features

- **One-Click End-to-End Verification**: From claim input to structured evidence dashboard with one click.
- **Uncertainty & Decision Layer**: Mathematically decouples the final verification assessment from generative hallucination (`MIN_EVIDENCE_SCORE = 0.55`, `MIN_RELEVANT_SOURCES = 1`).
- **Dense/Sparse Vector Retrieval**: Fast vector search with sublinear TF-IDF, lexical stem coverage, and seamless FAISS / NumPy cosine similarity fallback.
- **Stance & Contradiction Analysis**: Classifies every retrieved passage as `SUPPORTING`, `CONTRADICTING`, or `UNCLEAR`.
- **LLM Reasoning Abstraction**: Pluggable provider architecture (`DemoLLMProvider`, `OpenAILLMProvider`, `GeminiLLMProvider`) enforcing strict grounding rules.
- **Auditable History**: Persistent SQLite audit database tracking all claims, assessments, confidence scores, and source citations.
- **Accessible, Research-Grade UI**: React 18 dashboard built with Tailwind CSS, distinct visual/iconographic indicators for color-blind accessibility, responsive across desktop, tablet, and mobile.
- **Safe Offline Demo Mode**: Fully operational out of the box with zero paid API keys or heavy GPU requirements.

---

## 3. Architecture & Dataflow

```
User Claim
    │
    ▼
Claim Preprocessor (whitespace normalization, sanitization, length bounds)
    │
    ├──► ML Classifier Signal (preliminary classification signal)
    │
    └──► Vector Evidence Retriever (sublinear TF-IDF / embeddings + cosine similarity)
             │
             ▼
         Evidence Ranking & Stance Analysis (Supporting / Contradicting / Unclear)
             │
             ▼
         Uncertainty Layer & Decision Engine (Threshold enforcement)
             │
             ▼
         LLM Reasoning Engine (Evidence-grounded explanation synthesis)
             │
             ▼
         SQLite Persistence & Frontend Result Dashboard
```

See [`docs/architecture.md`](docs/architecture.md) for full technical specifications.

---

## 4. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router.
- **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2, Pydantic-Settings, HTTPX.
- **Retrieval & NLP**: Scikit-Learn, NumPy vector math, sublinear TF-IDF, morphological stem matching, FAISS/NumPy fallback.
- **Database**: SQLite with `aiosqlite` async connection pooling.
- **Testing**: Pytest, Pytest-Asyncio, HTTPX ASGI client.
- **DevOps**: Docker, Docker Compose, Multi-stage builds.

---

## 5. Local Setup & Quickstart

### Prerequisites
- Python 3.11+
- Node.js v18+ & npm

### Clone & Navigate
```bash
git clone https://github.com/your-repo/truthlens-ai.git
cd truthlens-ai
```

### 1. Backend Setup
```bash
# Optional: create a virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Copy environment variables
cp .env.example .env
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

---

## 6. Running Locally

### Option A: Run Backend and Frontend Concurrently

**Terminal 1 — Backend:**
```bash
# From workspace root
python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```
*Backend API available at: `http://127.0.0.1:8000`*  
*Swagger Documentation: `http://127.0.0.1:8000/docs`*

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
*Frontend Application available at: `http://localhost:5173`*

---

## 7. Running Automated Tests

Run the complete backend integration test suite:
```bash
python -m pytest backend/tests -v
```
*Verifies all 18 automated test cases covering health checks, claim validation, retrieval ranking, decision engine states, and history CRUD.*

Test frontend production build:
```bash
cd frontend && npm run build
```

---

## 8. Helper Scripts

- **Pre-compute and validate vector index:**
  ```bash
  python scripts/build_index.py
  ```
- **Seed initial demo verification records into database:**
  ```bash
  python scripts/seed_demo_data.py
  ```
- **CLI Health Check:**
  ```bash
  python scripts/health_check.py
  ```

---

## 9. Environment Variables

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | `TruthLens AI` | Application branding name |
| `PORT` | `8000` | Backend server port |
| `HOST` | `0.0.0.0` | Bind host address |
| `DEMO_MODE` | `true` | Enables offline demo execution |
| `MIN_EVIDENCE_SCORE` | `0.55` | Minimum relevance threshold for qualifying evidence |
| `MIN_RELEVANT_SOURCES`| `1` | Minimum sources required to prevent `INSUFFICIENT_EVIDENCE` |
| `LLM_PROVIDER` | `demo` | Provider: `demo`, `openai`, `gemini`, or `auto` |
| `OPENAI_API_KEY` | `""` | Optional OpenAI API Key |
| `GEMINI_API_KEY` | `""` | Optional Google Gemini API Key |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API URL for frontend |

---

## 10. Replacing the Fallback ML Model

TruthLens is designed with a pluggable ML classifier interface (`app/ml/classifier.py`).

To replace the `HeuristicFallbackClassifier` with a fine-tuned transformer (e.g. RoBERTa-NLI or DeBERTa):
1. Install transformers: `pip install transformers torch`
2. Download or train a sequence classification model (e.g. fine-tuned on FEVER or MultiNLI).
3. Set in `.env`:
   ```env
   ENABLE_TRANSFORMER_CLASSIFIER=true
   ML_MODEL_PATH=/path/to/saved_model_checkpoint
   ```
4. The classifier factory in `app/ml/classifier.py` will automatically load the PyTorch pipeline on startup while retaining the fallback if initialization fails.

---

## 11. Deployment (Docker & Replit)

### Docker Compose
Run both backend and frontend in Docker:
```bash
docker-compose up --build
```

### Replit Deployment
TruthLens AI is pre-configured for Replit. See [`replit.md`](replit.md) for full configuration, `.replit` specifications, and port bindings.

---

## 12. Limitations & Future Work

- **Local Corpus Boundary**: The out-of-the-box MVP uses a curated reference corpus of 10 authoritative documents. Claims outside this corpus trigger `INSUFFICIENT_EVIDENCE` by design.
- **External Search Extension**: The `ExternalEvidenceProvider` interface (`app/retrieval/external.py`) is architected to allow plugging in Tavily, Google Fact Check, or Bing APIs for real-time web retrieval.
- **Multi-Modal Verification**: Future iterations will support image metadata verification and deepfake forensic classifiers.

---

## 13. Responsible AI Statement

TruthLens AI provides evidence-based assistance, not absolute truth. Evidence may be incomplete, outdated, or conflicting. The system is explicitly configured to communicate uncertainty, display primary citations, and refuse to manufacture certainty for speculative or unsubstantiated claims.
