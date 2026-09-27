from typing import List, Dict, Any, Tuple
import logging
from app.core.config import settings
from app.schemas.verification import AssessmentState, EvidenceSummary

logger = logging.getLogger("truthlens")

class DecisionEngine:
    """
    Uncertainty Layer & Core Decision Engine.
    Enforces that LLM is not a sole arbiter of truth.
    Synthesizes ML classifier signals, retrieval relevance scores,
    and stance distributions under configurable quality thresholds.
    """
    def __init__(
        self,
        min_evidence_score: float = settings.MIN_EVIDENCE_SCORE,
        min_relevant_sources: int = settings.MIN_RELEVANT_SOURCES
    ):
        self.min_evidence_score = min_evidence_score
        self.min_relevant_sources = min_relevant_sources

    def decide(
        self,
        claim: str,
        classifier_result: Dict[str, Any],
        analyzed_evidence: List[Dict[str, Any]]
    ) -> Tuple[AssessmentState, float, EvidenceSummary, str]:
        """
        Calculates final assessment state and calibrated confidence score.
        Returns:
            Tuple of (assessment_state, confidence, summary, caveat)
        """
        # Stance counts calculated strictly from analyzed_evidence array
        supporting_count = sum(1 for item in analyzed_evidence if str(item.get("stance", "")).strip().upper() == "SUPPORTING")
        contradicting_count = sum(1 for item in analyzed_evidence if str(item.get("stance", "")).strip().upper() == "CONTRADICTING")
        # Any evidence item with UNCLEAR or invalid/missing status safely falls into unclear count
        unclear_count = len(analyzed_evidence) - (supporting_count + contradicting_count)

        summary = EvidenceSummary(
            supporting=supporting_count,
            contradicting=contradicting_count,
            unclear=unclear_count
        )

        qualifying_evidence = [
            item for item in analyzed_evidence
            if item.get("relevance_score", 0.0) >= self.min_evidence_score
        ]

        base_caveat = (
            "Evidence availability and source quality affect this assessment. "
            "Important scientific, medical, or political claims should be independently verified."
        )

        # 1. Uncertainty check: Insufficient evidence threshold
        if len(qualifying_evidence) < self.min_relevant_sources:
            logger.info(
                f"Uncertainty Layer Triggered: Insufficient evidence for claim. "
                f"Found {len(qualifying_evidence)} items >= {self.min_evidence_score} threshold."
            )
            return (
                "INSUFFICIENT_EVIDENCE",
                0.40,
                summary,
                "TruthLens AI could not retrieve sufficient authoritative, relevant evidence "
                "to reliably confirm or refute this claim. The system refuses to manufacture certainty."
            )

        sup_weight = sum(item["relevance_score"] for item in qualifying_evidence if item.get("stance") == "SUPPORTING")
        con_weight = sum(item["relevance_score"] for item in qualifying_evidence if item.get("stance") == "CONTRADICTING")
        unc_weight = sum(item["relevance_score"] for item in qualifying_evidence if item.get("stance") == "UNCLEAR")

        avg_qualifying_score = sum(item["relevance_score"] for item in qualifying_evidence) / len(qualifying_evidence)

        # 2. Mixed Evidence check: Either active conflict OR high-relevance nuanced/unclear studies with opposing data
        has_conflict = (sup_weight >= 0.40 and con_weight >= 0.40)
        has_nuance = (sup_weight >= 0.40 and unc_weight >= 0.40) or (classifier_result.get("label") == "MIXED" and len(qualifying_evidence) >= 2)

        if has_conflict or has_nuance:
            confidence = round(min(0.92, 0.72 + (avg_qualifying_score * 0.15)), 2)
            return (
                "MIXED",
                confidence,
                summary,
                "Available authoritative literature exhibits substantive debate or conditional outcomes. "
                f"{base_caveat}"
            )

        # 3. Contradicted check: Refuting evidence strongly predominates
        if con_weight > sup_weight:
            confidence = round(min(0.96, 0.78 + (con_weight / (len(qualifying_evidence) + 0.1)) * 0.18), 2)
            return (
                "CONTRADICTED",
                confidence,
                summary,
                f"Retrieved primary evidence actively disproves or refutes this assertion. {base_caveat}"
            )

        # 4. Supported check: Affirmative evidence strongly predominates
        if sup_weight > con_weight:
            confidence = round(min(0.97, 0.78 + (sup_weight / (len(qualifying_evidence) + 0.1)) * 0.18), 2)
            return (
                "SUPPORTED",
                confidence,
                summary,
                f"Retrieved primary documentation directly corroborates this statement. {base_caveat}"
            )

        # 5. Fallback
        return (
            "MIXED",
            0.60,
            summary,
            f"Evidence was retrieved but the stance remains nuanced or unclear. {base_caveat}"
        )

decision_engine = DecisionEngine()
