#!/usr/bin/env python3
import asyncio
import sys
import json
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent
backend_dir = root_dir / "backend"
sys.path.insert(0, str(backend_dir))

from app.database.database import init_db
from app.services.verification_service import verification_service
from app.schemas.verification import VerifyRequest

async def seed():
    print("TruthLens AI — Seeding initial verification demo history...")
    await init_db()

    claims_path = root_dir / "data" / "sample_claims.json"
    with open(claims_path, "r", encoding="utf-8") as f:
        demo_claims = json.load(f)

    for item in demo_claims:
        claim_text = item["claim"]
        print(f"Verifying: '{claim_text}'...")
        req = VerifyRequest(claim=claim_text)
        res = await verification_service.verify_claim(req)
        print(f" -> Assessment: {res.assessment} (Confidence: {int(res.assessment_confidence * 100)}%)")

    print("\nDatabase successfully seeded with demo verification records!")

if __name__ == "__main__":
    asyncio.run(seed())
