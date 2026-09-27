from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Literal
from datetime import datetime
import uuid

# Allowed assessment states as strictly defined in specs
AssessmentState = Literal["SUPPORTED", "CONTRADICTED", "MIXED", "INSUFFICIENT_EVIDENCE"]
StanceType = Literal["SUPPORTING", "CONTRADICTING", "UNCLEAR"]

class VerifyRequest(BaseModel):
    claim: str = Field(..., description="The factual claim or headline to be verified")

    @field_validator("claim")
    @classmethod
    def validate_claim(cls, v: str) -> str:
        cleaned = " ".join(v.strip().split())
        if not cleaned:
            raise ValueError("Claim cannot be empty or solely whitespace.")
        if len(cleaned) < 5:
            raise ValueError("Claim must be at least 5 characters long.")
        if len(cleaned) > 1000:
            raise ValueError("Claim cannot exceed 1000 characters.")
        return cleaned

class EvidenceItem(BaseModel):
    title: str = Field(..., description="Title of the evidence document")
    source: str = Field(..., description="Publishing organization or domain")
    url: Optional[str] = Field(None, description="Direct URL to source if available")
    passage: str = Field(..., description="Direct excerpt or relevant passage")
    relevance_score: float = Field(..., ge=0.0, le=1.0, description="Normalized semantic relevance score")
    stance: StanceType = Field(..., description="Relationship to claim: SUPPORTING, CONTRADICTING, or UNCLEAR")
    published_at: Optional[str] = Field(None, description="Date of publication (ISO or YYYY-MM-DD)")

class EvidenceSummary(BaseModel):
    supporting: int = Field(0, description="Count of supporting evidence passages")
    contradicting: int = Field(0, description="Count of contradicting evidence passages")
    unclear: int = Field(0, description="Count of neutral or unclear evidence passages")

class VerifyResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    claim: str
    assessment: AssessmentState
    assessment_confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence in assessment based on evidence")
    explanation: str = Field(..., description="Evidence-grounded structured explanation")
    summary: EvidenceSummary
    evidence: List[EvidenceItem]
    caveat: str = Field(..., description="Limitation caveat and responsible AI notice")
    processing_time_ms: int
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class HistoryItemResponse(BaseModel):
    id: str
    claim: str
    assessment: AssessmentState
    assessment_confidence: float
    explanation: str
    summary: EvidenceSummary
    evidence_count: int
    processing_time_ms: int
    created_at: str

class HistoryListResponse(BaseModel):
    total: int
    items: List[HistoryItemResponse]

class HealthResponse(BaseModel):
    status: str = "healthy"
    app_name: str
    version: str
    demo_mode: bool
    classifier_mode: str
    retriever_mode: str
    llm_provider: str
    total_indexed_documents: int
