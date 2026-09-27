import pytest
from app.decision.engine import DecisionEngine

def test_decision_engine_insufficient_evidence():
    engine = DecisionEngine(min_evidence_score=0.55, min_relevant_sources=1)
    evidence = [
        {"relevance_score": 0.25, "stance": "SUPPORTING"},
        {"relevance_score": 0.15, "stance": "UNCLEAR"}
    ]
    assessment, confidence, summary, caveat = engine.decide(
        claim="Alien bases in Antarctica",
        classifier_result={"label": "INSUFFICIENT_EVIDENCE", "score": 0.5},
        analyzed_evidence=evidence
    )
    assert assessment == "INSUFFICIENT_EVIDENCE"
    assert confidence <= 0.45
    assert "refuses to manufacture certainty" in caveat

def test_decision_engine_supported():
    engine = DecisionEngine(min_evidence_score=0.55, min_relevant_sources=1)
    evidence = [
        {"relevance_score": 0.88, "stance": "SUPPORTING"},
        {"relevance_score": 0.75, "stance": "SUPPORTING"}
    ]
    assessment, confidence, summary, caveat = engine.decide(
        claim="Water boils at 100 degrees Celsius",
        classifier_result={"label": "SUPPORTED", "score": 0.8},
        analyzed_evidence=evidence
    )
    assert assessment == "SUPPORTED"
    assert confidence >= 0.75
    assert summary.supporting == 2

def test_decision_engine_contradicted():
    engine = DecisionEngine(min_evidence_score=0.55, min_relevant_sources=1)
    evidence = [
        {"relevance_score": 0.90, "stance": "CONTRADICTING"},
        {"relevance_score": 0.82, "stance": "CONTRADICTING"}
    ]
    assessment, confidence, summary, caveat = engine.decide(
        claim="Vaccines contain microchips to track citizens",
        classifier_result={"label": "CONTRADICTED", "score": 0.72},
        analyzed_evidence=evidence
    )
    assert assessment == "CONTRADICTED"
    assert confidence >= 0.75
    assert summary.contradicting == 2

def test_decision_engine_mixed():
    engine = DecisionEngine(min_evidence_score=0.55, min_relevant_sources=1)
    evidence = [
        {"relevance_score": 0.82, "stance": "SUPPORTING"},
        {"relevance_score": 0.79, "stance": "CONTRADICTING"}
    ]
    assessment, confidence, summary, caveat = engine.decide(
        claim="Drinking coffee reduces heart disease",
        classifier_result={"label": "MIXED", "score": 0.65},
        analyzed_evidence=evidence
    )
    assert assessment == "MIXED"
    assert summary.supporting >= 1
    assert summary.contradicting >= 1
