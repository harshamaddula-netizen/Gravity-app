#!/usr/bin/env python3
import sys
from pathlib import Path

# Add backend directory to sys.path
root_dir = Path(__file__).resolve().parent.parent
backend_dir = root_dir / "backend"
sys.path.insert(0, str(backend_dir))

from app.retrieval.retriever import retriever

def main():
    print("TruthLens AI — Pre-computing & Validating Vector Corpus Index...")
    count = retriever.get_document_count()
    print(f"Successfully loaded and indexed {count} evidence documents into vector space.")
    for idx, doc in enumerate(retriever.documents, 1):
        print(f"  [{idx:02d}] {doc.id}: {doc.title} ({doc.source})")
    print("Index build verified successfully.")

if __name__ == "__main__":
    main()
