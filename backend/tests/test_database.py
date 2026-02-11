"""Database connection tests."""

import pytest
from sqlalchemy import text
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool


def test_database_tables_created():
    """Test that all database tables are created correctly."""
    # Create in-memory database
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    # Import models to register them
    from app.models import User, Task, Tag, Priority, TaskTag

    # Create tables
    SQLModel.metadata.create_all(engine)

    # Verify tables exist by attempting to query them
    with Session(engine) as session:
        # These should not raise errors
        session.execute(text("SELECT * FROM user LIMIT 1"))
        session.execute(text("SELECT * FROM task LIMIT 1"))
        session.execute(text("SELECT * FROM tag LIMIT 1"))
        session.execute(text("SELECT * FROM priority LIMIT 1"))
        session.execute(text("SELECT * FROM task_tag LIMIT 1"))


def test_user_creation():
    """Test user model creation."""
    from app.models import User

    user = User(id="test-user-123")
    assert user.id == "test-user-123"
    assert user.created_at is not None


def test_task_creation():
    """Test task model creation with defaults."""
    from app.models import Task, TaskStatus

    task = Task(
        user_id="test-user-123",
        title="Test Task"
    )

    assert task.title == "Test Task"
    assert task.status == TaskStatus.PENDING
    assert task.description is None
    assert task.priority_id is None
    assert task.due_date is None
