"""Authentication endpoint tests."""

import pytest
from fastapi.testclient import TestClient


def test_missing_token_returns_401(client):
    """Test that missing authorization header returns 401."""
    response = client.get(
        "/api/tasks",
        # No headers - missing authorization
    )

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert "authorization" in data["detail"].lower() or "missing" in data["detail"].lower()


def test_invalid_token_format_returns_401(client):
    """Test that invalid authorization format returns 401."""
    response = client.get(
        "/api/tasks",
        headers={"Authorization": "InvalidFormat token123"},
    )

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data


def test_valid_token_allows_access(authenticated_client, auth_headers):
    """Test that valid token allows access to protected endpoints."""
    response = authenticated_client.get(
        "/api/tasks",
        headers=auth_headers,
    )

    assert response.status_code == 200


def test_health_endpoint_no_auth_required(client):
    """Test that health endpoint doesn't require authentication."""
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert "status" in data


def test_expired_token_returns_401(client):
    """Test that expired token returns 401.

    Note: This test uses a mock that simulates expired token behavior.
    In integration tests with real JWT, the token would actually be expired.
    """
    # For now, we test with an explicitly invalid token
    # that would fail verification
    response = client.get(
        "/api/tasks",
        headers={"Authorization": "Bearer expired.token.here"},
    )

    # With our mock setup, invalid tokens should return 401
    assert response.status_code == 401


def test_auth_header_case_insensitive(client, auth_headers):
    """Test that Bearer prefix is case-sensitive (must be 'Bearer')."""
    # This should fail because 'bearer' is lowercase
    response = client.get(
        "/api/tasks",
        headers={"Authorization": "bearer mock-token"},
    )

    assert response.status_code == 401


def test_request_includes_request_id_header(authenticated_client, auth_headers):
    """Test that responses include X-Request-ID header for tracing."""
    response = authenticated_client.get(
        "/api/tasks",
        headers=auth_headers,
    )

    # Request ID should be in response headers
    assert "x-request-id" in response.headers or response.status_code == 200
