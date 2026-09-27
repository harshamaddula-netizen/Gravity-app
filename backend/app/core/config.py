from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List
import os
from pathlib import Path

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "TruthLens AI"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = ["*"]

    # Demo & Fallback configuration
    DEMO_MODE: bool = True
    
    # Evidence thresholds for Uncertainty Layer
    MIN_EVIDENCE_SCORE: float = 0.55
    MIN_RELEVANT_SOURCES: int = 1
    TOP_K_EVIDENCE: int = 5
    MAX_CLAIM_LENGTH: int = 1000

    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent.parent
    EVIDENCE_DATA_PATH: str = "data/sample_evidence/evidence_corpus.json"
    DATABASE_PATH: str = "truthlens.db"

    # LLM Settings
    LLM_PROVIDER: str = "demo"  # demo | openai | gemini | auto
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    GEMINI_MODEL: str = "gemini-flash-latest"

    # ML Classifier Settings
    ML_MODEL_PATH: str = ""
    ENABLE_TRANSFORMER_CLASSIFIER: bool = False

settings = Settings()
