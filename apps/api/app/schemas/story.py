"""Branches, chapters, ledger rows and violations."""

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel, Severity

ViolationKind = Literal["lore", "psyche", "timeline", "voice", "language", "knowledge_leak"]


class BranchCreate(BaseModel):
    label: str = Field(min_length=1)
    parent_branch_id: uuid.UUID | None = None
    fork_chapter_id: uuid.UUID | None = None


class BranchUpdate(BaseModel):
    label: str = Field(min_length=1)


class BranchOut(ORMModel):
    id: uuid.UUID
    universe_id: uuid.UUID
    parent_branch_id: uuid.UUID | None
    fork_chapter_id: uuid.UUID | None
    label: str
    created_at: datetime


class ChapterCreate(BaseModel):
    title: str = ""
    text: str = ""
    mode: str = "draft"


class ChapterUpdate(BaseModel):
    title: str | None = None
    text: str | None = None
    mode: str | None = None


class ChapterOut(ORMModel):
    id: uuid.UUID
    branch_id: uuid.UUID
    idx: int
    title: str
    text: str
    plan: dict[str, Any] | None
    mode: str
    continuity_score: float | None
    created_at: datetime


class ViolationOut(ORMModel):
    id: uuid.UUID
    chapter_id: uuid.UUID
    span_start: int
    span_end: int
    triggering_quote: str
    kind: ViolationKind
    evidence: list[Any]
    message: str
    suggested_fix: str
    severity: Severity
    status: Literal["open", "fixed", "intentional"]


class ProposalCreate(BaseModel):
    kind: str
    payload: dict[str, Any] = Field(default_factory=dict)
    rationale: str = ""


class ProposalOut(ORMModel):
    id: uuid.UUID
    universe_id: uuid.UUID
    kind: str
    payload: dict[str, Any]
    rationale: str
    status: Literal["pending", "accepted", "rejected"]
    created_at: datetime
