"""Task API endpoint tests."""

import pytest
from fastapi.testclient import TestClient


def test_create_task(authenticated_client, auth_headers):
    """Test creating a new task."""
    response = authenticated_client.post(
        "/api/tasks",
        json={"title": "Test Task"},
        headers=auth_headers,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["status"] == "pending"
    assert data["user_id"] == "test-user-123"
    assert "id" in data


def test_list_tasks_empty(authenticated_client, auth_headers):
    """Test listing tasks when none exist."""
    response = authenticated_client.get(
        "/api/tasks",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["tasks"] == []
    assert data["total"] == 0
    assert data["page"] == 1
    assert data["page_size"] == 20


def test_list_tasks_with_data(authenticated_client, auth_headers):
    """Test listing tasks after creating some."""
    # Create tasks
    authenticated_client.post(
        "/api/tasks",
        json={"title": "Task 1"},
        headers=auth_headers,
    )
    authenticated_client.post(
        "/api/tasks",
        json={"title": "Task 2"},
        headers=auth_headers,
    )

    response = authenticated_client.get(
        "/api/tasks",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data["tasks"]) == 2
    assert data["total"] == 2


def test_get_task(authenticated_client, auth_headers):
    """Test getting a specific task."""
    # Create task
    create_response = authenticated_client.post(
        "/api/tasks",
        json={"title": "Test Task"},
        headers=auth_headers,
    )
    task_id = create_response.json()["id"]

    # Get task
    response = authenticated_client.get(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Test Task"


def test_get_task_not_found(authenticated_client, auth_headers):
    """Test getting a non-existent task."""
    response = authenticated_client.get(
        "/api/tasks/non-existent-id",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_task(authenticated_client, auth_headers):
    """Test updating a task."""
    # Create task
    create_response = authenticated_client.post(
        "/api/tasks",
        json={"title": "Original Title"},
        headers=auth_headers,
    )
    task_id = create_response.json()["id"]

    # Update task
    response = authenticated_client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Updated Title"},
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"


def test_delete_task(authenticated_client, auth_headers):
    """Test deleting a task."""
    # Create task
    create_response = authenticated_client.post(
        "/api/tasks",
        json={"title": "To Delete"},
        headers=auth_headers,
    )
    task_id = create_response.json()["id"]

    # Delete task
    response = authenticated_client.delete(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    # Verify deleted
    get_response = authenticated_client.get(
        f"/api/tasks/{task_id}",
        headers=auth_headers,
    )
    assert get_response.status_code == 404


def test_toggle_complete(authenticated_client, auth_headers):
    """Test toggling task completion."""
    # Create task
    create_response = authenticated_client.post(
        "/api/tasks",
        json={"title": "Test Task"},
        headers=auth_headers,
    )
    task_id = create_response.json()["id"]
    assert create_response.json()["status"] == "pending"

    # Toggle to completed
    response = authenticated_client.patch(
        f"/api/tasks/{task_id}/complete",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["status"] == "completed"

    # Toggle back to pending
    response = authenticated_client.patch(
        f"/api/tasks/{task_id}/complete",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["status"] == "pending"
