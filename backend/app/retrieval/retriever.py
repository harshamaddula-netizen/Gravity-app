import os
import json
import logging
import re
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path
from app.core.config import settings

logger = logging.getLogger("truthlens")

class Document:
    def __init__(self, id: str, title: str, source: str, url: Optional[str], text: str, published_at: Optional[str] = None):
        self.id = id
        self.title = title
        self.source = source
        self.url = url
        self.text = text
        self.published_at = published_at

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "source": self.source,
            "url": self.url,
            "text": self.text,
            "published_at": self.published_at
        }

def stem(word: str) -> str:
    """Lightweight morphological stemmer for IR overlap."""
    w = word.lower()
    return re.sub(r'(ing|tion|tions|es|s|ed|ly)$', '', w)

class EvidenceRetriever:
    """
    Evidence Retrieval engine with dense/sparse vector search and NumPy cosine-similarity fallback.
    Implements:
    Claim -> Vectorization -> Similarity search -> Ranking -> Relevance normalization.
    """
    STOP_WORDS = {'under', 'the', 'and', 'for', 'with', 'that', 'from', 'this', 'into', 'about', 'such'}

    def __init__(self, corpus_path: Optional[str] = None):
        self.corpus_path = corpus_path or settings.EVIDENCE_DATA_PATH
        self.documents: List[Document] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.doc_vectors: Optional[np.ndarray] = None
        self.mode: str = "tfidf-numpy-cosine"
        self._load_corpus()

    def _load_corpus(self):
        resolved_path = Path(self.corpus_path)
        if not resolved_path.is_absolute():
            resolved_path = settings.BASE_DIR / self.corpus_path

        if not resolved_path.exists():
            resolved_path = Path("d:/hackathon") / self.corpus_path

        if not resolved_path.exists():
            logger.warning(f"Corpus file not found at {resolved_path}. Initializing empty corpus.")
            return

        try:
            with open(resolved_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.documents = [
                    Document(
                        id=item.get("id", f"doc-{idx}"),
                        title=item.get("title", "Untitled Document"),
                        source=item.get("source", "Unknown Source"),
                        url=item.get("url"),
                        text=item.get("text", ""),
                        published_at=item.get("published_at")
                    )
                    for idx, item in enumerate(data)
                ]
            logger.info(f"Loaded {len(self.documents)} evidence documents from {resolved_path}")
            self._build_index()
        except Exception as e:
            logger.error(f"Error loading evidence corpus: {str(e)}")

    def _build_index(self):
        if not self.documents:
            return

        corpus_texts = [f"{doc.title} {doc.text}" for doc in self.documents]

        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            stop_words="english",
            token_pattern=r'(?u)\b\w+\b'
        )
        self.doc_vectors = self.vectorizer.fit_transform(corpus_texts)
        logger.info(f"Indexed {len(self.documents)} documents into vector index ({self.mode}).")

    def retrieve(self, claim: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves top_k relevant evidence documents for a given claim.
        Returns a list of evidence dicts with normalized relevance scores.
        """
        if not self.documents or self.vectorizer is None or self.doc_vectors is None:
            return []

        # Vectorize incoming claim
        claim_vector = self.vectorizer.transform([claim])

        # Compute cosine similarity using vectorized NumPy
        similarities = cosine_similarity(claim_vector, self.doc_vectors).flatten()

        # Extract stems from claim for coverage ratio
        raw_tokens = set(re.findall(r'\b\w{3,}\b', claim.lower())) - self.STOP_WORDS
        claim_stems = {stem(t) for t in raw_tokens}

        scored_items = []
        for idx, doc in enumerate(self.documents):
            raw_cosine = float(similarities[idx])
            
            # Calculate stem overlap
            doc_raw_tokens = set(re.findall(r'\b\w{3,}\b', f"{doc.title} {doc.text}".lower()))
            doc_stems = {stem(t) for t in doc_raw_tokens}
            overlap_ratio = len(claim_stems & doc_stems) / max(1, len(claim_stems))

            # Scaled cosine + stem overlap
            scaled_cosine = min(1.0, raw_cosine * 2.2)
            combined_score = (0.50 * scaled_cosine) + (0.50 * overlap_ratio)

            # Bonus for source presence & URL
            if doc.url and combined_score > 0.3:
                combined_score = min(1.0, combined_score + 0.05)

            normalized_score = round(max(0.0, min(1.0, combined_score)), 4)

            scored_items.append((normalized_score, doc))

        # Sort descending by score
        scored_items.sort(key=lambda x: x[0], reverse=True)

        results = []
        for score, doc in scored_items[:top_k]:
            results.append({
                "id": doc.id,
                "title": doc.title,
                "source": doc.source,
                "url": doc.url,
                "passage": doc.text,
                "relevance_score": score,
                "published_at": doc.published_at
            })

        return results

    def get_document_count(self) -> int:
        return len(self.documents)

retriever = EvidenceRetriever()
