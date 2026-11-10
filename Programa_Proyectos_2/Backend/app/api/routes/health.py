from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text

from app.core.database import get_db

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok"}


@router.get("/health/ready")
async def readiness(db=Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        raise HTTPException(503, "Base de datos no disponible") from None
    return {"status": "ok", "db": True}
