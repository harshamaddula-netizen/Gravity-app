from fastapi import APIRouter
from app.core.config import settings
from app.schemas.verification import HealthResponse
from app.retrieval.retriever import retriever
from app.ml.classifier import classifier
from app.llm.provider import llm_provider

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def get_health():
    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        demo_mode=settings.DEMO_MODE,
        classifier_mode=getattr(classifier, "__class__", type(classifier)).__name__,
        retriever_mode=retriever.mode,
        llm_provider=getattr(llm_provider, "__class__", type(llm_provider)).__name__,
        total_indexed_documents=retriever.get_document_count()
    )
