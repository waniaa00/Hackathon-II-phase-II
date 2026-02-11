"""Database connection and session management."""

from typing import Annotated, Generator
from sqlmodel import Session, create_engine, SQLModel
from sqlalchemy import text
from fastapi import Depends

from app.config import get_settings

# Create engine with connection pool settings for Neon
settings = get_settings()
engine = create_engine(
    settings.neon_db_url,
    echo=settings.is_development,
    pool_pre_ping=True,  # Verify connections before use
    pool_size=5,
    max_overflow=10,
)


def init_db() -> None:
    """Initialize database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Get database session with automatic cleanup."""
    with Session(engine) as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()


# Type alias for dependency injection
SessionDep = Annotated[Session, Depends(get_session)]


def check_connection() -> bool:
    """Check if database connection is healthy."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
