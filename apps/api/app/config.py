"""Runtime settings, read from environment / .env."""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://chronicle:chronicle@localhost:5432/chronicle"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str = "dev-only-secret-change-me-in-any-shared-environment"
    jwt_ttl_minutes: int = 60 * 24 * 7
    cors_origins: str = "http://localhost:3000"

    # Providers. Plain configuration: the router that uses these is built live, and nothing in the
    # pre-build calls a model. pydantic-settings does not export .env into os.environ, so the live
    # router passes these keys to the SDK clients explicitly.
    gemini_api_key: str = ""
    gemini_pro_model: str = ""  # pinned at the live build
    gemini_flash_model: str = ""
    adaption_api_key: str = ""
    # Judge: a non-Google model on Adaption's API (cross-family rule, ADR 0004).
    judge_model: str = "qwen3.5-397b"
    judge_fallback_model: str = "deepseek-v4-flash"
    # Creative enhancer (ADR 0007). Empty model = the enhance stage is skipped.
    creative_backend: Literal["adaption", "openai_compatible"] = "adaption"
    creative_model: str = ""
    creative_base_url: str = ""
    creative_api_key: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
