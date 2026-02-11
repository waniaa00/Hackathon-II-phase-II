"""Test fixtures for API testing."""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.database import get_session
from app.api.deps import get_current_user


# Test database URL (in-memory SQLite for testing)
TEST_DATABASE_URL = "sqlite://"


@pytest.fixture(name="engine")
def engine_fixture():
    """Create test database engine."""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="session")
def session_fixture(engine):
    """Create test database session."""
    with Session(engine) as session:
        yield session


@pytest.fixture(name="test_user")
def test_user_fixture():
    """Mock user data from JWT."""
    return {
        "id": "test-user-123",
        "email": "test@example.com",
    }


@pytest.fixture(name="client")
def client_fixture(session):
    """Create test client WITHOUT auth bypass (for testing auth failures)."""

    def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override
    # NOTE: get_current_user is NOT overridden - auth will be tested properly

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()


@pytest.fixture(name="authenticated_client")
def authenticated_client_fixture(session, test_user):
    """Create test client WITH auth bypass (for testing authenticated endpoints)."""

    def get_session_override():
        yield session

    def get_current_user_override():
        return test_user

    app.dependency_overrides[get_session] = get_session_override
    app.dependency_overrides[get_current_user] = get_current_user_override

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()


@pytest.fixture(name="auth_headers")
def auth_headers_fixture():
    """Mock authorization headers with valid token format."""
    # This will still fail verification but has correct format
    return {"Authorization": "Bearer mock-test-token"}
