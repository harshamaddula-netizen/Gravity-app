from fastapi import APIRouter, HTTPException, status
from typing import Optional
import logging

from app.schemas.verification import HistoryListResponse, VerifyResponse
from app.database.database import get_history, get_verification_by_id, delete_verification

logger = logging.getLogger("truthlens")
router = APIRouter(tags=["History"])

@router.get("/history", response_model=HistoryListResponse)
async def list_history(limit: int = 50):
    records = await get_history(limit=limit)
    return HistoryListResponse(total=len(records), items=records)

@router.get("/history/{verification_id}", response_model=VerifyResponse)
async def get_history_item(verification_id: str):
    record = await get_verification_by_id(verification_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Verification record with ID '{verification_id}' not found."
        )
    return record

@router.delete("/history/{verification_id}")
async def delete_history_item(verification_id: str):
    success = await delete_verification(verification_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Verification record with ID '{verification_id}' not found."
        )
    return {"message": f"Verification record '{verification_id}' successfully deleted."}
