"""Branches, chapters, violations (read-only) and the proposal ledger (create/read only)."""

import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import OwnedBranch, OwnedChapter, Session
from app.models import Branch, Chapter, Proposal, Violation
from app.routers._crud import commit_or_409, ensure_in_universe, universe_scoped_router
from app.schemas import story as s

router = APIRouter()


async def _check_branch(session: AsyncSession, universe_id: uuid.UUID, data: dict[str, Any]) -> None:
    # Plain referential sanity only. Snapshot inheritance on fork is built live.
    await ensure_in_universe(session, Branch, data.get("parent_branch_id"), universe_id, "Parent")
    fork_id = data.get("fork_chapter_id")
    if fork_id is not None:
        chapter = await session.get(Chapter, fork_id)
        parent = await session.get(Branch, chapter.branch_id) if chapter else None
        if parent is None or parent.universe_id != universe_id:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Fork chapter not in this universe")


router.include_router(
    universe_scoped_router(
        prefix="branches",
        tag="branches",
        model=Branch,
        create=s.BranchCreate,
        update=s.BranchUpdate,
        read=s.BranchOut,
        check=_check_branch,
    )
)
# Proposals: the canon ledger. Accept/reject materialises canon, so it is built live (see live.py).
router.include_router(
    universe_scoped_router(
        prefix="proposals",
        tag="proposals",
        model=Proposal,
        create=s.ProposalCreate,
        read=s.ProposalOut,
        allow_delete=False,
    )
)


@router.get("/branches/{branch_id}/chapters", response_model=list[s.ChapterOut], tags=["chapters"])
async def list_chapters(branch: OwnedBranch, session: Session) -> list[Chapter]:
    rows = await session.scalars(
        select(Chapter).where(Chapter.branch_id == branch.id).order_by(Chapter.idx)
    )
    return list(rows)


@router.post(
    "/branches/{branch_id}/chapters",
    response_model=s.ChapterOut,
    status_code=status.HTTP_201_CREATED,
    tags=["chapters"],
)
async def create_chapter(payload: s.ChapterCreate, branch: OwnedBranch, session: Session) -> Chapter:
    last = await session.scalar(select(func.max(Chapter.idx)).where(Chapter.branch_id == branch.id))
    chapter = Chapter(branch_id=branch.id, idx=(last if last is not None else -1) + 1, **payload.model_dump())
    session.add(chapter)
    await commit_or_409(session)
    await session.refresh(chapter)
    return chapter


@router.get("/chapters/{chapter_id}", response_model=s.ChapterOut, tags=["chapters"])
async def get_chapter(chapter: OwnedChapter) -> Chapter:
    return chapter


@router.patch("/chapters/{chapter_id}", response_model=s.ChapterOut, tags=["chapters"])
async def update_chapter(
    payload: s.ChapterUpdate, chapter: OwnedChapter, session: Session
) -> Chapter:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(chapter, key, value)
    await session.commit()
    await session.refresh(chapter)
    return chapter


@router.get(
    "/chapters/{chapter_id}/violations", response_model=list[s.ViolationOut], tags=["violations"]
)
async def list_violations(chapter: OwnedChapter, session: Session) -> list[Violation]:
    rows = await session.scalars(
        select(Violation).where(Violation.chapter_id == chapter.id).order_by(Violation.span_start)
    )
    return list(rows)
