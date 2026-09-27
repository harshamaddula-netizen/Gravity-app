import pytest
from app.retrieval.retriever import retriever

def test_retriever_returns_ranked_results():
    claim = "Water boils at 100 degrees Celsius"
    results = retriever.retrieve(claim, top_k=3)
    assert len(results) > 0
    assert len(results) <= 3
    
    # Check score normalization (0.0 to 1.0)
    for res in results:
        assert 0.0 <= res["relevance_score"] <= 1.0
        assert "title" in res
        assert "source" in res
        assert "passage" in res

    # Top result should have strong relevance to water boiling
    top_result = results[0]
    assert "boiling" in top_result["passage"].lower() or "boiling" in top_result["title"].lower()

def test_retriever_low_relevance_for_unrelated_claim():
    claim = "Martian quantum sub-surface colony 1947"
    results = retriever.retrieve(claim, top_k=3)
    # Even if returned, relevance scores should be low (<0.40)
    if results:
        assert results[0]["relevance_score"] < 0.40
