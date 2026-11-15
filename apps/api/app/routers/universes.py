from fastapi import APIRouter, status
from sqlalchemy import select

from app.deps import CurrentUser, OwnedUniverse, Session
from app.models import Universe
from app.schemas.universe import UniverseCreate, UniverseOut, UniverseUpdate

router = APIRouter(prefix="/universes", tags=["universes"])


@router.get("", response_model=list[UniverseOut])
async def list_universes(user: CurrentUser, session: Session) -> list[Universe]:
    rows = await session.scalars(
        select(Universe).where(Universe.owner_id == user.id).order_by(Universe.created_at.desc())
    )
    return list(rows)


@router.post("", response_model=UniverseOut, status_code=status.HTTP_201_CREATED)
async def create_universe(
    payload: UniverseCreate, user: CurrentUser, session: Session
) -> Universe:
    universe = Universe(owner_id=user.id, **payload.model_dump())
    session.add(universe)
    await session.commit()
    await session.refresh(universe)
    return universe


@router.get("/{universe_id}", response_model=UniverseOut)
async def get_universe(universe: OwnedUniverse) -> Universe:
    return universe


@router.patch("/{universe_id}", response_model=UniverseOut)
async def update_universe(
    payload: UniverseUpdate, universe: OwnedUniverse, session: Session
) -> Universe:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(universe, key, value)
    await session.commit()
    await session.refresh(universe)
    return universe


@router.delete("/{universe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_universe(universe: OwnedUniverse, session: Session) -> None:
    await session.delete(universe)
    await session.commit()
