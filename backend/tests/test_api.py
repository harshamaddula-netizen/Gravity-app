import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_verify_claim_supported():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"claim": "Water boils at 100 degrees Celsius under standard atmospheric pressure."}
        response = await ac.post("/api/v1/verify", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["assessment"] == "SUPPORTED"
        assert data["assessment_confidence"] > 0.6
        assert len(data["evidence"]) > 0
        assert data["summary"]["supporting"] >= 1
        assert "caveat" in data
        assert "processing_time_ms" in data
        assert "id" in data

@pytest.mark.asyncio
async def test_verify_claim_contradicted():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"claim": "Vaccines contain microchips to secretly track citizens."}
        response = await ac.post("/api/v1/verify", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["assessment"] == "CONTRADICTED"
        assert data["summary"]["contradicting"] >= 1

@pytest.mark.asyncio
async def test_verify_claim_mixed():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"claim": "Drinking coffee significantly reduces the risk of heart disease."}
        response = await ac.post("/api/v1/verify", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["assessment"] == "MIXED"

@pytest.mark.asyncio
async def test_verify_claim_insufficient_evidence():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"claim": "Extraterrestrial beings established a secret hyper-quantum base beneath Mount Vinson in 1947."}
        response = await ac.post("/api/v1/verify", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["assessment"] == "INSUFFICIENT_EVIDENCE"
        assert "refuses to manufacture certainty" in data["explanation"].lower() or "refuses to manufacture certainty" in data["caveat"].lower()

@pytest.mark.asyncio
async def test_verify_empty_claim_validation_error():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/verify", json={"claim": "    "})
        assert response.status_code == 422

@pytest.mark.asyncio
async def test_history_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # First verify a claim
        payload = {"claim": "Water boils at 100 degrees Celsius under standard atmospheric pressure."}
        v_res = await ac.post("/api/v1/verify", json=payload)
        v_data = v_res.json()
        rec_id = v_data["id"]

        # List history
        h_res = await ac.get("/api/v1/history")
        assert h_res.status_code == 200
        h_data = h_res.json()
        assert h_data["total"] >= 1

        # Fetch single record
        single_res = await ac.get(f"/api/v1/history/{rec_id}")
        assert single_res.status_code == 200
        assert single_res.json()["id"] == rec_id

        # Delete single record
        del_res = await ac.delete(f"/api/v1/history/{rec_id}")
        assert del_res.status_code == 200

        # Confirm 404 after deletion
        not_found_res = await ac.get(f"/api/v1/history/{rec_id}")
        assert not_found_res.status_code == 404
