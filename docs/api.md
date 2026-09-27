# TruthLens AI — REST API Reference

TruthLens AI exposes a fully typed REST API conforming to OpenAPI 3.1 standards.
Interactive Swagger documentation is available at `/docs` and raw OpenAPI schemas at `/openapi.json`.

---

## Endpoints

### 1. Health & System Status
**GET** `/api/v1/health`

Returns operational telemetry, configured execution modes, and index size.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "app_name": "TruthLens AI",
  "version": "1.0.0",
  "demo_mode": true,
  "classifier_mode": "HeuristicFallbackClassifier",
  "retriever_mode": "tfidf-numpy-cosine",
  "llm_provider": "DemoLLMProvider",
  "total_indexed_documents": 10
}
```

---

### 2. Verify Claim
**POST** `/api/v1/verify`

Main verification endpoint. Ingests a claim, retrieves evidence, executes stance analysis, evaluates uncertainty, and synthesizes grounded reasoning.

**Request Body:**
```json
{
  "claim": "Water boils at 100 degrees Celsius under standard atmospheric pressure."
}
```

**Response (200 OK):**
```json
{
  "id": "e81d8c19-1588-4226-80f4-5f5f410c5a0f",
  "claim": "Water boils at 100 degrees Celsius under standard atmospheric pressure.",
  "assessment": "SUPPORTED",
  "assessment_confidence": 0.94,
  "explanation": "The claim is substantiated by authoritative scientific and empirical literature...",
  "summary": {
    "supporting": 2,
    "contradicting": 0,
    "unclear": 3
  },
  "evidence": [
    {
      "title": "Thermodynamics of Phase Transitions: Boiling Point of Water at Atmospheric Pressure",
      "source": "National Bureau of Standards / NIST Journal of Physical Chemistry",
      "url": "https://www.nist.gov/data/thermodynamics-water-boiling",
      "passage": "Under standard atmospheric pressure defined as 1 atmosphere...",
      "relevance_score": 0.95,
      "stance": "SUPPORTING",
      "published_at": "2023-01-15"
    }
  ],
  "caveat": "Evidence availability and source quality affect this assessment...",
  "processing_time_ms": 14,
  "created_at": "2026-09-23T16:00:00Z"
}
```

**Assessment States:**
- `SUPPORTED`
- `CONTRADICTED`
- `MIXED`
- `INSUFFICIENT_EVIDENCE`

---

### 3. Verification History
**GET** `/api/v1/history?limit=50`

Returns a list of previous verification runs stored in the local SQLite database.

**Response (200 OK):**
```json
{
  "total": 4,
  "items": [
    {
      "id": "...",
      "claim": "...",
      "assessment": "SUPPORTED",
      "assessment_confidence": 0.94,
      "explanation": "...",
      "summary": { "supporting": 2, "contradicting": 0, "unclear": 3 },
      "evidence_count": 5,
      "processing_time_ms": 14,
      "created_at": "2026-09-23T16:00:00Z"
    }
  ]
}
```

---

### 4. Fetch Single Verification
**GET** `/api/v1/history/{id}`

Returns the full verification record and attached evidence items for a given ID.

---

### 5. Delete Verification
**DELETE** `/api/v1/history/{id}`

Removes a verification record and its linked evidence from the audit database.
