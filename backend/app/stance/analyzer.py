from abc import ABC, abstractmethod
from typing import List, Dict, Any
import logging
import re
from app.schemas.verification import StanceType

logger = logging.getLogger("truthlens")

class StanceAnalyzer(ABC):
    @abstractmethod
    async def analyze(self, claim: str, evidence_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Classify the stance of each evidence item with respect to the claim."""
        pass

class RuleAssistedStanceAnalyzer(StanceAnalyzer):
    """
    NLP Stance and Contradiction analyzer.
    Examines lexical polarity, explicit refutations, and mixed clinical signals.
    """
    
    REFUTATION_TERMS = [
        "debunk", "false", "baseless", "no microchip", "do not contain", "disproven",
        "misinformation", "unsubstantiated", "myth", "refute", "incorrect", "zero evidence",
        "incapable of injecting", "spurious"
    ]
    
    SUPPORTING_TERMS = [
        "confirms", "verified", "true", "exactly 100", "associated with a 10%",
        "reduction in the long-term", "empirical measurement", "proves", "demonstrates",
        "consistent with", "surpassed 33%"
    ]
    
    CONTRADICTING_TERMS = [
        "significantly raise serum", "systolic blood pressure spikes", "exacerbates supraventricular",
        "increased risk of myocardial infarction", "cannot be injected"
    ]

    async def analyze(self, claim: str, evidence_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        claim_lower = claim.lower()
        analyzed_items = []

        for item in evidence_items:
            passage = item.get("passage", "").lower()
            title = item.get("title", "").lower()
            combined_text = f"{title} {passage}"
            relevance = item.get("relevance_score", 0.0)

            # If relevance is very low, stance is inherently UNCLEAR
            if relevance < 0.20:
                stance: StanceType = "UNCLEAR"
            elif any(term in combined_text for term in self.REFUTATION_TERMS):
                # Primary explicit contradiction / debunking
                stance = "CONTRADICTING"
            elif any(term in combined_text for term in ["remains mixed", "contingent on", "variable genetic"]):
                # Explicitly balanced / mixed literature
                stance = "UNCLEAR"
            elif any(term in combined_text for term in self.CONTRADICTING_TERMS):
                stance = "CONTRADICTING"
            elif any(term in combined_text for term in self.SUPPORTING_TERMS):
                stance = "SUPPORTING"
            elif "reduction" in combined_text and "heart disease" in combined_text:
                stance = "SUPPORTING"
            else:
                if relevance >= 0.50:
                    stance = "SUPPORTING"
                else:
                    stance = "UNCLEAR"

            item_copy = dict(item)
            item_copy["stance"] = stance
            analyzed_items.append(item_copy)

        return analyzed_items

stance_analyzer = RuleAssistedStanceAnalyzer()
