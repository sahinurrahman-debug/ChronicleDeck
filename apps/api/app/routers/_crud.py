"""Factory for plain universe-scoped CRUD resources.

Only dumb persistence lives here. Anything with canon semantics (accepting a proposal, forking
a branch with snapshot inheritance, ...) is built live and lives elsewhere.
"""

import uuid
from collections.abc import Awaitable, Callable
from typing import Any

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import OwnedUniverse, Session

# (session, universe_id, validated payload) -> raises HTTPException on bad cross-references
Check = Callable[[AsyncSession, uuid.UUID, dict[str, Any]], Awaitable[None]]


async def ensure_in_universe(
    session: AsyncSession, model: Any, row_id: uuid.UUID | None, universe_id: uuid.UUID, what: str
) -> None:
    """Reject references to rows that don't exist or belong to another universe."""
    if row_id is None:
        return
    row = await session.get(model, row_id)
    if row is None or getattr(row, "universe_id", None) != universe_id:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, f"{what} not in this universe")


async def commit_or_409(session: AsyncSession) -> None:
    try:
        await session.commit()
    except IntegrityError as exc:
        await session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Conflicts with an existing row") from exc


def universe_scoped_router(
    *,
    prefix: str,
    tag: str,
    model: Any,
    create: type[BaseModel],
    read: type[BaseModel],
    update: type[BaseModel] | None = None,
    check: Check | None = None,
    allow_delete: bool = True,
) -> APIRouter:
    router = APIRouter(prefix=f"/universes/{{universe_id}}/{prefix}", tags=[tag])

    async def load(session: AsyncSession, universe_id: uuid.UUID, item_id: uuid.UUID) -> Any:
        row = await session.get(model, item_id)
        if row is None or row.universe_id != universe_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"{tag} not found")
        return row

    @router.get("", response_model=list[read], summary=f"List {prefix}")  # type: ignore[valid-type]
    async def list_items(
        universe: OwnedUniverse,
        session: Session,
        limit: int = Query(100, ge=1, le=500),
        offset: int = Query(0, ge=0),
    ) -> Any:
        stmt = select(model).where(model.universe_id == universe.id)
        rows = await session.scalars(stmt.order_by(model.id).limit(limit).offset(offset))
        return list(rows)

    @router.post(
        "", response_model=read, status_code=status.HTTP_201_CREATED, summary=f"Create {prefix}"
    )
    async def create_item(
        universe: OwnedUniverse,
        session: Session,
        payload: create,  # type: ignore[valid-type]
    ) -> Any:
        data = payload.model_dump()  # type: ignore[attr-defined]
        if check:
            await check(session, universe.id, data)
        row = model(universe_id=universe.id, **data)
        session.add(row)
        await commit_or_409(session)
        await session.refresh(row)
        return row

    @router.get("/{item_id}", response_model=read, summary=f"Get one of {prefix}")
    async def get_item(universe: OwnedUniverse, session: Session, item_id: uuid.UUID) -> Any:
        return await load(session, universe.id, item_id)

    if update is not None:

        @router.patch("/{item_id}", response_model=read, summary=f"Update one of {prefix}")
        async def update_item(
            universe: OwnedUniverse,
            session: Session,
            item_id: uuid.UUID,
            payload: update,  # type: ignore[valid-type]
        ) -> Any:
            row = await load(session, universe.id, item_id)
            for key, value in payload.model_dump(exclude_unset=True).items():  # type: ignore[attr-defined]
                setattr(row, key, value)
            await commit_or_409(session)
            await session.refresh(row)
            return row

    if allow_delete:

        @router.delete(
            "/{item_id}", status_code=status.HTTP_204_NO_CONTENT, summary=f"Delete one of {prefix}"
        )
        async def delete_item(universe: OwnedUniverse, session: Session, item_id: uuid.UUID) -> None:
            row = await load(session, universe.id, item_id)
            await session.delete(row)
            await session.commit()

    return router
