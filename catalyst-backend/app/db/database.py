"""Setup engine SQLModel dan dependency session."""

from collections.abc import Iterator
import logging

from sqlalchemy.exc import OperationalError
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

logger = logging.getLogger(__name__)


def _build_engine(database_url: str):
    """Membangun engine sesuai jenis database yang dipakai."""
    return create_engine(
        database_url,
        echo=settings.DEBUG,
        pool_pre_ping=True,
        connect_args={"check_same_thread": False}
        if database_url.startswith("sqlite")
        else {},
    )


engine = _build_engine(settings.DATABASE_URL)
active_database_url = settings.DATABASE_URL


def initialize_database() -> str:
    """Menginisialisasi database utama dan fallback bila perlu."""
    global engine, active_database_url

    candidate_urls = [settings.DATABASE_URL]
    if settings.ENABLE_DATABASE_FALLBACK and settings.DATABASE_FALLBACK_URL:
        candidate_urls.append(settings.DATABASE_FALLBACK_URL)

    tried_urls: set[str] = set()
    last_error: OperationalError | None = None

    for database_url in candidate_urls:
        if database_url in tried_urls:
            continue

        tried_urls.add(database_url)
        engine = _build_engine(database_url)

        try:
            with engine.connect() as connection:
                connection.exec_driver_sql("SELECT 1")

            SQLModel.metadata.create_all(engine)
            active_database_url = database_url

            if database_url == settings.DATABASE_URL:
                logger.info("Connected to primary database: %s", database_url)
            else:
                logger.warning(
                    "Primary database unavailable. Using fallback database: %s",
                    database_url,
                )

            return active_database_url
        except OperationalError as error:
            last_error = error
            logger.warning("Database connection failed for %s", database_url)

    if last_error is not None:
        raise last_error

    raise RuntimeError("Database initialization failed without a reported error.")


def get_engine():
    """Mengembalikan engine aktif saat ini."""
    return engine


def get_active_database_url() -> str:
    """Mengembalikan database URL yang sedang aktif."""
    return active_database_url


def get_session() -> Iterator[Session]:
    """Dependency generator untuk SQLModel session."""
    with Session(engine) as session:
        yield session
