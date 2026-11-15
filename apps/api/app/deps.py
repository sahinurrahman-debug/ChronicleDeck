"""Shared FastAPI dependencies: current user and ownership-checked resource loaders."""

import uuid
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.models import AppUser, Branch, Chapter, Entity, Language, Universe
from app.security import decode_access_token

Session = Annotated[AsyncSession, Depends(get_session)]
_bearer = HTTPBearer(auto_error=False)


async def current_user(
    session: Session,
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> AppUser:
    user_id = decode_access_token(creds.credentials) if creds else None
    user = await session.get(AppUser, user_id) if user_id else None
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    return user


CurrentUser = Annotated[AppUser, Depends(current_user)]


def _not_found(what: str) -> HTTPException:
    # 404 (not 403) so ids belonging to other users are indistinguishable from missing ones
    return HTTPException(status.HTTP_404_NOT_FOUND, f"{what} not found")


async def owned_universe(universe_id: uuid.UUID, user: CurrentUser, session: Session) -> Universe:
    universe = await session.get(Universe, universe_id)
    if universe is None or universe.owner_id != user.id:
        raise _not_found("Universe")
    return universe


async def _owns(session: AsyncSession, user: AppUser, universe_id: uuid.UUID) -> bool:
    universe = await session.get(Universe, universe_id)
    return universe is not None and universe.owner_id == user.id


async def owned_branch(branch_id: uuid.UUID, user: CurrentUser, session: Session) -> Branch:
    branch = await session.get(Branch, branch_id)
    if branch is None or not await _owns(session, user, branch.universe_id):
        raise _not_found("Branch")
    return branch


async def owned_chapter(chapter_id: uuid.UUID, user: CurrentUser, session: Session) -> Chapter:
    chapter = await session.get(Chapter, chapter_id)
    branch = await session.get(Branch, chapter.branch_id) if chapter else None
    if chapter is None or branch is None or not await _owns(session, user, branch.universe_id):
        raise _not_found("Chapter")
    return chapter


async def owned_entity(entity_id: uuid.UUID, user: CurrentUser, session: Session) -> Entity:
    entity = await session.get(Entity, entity_id)
    if entity is None or not await _owns(session, user, entity.universe_id):
        raise _not_found("Entity")
    return entity


async def owned_language(language_id: uuid.UUID, user: CurrentUser, session: Session) -> Language:
    language = await session.get(Language, language_id)
    if language is None or not await _owns(session, user, language.universe_id):
        raise _not_found("Language")
    return language


OwnedUniverse = Annotated[Universe, Depends(owned_universe)]
OwnedBranch = Annotated[Branch, Depends(owned_branch)]
OwnedChapter = Annotated[Chapter, Depends(owned_chapter)]
OwnedEntity = Annotated[Entity, Depends(owned_entity)]
OwnedLanguage = Annotated[Language, Depends(owned_language)]
