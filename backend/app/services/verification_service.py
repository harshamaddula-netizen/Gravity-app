import time
import uuid
import logging
from datetime import datetime
from typing import Dict, Any

from app.core.config import settings
from app.schemas.verification import VerifyRequest, VerifyResponse, EvidenceItem, EvidenceSummary
from app.services.claim_preprocessor import preprocessor
from app.ml.classifier import classifier
from app.retrieval.retriever import retriever
from app.stance.analyzer import stance_analyzer
from app.decision.engine import decision_engine
from app.llm.provider import llm_provider
from app.database.database import save_verification

logger = logging.getLogger("truthlens")

class VerificationService:
    async def verify_claim(self, request: VerifyRequest, request_id: str = None) -> VerifyResponse:
        start_time = time.time()
        request_id = request_id or str(uuid.uuid4())

        # Step 1: Preprocessing & sanitization
        cleaned_claim, original_claim = preprocessor.preprocess(request.claim)

        # Step 2: ML classification preliminary signal
        classifier_result = await classifier.classify(cleaned_claim)

        # Step 3: Evidence retrieval from vector corpus
        retrieved_items = retriever.retrieve(cleaned_claim, top_k=settings.TOP_K_EVIDENCE)

        # Step 4: Stance & contradiction analysis
        analyzed_items = await stance_analyzer.analyze(cleaned_claim, retrieved_items)

        # Step 5: Uncertainty calculation & decision engine
        assessment, confidence, summary, caveat = decision_engine.decide(
            claim=cleaned_claim,
            classifier_result=classifier_result,
            analyzed_evidence=analyzed_items
        )

        # Step 6: LLM evidence-grounded explanation
        explanation = await llm_provider.generate_explanation(
            claim=cleaned_claim,
            assessment=assessment,
            confidence=confidence,
            evidence_items=analyzed_items,
            classifier_result=classifier_result
        )

        # Format final evidence items
        evidence_list = [
            EvidenceItem(
                title=item["title"],
                source=item["source"],
                url=item.get("url"),
                passage=item["passage"],
                relevance_score=item["relevance_score"],
                stance=item["stance"],
                published_at=item.get("published_at")
            )
            for item in analyzed_items
        ]

        elapsed_ms = int((time.time() - start_time) * 1000)

        response = VerifyResponse(
            id=request_id,
            claim=original_claim,
            assessment=assessment,
            assessment_confidence=confidence,
            explanation=explanation,
            summary=summary,
            evidence=evidence_list,
            caveat=caveat,
            processing_time_ms=elapsed_ms,
            created_at=datetime.utcnow().isoformat() + "Z"
        )

        # Step 7: Persist verification to SQLite database
        try:
            await save_verification(response)
        except Exception as e:
            logger.error(f"Failed to persist verification record to SQLite: {str(e)}")

        # Observability log
        extra_log = {
            "request_id": request_id,
            "processing_time_ms": elapsed_ms,
            "retrieval_count": len(evidence_list),
            "assessment": assessment
        }
        logger.info(f"Verification completed: {assessment} ({elapsed_ms}ms)", extra=extra_log)

        return response

verification_service = VerificationService()
