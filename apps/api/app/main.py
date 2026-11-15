from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, bible, health, live, story, universes


def create_app() -> FastAPI:
    app = FastAPI(
        title="ChronicleDeck API",
        version="0.1.0",
        description="Typed, versioned canon with evidence-backed lint. Pre-build: CRUD + auth only.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_settings().cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    for module in (health, auth, universes, bible, story, live):
        app.include_router(module.router)
    return app


app = create_app()
