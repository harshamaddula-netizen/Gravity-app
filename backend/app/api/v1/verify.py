from fastapi import APIRouter, HTTPException, Header, status
from typing import Optional
import uuid
import logging

from app.schemas.verification import VerifyRequest, VerifyResponse
from app.services.verification_service import verification_service

logger = logging.getLogger("truthlens")
router = APIRouter(tags=["Verification"])

@router.post("/verify", response_model=VerifyResponse, status_code=status.HTTP_200_OK)
async def verify_claim(
    request: VerifyRequest,
    x_request_id: Optional[str] = Header(None)
):
    req_id = x_request_id or str(uuid.uuid4())
    try:
        response = await verification_service.verify_claim(request, request_id=req_id)
        return response
    except ValueError as ve:
        logger.warning(f"Validation error for request {req_id}: {str(ve)}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error processing claim verification {req_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while verifying the claim. Please try again."
        )
