"""Priority API endpoint tests."""

import pytest
from fastapi.testclient import TestClient


def test_list_priorities_creates_defaults(authenticated_client, auth_headers):
    """Test that listing priorities creates defaults if none exist."""
    response = authenticated_client.get(
        "/api/priorities",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()

    # Should have 3 default priorities
    assert len(data) == 3

    levels = [p["level"] for p in data]
    assert "high" in levels
    assert "medium" in levels
    assert "low" in levels


def test_list_priorities_idempotent(authenticated_client, auth_headers):
    """Test that listing priorities multiple times returns same data."""
    # First request creates defaults
    response1 = authenticated_client.get(
        "/api/priorities",
        headers=auth_headers,
    )

    # Second request should return same data
    response2 = authenticated_client.get(
        "/api/priorities",
        headers=auth_headers,
    )

    assert response1.status_code == 200
    assert response2.status_code == 200

    # Same number of priorities
    assert len(response1.json()) == len(response2.json())

    # Same IDs
    ids1 = {p["id"] for p in response1.json()}
    ids2 = {p["id"] for p in response2.json()}
    assert ids1 == ids2
