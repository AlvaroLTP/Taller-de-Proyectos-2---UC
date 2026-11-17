from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.helpers import save, validated_patch
from app.core.database import get_db
from app.core.security import get_current_user, require_staff
from app.models import Parameter
from app.schemas.parameter import ParameterBase, ParameterResponse, ParameterUpdate

router = APIRouter(prefix="/api/v1/parameters")


@router.get(
    "/", response_model=ParameterResponse, dependencies=[Depends(get_current_user)]
)
async def get_params(db: AsyncSession = Depends(get_db)):
    params = (
        (await db.execute(select(Parameter).order_by(Parameter.id))).scalars().first()
    )
    return params or ParameterResponse(id=UUID(int=0), **ParameterBase().model_dump())


@router.put(
    "/", response_model=ParameterResponse, dependencies=[Depends(require_staff)]
)
async def update_params(data: ParameterUpdate, db: AsyncSession = Depends(get_db)):
    params = (
        (await db.execute(select(Parameter).order_by(Parameter.id).with_for_update()))
        .scalars()
        .first()
    )
    if params is None:
        params = Parameter(
            **ParameterBase(**data.model_dump(exclude_unset=True)).model_dump()
        )
        db.add(params)
    else:
        validated_patch(params, data, ParameterBase)
    return await save(db, params)
