# TruthLens AI — Architectural Specification

## System Overview
TruthLens AI is an evidence-first misinformation verification assistant. Unlike generative AI systems that produce unverified affirmations, TruthLens enforces a decoupled verification architecture with a mathematical uncertainty layer.

```
                    ┌─────────────────────────┐
                    │    User Claim Input     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ 1. Claim Preprocessing  │
                    │    (Sanitize & Bounds)  │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
    ┌─────────────────────────┐     ┌─────────────────────────┐
    │ 2. ML Classifier Signal │     │ 3. Vector Retriever     │
    │    (Fallback / PyTorch) │     │    (TF-IDF / FAISS)     │
    └────────────┬────────────┘     └────────────┬────────────┘
                 │                               │
                 │                               ▼
                 │                  ┌─────────────────────────┐
                 │                  │ 4. Stance Analysis      │
                 │                  │    (Support/Contradict) │
                 │                  └────────────┬────────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ 5. Uncertainty &        │
                    │    Decision Engine      │
                    │ (Threshold Enforcement) │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ 6. LLM Reasoning Engine │
                    │ (Grounded Explanations) │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
    ┌─────────────────────────┐     ┌─────────────────────────┐
    │ 7. SQLite Persistence   │     │ 8. React UI Dashboard   │
    │    (Auditable Sessions) │     │ (Accessible Cards & UX) │
    └─────────────────────────┘     └─────────────────────────┘
```

## Architectural Layers

### 1. Preprocessing Layer (`app.services.claim_preprocessor`)
- Strips non-printable and control characters.
- Normalizes excess whitespace and tabs into single spaces.
- Enforces strict length constraints ($5 \le \text{chars} \le 1000$).
- Preserves the verbatim original text for UI representation.

### 2. Preliminary ML Signal (`app.ml.classifier`)
- Implements an abstract `ClaimClassifier` interface.
- Includes a production transformer hook and a clearly documented `HeuristicFallbackClassifier`.
- Logs its operational mode to system stdout.

### 3. Vector Retrieval & Ranking (`app.retrieval.retriever`)
- Indexes documents from `data/sample_evidence/evidence_corpus.json`.
- Calculates sublinear term-frequency dot-product similarities via NumPy with fallback support.
- Enhances pure cosine similarity with lexical stem coverage:
  $$\text{Relevance} = 0.50 \cdot \text{CosineSim}_{\text{scaled}} + 0.50 \cdot \text{StemCoverage}$$
- Normalizes output strictly within $[0.0, 1.0]$.

### 4. Stance & Contradiction Analyzer (`app.stance.analyzer`)
- Classifies individual retrieved passages into:
  - `SUPPORTING`: Documents affirming the claim parameters.
  - `CONTRADICTING`: Documents actively refuting, debunking, or disproving the claim.
  - `UNCLEAR`: Documents providing contextual, inconclusive, or genotype-conditional data.

### 5. Uncertainty & Decision Engine (`app.decision.engine`)
- Decouples assessment determination from generative text generation.
- Enforces quality gates:
  - If $\max(\text{relevance}) < \text{MIN\_EVIDENCE\_SCORE}$ or $\text{sources} < \text{MIN\_RELEVANT\_SOURCES}$:
    $\to \mathbf{INSUFFICIENT\_EVIDENCE}$
  - If $\text{SupportWeight} \ge 0.40$ and $\text{ContradictWeight} \ge 0.40$:
    $\to \mathbf{MIXED}$
  - If $\text{SupportWeight} > \text{ContradictWeight}$:
    $\to \mathbf{SUPPORTED}$
  - If $\text{ContradictWeight} > \text{SupportWeight}$:
    $\to \mathbf{CONTRADICTED}$

### 6. LLM Reasoning Abstraction (`app.llm.provider`)
- Abstracts the LLM provider (`DemoLLMProvider`, `OpenAILLMProvider`, `GeminiLLMProvider`).
- Injects explicit constraints:
  1. Do not invent citations.
  2. Do not manufacture URLs.
  3. Ground all statements in the retrieved passages.
  4. If evidence is inadequate, clearly report uncertainty.

### 7. Audit & Persistence (`app.database.database`)
- Stores verification runs and evidence citations in SQLite tables (`verifications`, `evidence_items`).
- Provides full history inspection and deletion.
