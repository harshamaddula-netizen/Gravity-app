import pytest
from app.services.claim_preprocessor import preprocessor

def test_preprocessor_normal_claim():
    raw = "   Water boils at 100 degrees Celsius under standard pressure.   "
    cleaned, orig = preprocessor.preprocess(raw)
    assert cleaned == "Water boils at 100 degrees Celsius under standard pressure."
    assert orig == "Water boils at 100 degrees Celsius under standard pressure."

def test_preprocessor_whitespace_normalization():
    raw = "Water   boils\n\n\tat\t100  degrees."
    cleaned, _ = preprocessor.preprocess(raw)
    assert cleaned == "Water boils at 100 degrees."

def test_preprocessor_empty_claim():
    with pytest.raises(ValueError) as exc:
        preprocessor.preprocess("   \n\t  ")
    assert "empty" in str(exc.value).lower()

def test_preprocessor_short_claim():
    with pytest.raises(ValueError) as exc:
        preprocessor.preprocess("Hi")
    assert "too short" in str(exc.value).lower()

def test_preprocessor_excessive_length():
    with pytest.raises(ValueError) as exc:
        preprocessor.preprocess("a" * 1001)
    assert "exceeds" in str(exc.value).lower()
