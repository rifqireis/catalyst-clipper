"""Entry point FastAPI untuk Catalyst POC."""

from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.core.config import settings
from app.db.database import get_engine, initialize_database
from app.models import User, UserRole
from app.routers import clips, donations

DEFAULT_CLIPPER_ID = 1
logger = logging.getLogger(__name__)


def seed_default_clipper() -> None:
    """Menyiapkan clipper demo agar antrean POC selalu punya target valid."""
    with Session(get_engine()) as session:
        clipper = session.get(User, DEFAULT_CLIPPER_ID)
        if clipper is None:
            session.add(
                User(
                    id=DEFAULT_CLIPPER_ID,
                    name="Clipper Demo",
                    role=UserRole.CLIPPER,
                    is_verified=True,
                )
            )
            session.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    active_db = initialize_database()
    seed_default_clipper()
    logger.info("Catalyst backend started with database: %s", active_db)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Proof of concept Catalyst untuk donasi dan antrean clipper.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(donations.router, prefix="/api/donations", tags=["donations"])
app.include_router(clips.router, prefix="/api/clips", tags=["clips"])


@app.get("/")
def root() -> dict[str, str]:
    """Endpoint dasar untuk memastikan server menyala."""
    return {"message": "Catalyst Backend API is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    """Health check sederhana untuk POC."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
