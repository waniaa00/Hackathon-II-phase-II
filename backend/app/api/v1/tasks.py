"""Task API endpoints."""

from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Query

from app.database import SessionDep
from app.api.deps import VerifiedUserId
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from app.services import task_service

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    user_id: VerifiedUserId,
    session: SessionDep,
    status: Optional[str] = Query(None, pattern="^(pending|completed)$"),
    priority_id: Optional[str] = None,
    tag_id: Optional[str] = None,
    due_before: Optional[datetime] = None,
    due_after: Optional[datetime] = None,
    search: Optional[str] = Query(None, max_length=100),
    sort_by: str = Query("created_at", pattern="^(created_at|due_date|title|priority)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    """
    List all tasks for the authenticated user.

    Supports filtering, sorting, and pagination.
    """
    tasks, total = task_service.get_tasks(
        session=session,
        user_id=user_id,
        status=status,
        priority_id=priority_id,
        tag_id=tag_id,
        due_before=due_before,
        due_after=due_after,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )

    return TaskListResponse(
        tasks=[TaskResponse.model_validate(t) for t in tasks],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    user_id: VerifiedUserId,
    session: SessionDep,
    task_data: TaskCreate,
):
    """Create a new task."""
    task = task_service.create_task(
        session=session,
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        priority_id=task_data.priority_id,
        due_date=task_data.due_date,
        recurrence_rule=task_data.recurrence_rule,
        tag_ids=task_data.tag_ids,
    )
    return TaskResponse.model_validate(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    user_id: VerifiedUserId,
    session: SessionDep,
    task_id: str,
):
    """Get a specific task by ID."""
    task = task_service.get_task(session, user_id, task_id)
    return TaskResponse.model_validate(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    user_id: VerifiedUserId,
    session: SessionDep,
    task_id: str,
    task_data: TaskUpdate,
):
    """Update an existing task."""
    task = task_service.update_task(
        session=session,
        user_id=user_id,
        task_id=task_id,
        title=task_data.title,
        description=task_data.description,
        priority_id=task_data.priority_id,
        due_date=task_data.due_date,
        recurrence_rule=task_data.recurrence_rule,
        tag_ids=task_data.tag_ids,
    )
    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    user_id: VerifiedUserId,
    session: SessionDep,
    task_id: str,
):
    """Delete a task."""
    task_service.delete_task(session, user_id, task_id)
    return None


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_complete(
    user_id: VerifiedUserId,
    session: SessionDep,
    task_id: str,
):
    """Toggle task completion status."""
    task = task_service.toggle_complete(session, user_id, task_id)
    return TaskResponse.model_validate(task)
