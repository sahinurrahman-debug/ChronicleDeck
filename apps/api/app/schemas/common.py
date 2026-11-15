from typing import Literal

from pydantic import BaseModel, ConfigDict

CanonStatus = Literal["canon", "proposed", "rejected"]
Severity = Literal["info", "warn", "error"]


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
