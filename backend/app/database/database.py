import aiosqlite
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.schemas.verification import VerifyResponse, HistoryItemResponse, EvidenceItem, EvidenceSummary

logger = logging.getLogger("truthlens")

DB_PATH = Path(settings.BASE_DIR) / settings.DATABASE_PATH
if not DB_PATH.parent.exists():
    DB_PATH = Path("d:/hackathon") / settings.DATABASE_PATH

async def get_db():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        yield db

async def init_db():
    """Initializes the SQLite database tables on startup."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS verifications (
                id TEXT PRIMARY KEY,
                claim TEXT NOT NULL,
                assessment TEXT NOT NULL,
                assessment_confidence REAL NOT NULL,
                explanation TEXT NOT NULL,
                caveat TEXT NOT NULL,
                supporting_count INTEGER NOT NULL DEFAULT 0,
                contradicting_count INTEGER NOT NULL DEFAULT 0,
                unclear_count INTEGER NOT NULL DEFAULT 0,
                processing_time_ms INTEGER NOT NULL,
                created_at TEXT NOT NULL
            );
        """)

        await db.execute("""
            CREATE TABLE IF NOT EXISTS evidence_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                verification_id TEXT NOT NULL,
                title TEXT NOT NULL,
                source TEXT NOT NULL,
                url TEXT,
                passage TEXT NOT NULL,
                relevance_score REAL NOT NULL,
                stance TEXT NOT NULL,
                published_at TEXT,
                FOREIGN KEY(verification_id) REFERENCES verifications(id) ON DELETE CASCADE
            );
        """)
        await db.commit()
    logger.info(f"Initialized SQLite database at {DB_PATH}")

async def save_verification(record: VerifyResponse) -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            INSERT INTO verifications (
                id, claim, assessment, assessment_confidence, explanation,
                caveat, supporting_count, contradicting_count, unclear_count,
                processing_time_ms, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record.id,
            record.claim,
            record.assessment,
            record.assessment_confidence,
            record.explanation,
            record.caveat,
            record.summary.supporting,
            record.summary.contradicting,
            record.summary.unclear,
            record.processing_time_ms,
            record.created_at
        ))

        for item in record.evidence:
            await db.execute("""
                INSERT INTO evidence_items (
                    verification_id, title, source, url, passage,
                    relevance_score, stance, published_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                record.id,
                item.title,
                item.source,
                item.url,
                item.passage,
                item.relevance_score,
                item.stance,
                item.published_at
            ))

        await db.commit()

async def get_history(limit: int = 50) -> List[HistoryItemResponse]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("""
            SELECT v.*, COUNT(e.id) as evidence_count
            FROM verifications v
            LEFT JOIN evidence_items e ON v.id = e.verification_id
            GROUP BY v.id
            ORDER BY v.created_at DESC
            LIMIT ?
        """, (limit,))
        rows = await cursor.fetchall()

        results = []
        for row in rows:
            results.append(HistoryItemResponse(
                id=row["id"],
                claim=row["claim"],
                assessment=row["assessment"],
                assessment_confidence=row["assessment_confidence"],
                explanation=row["explanation"],
                summary=EvidenceSummary(
                    supporting=row["supporting_count"],
                    contradicting=row["contradicting_count"],
                    unclear=row["unclear_count"]
                ),
                evidence_count=row["evidence_count"],
                processing_time_ms=row["processing_time_ms"],
                created_at=row["created_at"]
            ))
        return results

async def get_verification_by_id(verification_id: str) -> Optional[VerifyResponse]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM verifications WHERE id = ?", (verification_id,))
        v_row = await cursor.fetchone()
        if not v_row:
            return None

        e_cursor = await db.execute(
            "SELECT * FROM evidence_items WHERE verification_id = ? ORDER BY relevance_score DESC",
            (verification_id,)
        )
        e_rows = await e_cursor.fetchall()

        evidence_items = [
            EvidenceItem(
                title=e["title"],
                source=e["source"],
                url=e["url"],
                passage=e["passage"],
                relevance_score=e["relevance_score"],
                stance=e["stance"],
                published_at=e["published_at"]
            )
            for e in e_rows
        ]

        return VerifyResponse(
            id=v_row["id"],
            claim=v_row["claim"],
            assessment=v_row["assessment"],
            assessment_confidence=v_row["assessment_confidence"],
            explanation=v_row["explanation"],
            summary=EvidenceSummary(
                supporting=v_row["supporting_count"],
                contradicting=v_row["contradicting_count"],
                unclear=v_row["unclear_count"]
            ),
            evidence=evidence_items,
            caveat=v_row["caveat"],
            processing_time_ms=v_row["processing_time_ms"],
            created_at=v_row["created_at"]
        )

async def delete_verification(verification_id: str) -> bool:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("DELETE FROM evidence_items WHERE verification_id = ?", (verification_id,))
        cursor = await db.execute("DELETE FROM verifications WHERE id = ?", (verification_id,))
        await db.commit()
        return cursor.rowcount > 0
