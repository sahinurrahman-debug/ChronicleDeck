"""Arq worker entrypoint: ``arq app.worker.WorkerSettings``.

Pre-build ships the wiring only. Real jobs (compile, embed, audit) are registered live.
"""

from typing import Any
from urllib.parse import urlparse

from arq.connections import RedisSettings

from app.config import get_settings


async def ping(ctx: dict[str, Any]) -> str:
    return "pong"


def _redis_settings() -> RedisSettings:
    url = urlparse(get_settings().redis_url)
    return RedisSettings(
        host=url.hostname or "localhost",
        port=url.port or 6379,
        database=int(url.path.lstrip("/") or 0),
        password=url.password,
    )


class WorkerSettings:
    functions = [ping]  # noqa: RUF012
    redis_settings = _redis_settings()
