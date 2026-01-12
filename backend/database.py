"""
Database Configuration and Connection Management

This module handles SQLModel engine initialization, connection pooling,
and database session lifecycle for the Todo application with Better-Auth integration.
"""

from sqlmodel import SQLModel, Session, create_engine
from contextlib import contextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Database engine configuration
# pool_size: Number of connections to keep open
# max_overflow: Additional connections to create when pool is exhausted
# pool_pre_ping: Verify connections before using (important for serverless/Neon)
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Log SQL queries (disable in production)
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before using
    connect_args={
        # PostgreSQL-specific connection arguments
        "connect_timeout": 10,
    }
)


def init_db():
    """
    Initialize database by creating all tables.

    This function creates tables for:
    - User (Better-Auth managed)
    - Session (Better-Auth managed)
    - Todo (application managed)
    - Account (Better-Auth OAuth, if enabled)
    - Verification (Better-Auth email verification)

    Call this function on application startup or via migration script.
    """
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")


@contextmanager
def get_db():
    """
    Context manager for database session lifecycle.

    Usage:
        async with get_db() as session:
            user = session.query(User).filter(User.id == user_id).first()

    The session is automatically committed on successful completion
    and rolled back on exceptions.
    """
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_session():
    """
    Dependency function for FastAPI to inject database sessions.

    Usage:
        @app.get("/users")
        def get_users(session: Session = Depends(get_session)):
            users = session.query(User).all()
            return users
    """
    with Session(engine) as session:
        yield session
