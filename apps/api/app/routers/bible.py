"""Story bible CRUD: entities, facts, rules, languages (+ lexemes), psyche and dialect rows."""

import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import OwnedEntity, OwnedLanguage, Session
from app.models import (
    Branch,
    ConstraintRule,
    DialectProfile,
    Entity,
    Fact,
    Language,
    Lexeme,
    Psyche,
)
from app.routers._crud import commit_or_409, ensure_in_universe, universe_scoped_router
from app.schemas import bible as s

router = APIRouter()


async def _check_fact(session: AsyncSession, universe_id: uuid.UUID, data: dict[str, Any]) -> None:
    await ensure_in_universe(session, Entity, data["subject_id"], universe_id, "Subject entity")
    await ensure_in_universe(session, Branch, data.get("branch_scope"), universe_id, "Branch")


async def _check_rule(session: AsyncSession, universe_id: uuid.UUID, data: dict[str, Any]) -> None:
    await ensure_in_universe(session, Entity, data.get("entity_id"), universe_id, "Entity")


router.include_router(
    universe_scoped_router(
        prefix="entities",
        tag="entities",
        model=Entity,
        create=s.EntityCreate,
        update=s.EntityUpdate,
        read=s.EntityOut,
    )
)
router.include_router(
    universe_scoped_router(
        prefix="facts",
        tag="facts",
        model=Fact,
        create=s.FactCreate,
        update=s.FactUpdate,
        read=s.FactOut,
        check=_check_fact,
    )
)
router.include_router(
    universe_scoped_router(
        prefix="rules",
        tag="rules",
        model=ConstraintRule,
        create=s.RuleCreate,
        update=s.RuleUpdate,
        read=s.RuleOut,
        check=_check_rule,
    )
)
router.include_router(
    universe_scoped_router(
        prefix="languages",
        tag="languages",
        model=Language,
        create=s.LanguageCreate,
        update=s.LanguageUpdate,
        read=s.LanguageOut,
    )
)


# ---- lexemes (scoped by language) -------------------------------------------------------------


async def _lexeme(session: AsyncSession, language_id: uuid.UUID, lexeme_id: uuid.UUID) -> Lexeme:
    row = await session.get(Lexeme, lexeme_id)
    if row is None or row.language_id != language_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Lexeme not found")
    return row


@router.get("/languages/{language_id}/lexemes", response_model=list[s.LexemeOut], tags=["lexemes"])
async def list_lexemes(
    language: OwnedLanguage,
    session: Session,
    limit: int = Query(500, ge=1, le=2000),
    offset: int = Query(0, ge=0),
) -> list[Lexeme]:
    stmt = select(Lexeme).where(Lexeme.language_id == language.id)
    return list(await session.scalars(stmt.order_by(Lexeme.form).limit(limit).offset(offset)))


@router.post(
    "/languages/{language_id}/lexemes",
    response_model=s.LexemeOut,
    status_code=status.HTTP_201_CREATED,
    tags=["lexemes"],
)
async def create_lexeme(
    payload: s.LexemeCreate, language: OwnedLanguage, session: Session
) -> Lexeme:
    row = Lexeme(language_id=language.id, **payload.model_dump(by_alias=True))
    session.add(row)
    await commit_or_409(session)
    await session.refresh(row)
    return row


@router.patch(
    "/languages/{language_id}/lexemes/{lexeme_id}",
    response_model=s.LexemeOut,
    tags=["lexemes"],
)
async def update_lexeme(
    lexeme_id: uuid.UUID, payload: s.LexemeUpdate, language: OwnedLanguage, session: Session
) -> Lexeme:
    row = await _lexeme(session, language.id, lexeme_id)
    for key, value in payload.model_dump(exclude_unset=True, by_alias=True).items():
        setattr(row, key, value)
    await session.commit()
    await session.refresh(row)
    return row


@router.delete(
    "/languages/{language_id}/lexemes/{lexeme_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["lexemes"],
)
async def delete_lexeme(lexeme_id: uuid.UUID, language: OwnedLanguage, session: Session) -> None:
    await session.delete(await _lexeme(session, language.id, lexeme_id))
    await session.commit()


# ---- psyche + dialect (one row per entity; GET returns the row, PUT upserts it) ----------------


@router.get("/entities/{entity_id}/psyche", response_model=s.PsycheOut, tags=["psyche"])
async def get_psyche(entity: OwnedEntity, session: Session) -> Psyche:
    row = await session.scalar(select(Psyche).where(Psyche.entity_id == entity.id))
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No psyche recorded for this entity")
    return row


@router.put("/entities/{entity_id}/psyche", response_model=s.PsycheOut, tags=["psyche"])
async def put_psyche(payload: s.PsycheIn, entity: OwnedEntity, session: Session) -> Psyche:
    row = await session.scalar(select(Psyche).where(Psyche.entity_id == entity.id))
    if row is None:
        row = Psyche(entity_id=entity.id)
        session.add(row)
    for key, value in payload.model_dump().items():
        setattr(row, key, value)
    await session.commit()
    await session.refresh(row)
    return row


@router.get("/entities/{entity_id}/dialect", response_model=s.DialectOut, tags=["dialect"])
async def get_dialect(entity: OwnedEntity, session: Session) -> DialectProfile:
    row = await session.scalar(select(DialectProfile).where(DialectProfile.entity_id == entity.id))
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No dialect profile for this entity")
    return row


@router.put("/entities/{entity_id}/dialect", response_model=s.DialectOut, tags=["dialect"])
async def put_dialect(
    payload: s.DialectIn, entity: OwnedEntity, session: Session
) -> DialectProfile:
    await ensure_in_universe(
        session, Language, payload.base_language_id, entity.universe_id, "Base language"
    )
    row = await session.scalar(select(DialectProfile).where(DialectProfile.entity_id == entity.id))
    if row is None:
        row = DialectProfile(entity_id=entity.id)
        session.add(row)
    for key, value in payload.model_dump().items():
        setattr(row, key, value)
    await session.commit()
    await session.refresh(row)
    return row
