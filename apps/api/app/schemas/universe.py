import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class UniverseCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    genre_tags: list[str] = Field(default_factory=list)


class UniverseUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    genre_tags: list[str] | None = None


class UniverseOut(ORMModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    title: str
    genre_tags: list[str]
    schema_version: int
    created_at: datetime
