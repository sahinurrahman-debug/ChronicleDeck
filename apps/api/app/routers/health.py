from typing import Any

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text

from app.deps import Session

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/ready")
async def ready(session: Session) -> dict[str, Any]:
    try:
        await session.execute(text("select 1"))
        has_vector = await session.scalar(
            text("select exists (select 1 from pg_extension where extname = 'vector')")
        )
    except Exception as exc:  # noqa: BLE001 - any DB failure means "not ready"
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "database unavailable") from exc
    return {"status": "ready", "pgvector": bool(has_vector)}
