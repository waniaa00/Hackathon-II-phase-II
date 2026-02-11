"""Tag API endpoint tests."""

import pytest
from fastapi.testclient import TestClient


def test_create_tag(authenticated_client, auth_headers):
    """Test creating a new tag."""
    response = authenticated_client.post(
        "/api/tags",
        json={"name": "work"},
        headers=auth_headers,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "work"
    assert "id" in data


def test_create_duplicate_tag(authenticated_client, auth_headers):
    """Test creating a duplicate tag returns 409."""
    # Create first tag
    authenticated_client.post(
        "/api/tags",
        json={"name": "work"},
        headers=auth_headers,
    )

    # Try to create duplicate
    response = authenticated_client.post(
        "/api/tags",
        json={"name": "work"},
        headers=auth_headers,
    )

    assert response.status_code == 409


def test_list_tags_empty(authenticated_client, auth_headers):
    """Test listing tags when none exist."""
    response = authenticated_client.get(
        "/api/tags",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json() == []


def test_list_tags(authenticated_client, auth_headers):
    """Test listing tags."""
    # Create tags
    authenticated_client.post(
        "/api/tags",
        json={"name": "work"},
        headers=auth_headers,
    )
    authenticated_client.post(
        "/api/tags",
        json={"name": "personal"},
        headers=auth_headers,
    )

    response = authenticated_client.get(
        "/api/tags",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_update_tag(authenticated_client, auth_headers):
    """Test updating a tag."""
    # Create tag
    create_response = authenticated_client.post(
        "/api/tags",
        json={"name": "work"},
        headers=auth_headers,
    )
    tag_id = create_response.json()["id"]

    # Update tag
    response = authenticated_client.put(
        f"/api/tags/{tag_id}",
        json={"name": "business"},
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["name"] == "business"


def test_delete_tag(authenticated_client, auth_headers):
    """Test deleting a tag."""
    # Create tag
    create_response = authenticated_client.post(
        "/api/tags",
        json={"name": "work"},
        headers=auth_headers,
    )
    tag_id = create_response.json()["id"]

    # Delete tag
    response = authenticated_client.delete(
        f"/api/tags/{tag_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    # Verify deleted
    list_response = authenticated_client.get(
        "/api/tags",
        headers=auth_headers,
    )
    assert len(list_response.json()) == 0
