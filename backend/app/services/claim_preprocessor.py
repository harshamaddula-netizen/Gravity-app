import re
from typing import Tuple

class ClaimPreprocessor:
    def __init__(self, max_length: int = 1000, min_length: int = 5):
        self.max_length = max_length
        self.min_length = min_length

    def preprocess(self, raw_claim: str) -> Tuple[str, str]:
        """
        Preprocesses and normalizes the input claim.
        Returns:
            Tuple of (cleaned_claim, original_claim)
        Raises:
            ValueError if claim violates validation constraints.
        """
        if not raw_claim or not isinstance(raw_claim, str):
            raise ValueError("Claim input must be a non-empty string.")

        # Strip dangerous non-printable/control characters while keeping standard punctuation & unicode
        sanitized = "".join(ch for ch in raw_claim if ch.isprintable() or ch in ('\n', '\t'))

        # Normalize redundant whitespace (spaces, tabs, newlines)
        cleaned = re.sub(r'\s+', ' ', sanitized).strip()

        if len(cleaned) == 0:
            raise ValueError("Claim cannot be empty or solely whitespace.")

        if len(cleaned) < self.min_length:
            raise ValueError(f"Claim is too short ({len(cleaned)} chars). Please provide a complete factual claim or headline (min {self.min_length} chars).")

        if len(cleaned) > self.max_length:
            raise ValueError(f"Claim exceeds maximum allowed length of {self.max_length} characters (got {len(cleaned)}).")

        return cleaned, raw_claim.strip()

preprocessor = ClaimPreprocessor()
