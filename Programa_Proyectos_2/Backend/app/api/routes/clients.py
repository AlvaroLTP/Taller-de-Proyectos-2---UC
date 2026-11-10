from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.helpers import get_record, save, scoped, validated_patch
from app.core.database import get_db
from app.core.security import CurrentUser, get_current_user, require_staff
from app.models import Client
from app.schemas.client import ClientBase, ClientCreate, ClientResponse, ClientUpdate

router = APIRouter(prefix="/api/v1/clients")


@router.get("/", response_model=list[ClientResponse])
async def list_records(
    user: CurrentUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return (await db.execute(scoped(Client, user).order_by(Client.id))).scalars().all()


@router.get("/{id}", response_model=ClientResponse)
async def get_one(
    id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_record(db, Client, id, user)


@router.post("/", response_model=ClientResponse, status_code=201)
async def create(
    data: ClientCreate,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    obj = Client(**data.model_dump())
    db.add(obj)
    return await save(db, obj)


@router.put("/{id}", response_model=ClientResponse)
@router.patch("/{id}", response_model=ClientResponse)
async def update(
    id: UUID,
    data: ClientUpdate,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    obj = await get_record(db, Client, id, user, lock=True)
    validated_patch(obj, data, ClientBase)
    return await save(db, obj)


@router.delete("/{id}")
async def delete(
    id: UUID,
    user: CurrentUser = Depends(require_staff),
    db: AsyncSession = Depends(get_db),
):
    obj = await get_record(db, Client, id, user, lock=True)
    await db.delete(obj)
    await db.commit()
    return {"status": "deleted"}
