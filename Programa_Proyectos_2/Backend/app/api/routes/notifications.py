from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update

from app.core.database import get_db
from app.core.security import CurrentUser, get_current_user, require_staff
from app.models import Notification

router = APIRouter(prefix="/api/v1/notifications")


@router.get("/")
async def list_notifications(
    user: CurrentUser = Depends(get_current_user), db=Depends(get_db)
):
    if user.role == "driver":
        return []
    return (
        (
            await db.execute(
                select(Notification).order_by(Notification.created_at.desc())
            )
        )
        .scalars()
        .all()
    )


@router.put("/read", dependencies=[Depends(require_staff)])
async def read_all(db=Depends(get_db)):
    await db.execute(update(Notification).values(read=True))
    await db.commit()
    return {"status": "updated"}


@router.put("/{id}/read", dependencies=[Depends(require_staff)])
async def read_one(id: UUID, db=Depends(get_db)):
    obj = await db.get(Notification, id)
    if not obj:
        raise HTTPException(404, "No encontrado")
    obj.read = True
    await db.commit()
    return {"status": "updated"}
