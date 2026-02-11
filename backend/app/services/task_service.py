"""Task service for task CRUD operations."""

from datetime import datetime
from typing import Optional, List
from sqlmodel import Session, select, func
from sqlalchemy import or_
from fastapi import HTTPException

from app.models.task import Task, TaskStatus
from app.models.task_tag import TaskTag
from app.models.tag import Tag
from app.models.priority import Priority
from app.services.user_service import ensure_user_exists


def create_task(
    session: Session,
    user_id: str,
    title: str,
    description: Optional[str] = None,
    priority_id: Optional[str] = None,
    due_date: Optional[datetime] = None,
    recurrence_rule: Optional[str] = None,
    tag_ids: Optional[List[str]] = None,
) -> Task:
    """
    Create a new task for a user.

    Args:
        session: Database session
        user_id: Owner's user ID
        title: Task title
        description: Optional task description
        priority_id: Optional priority ID
        due_date: Optional due date
        recurrence_rule: Optional recurrence rule
        tag_ids: Optional list of tag IDs to associate

    Returns:
        Created task
    """
    # Ensure user exists
    ensure_user_exists(session, user_id)

    # Validate priority if provided
    if priority_id:
        priority = session.get(Priority, priority_id)
        if not priority or priority.user_id != user_id:
            raise HTTPException(status_code=400, detail="Invalid priority_id")

    # Create task
    task = Task(
        user_id=user_id,
        title=title,
        description=description,
        priority_id=priority_id,
        due_date=due_date,
        recurrence_rule=recurrence_rule,
    )
    session.add(task)
    session.commit()
    session.refresh(task)

    # Associate tags if provided
    if tag_ids:
        for tag_id in tag_ids:
            tag = session.get(Tag, tag_id)
            if tag and tag.user_id == user_id:
                task_tag = TaskTag(task_id=task.id, tag_id=tag_id)
                session.add(task_tag)
        session.commit()
        session.refresh(task)

    return task


def get_tasks(
    session: Session,
    user_id: str,
    status: Optional[str] = None,
    priority_id: Optional[str] = None,
    tag_id: Optional[str] = None,
    due_before: Optional[datetime] = None,
    due_after: Optional[datetime] = None,
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 20,
) -> tuple[List[Task], int]:
    """
    Get paginated list of tasks for a user with filtering and sorting.

    Returns:
        Tuple of (tasks, total_count)
    """
    # Base query
    query = select(Task).where(Task.user_id == user_id)

    # Apply filters
    if status:
        query = query.where(Task.status == status)

    if priority_id:
        query = query.where(Task.priority_id == priority_id)

    if tag_id:
        query = query.join(TaskTag).where(TaskTag.tag_id == tag_id)

    if due_before:
        query = query.where(Task.due_date <= due_before)

    if due_after:
        query = query.where(Task.due_date >= due_after)

    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Task.title.ilike(search_term),
                Task.description.ilike(search_term)
            )
        )

    # Get total count (before pagination)
    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    # Apply sorting
    sort_column = getattr(Task, sort_by, Task.created_at)
    if sort_by == "priority":
        # Special handling for priority sorting
        query = query.outerjoin(Priority, Task.priority_id == Priority.id)
        if sort_order == "asc":
            query = query.order_by(Priority.level.asc().nullslast())
        else:
            query = query.order_by(Priority.level.desc().nullslast())
    else:
        if sort_order == "asc":
            query = query.order_by(sort_column.asc().nullslast())
        else:
            query = query.order_by(sort_column.desc().nullslast())

    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    tasks = session.exec(query).all()
    return tasks, total


def get_task(session: Session, user_id: str, task_id: str) -> Task:
    """
    Get a single task by ID with ownership check.

    Raises:
        HTTPException: 404 if task not found or not owned by user
    """
    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


def update_task(
    session: Session,
    user_id: str,
    task_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None,
    priority_id: Optional[str] = None,
    due_date: Optional[datetime] = None,
    recurrence_rule: Optional[str] = None,
    tag_ids: Optional[List[str]] = None,
) -> Task:
    """
    Update an existing task.

    Raises:
        HTTPException: 404 if task not found or not owned by user
    """
    task = get_task(session, user_id, task_id)

    # Update fields if provided
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if priority_id is not None:
        # Validate priority
        if priority_id:
            priority = session.get(Priority, priority_id)
            if not priority or priority.user_id != user_id:
                raise HTTPException(status_code=400, detail="Invalid priority_id")
        task.priority_id = priority_id
    if due_date is not None:
        task.due_date = due_date
    if recurrence_rule is not None:
        task.recurrence_rule = recurrence_rule

    # Update timestamp
    task.updated_at = datetime.utcnow()

    # Update tags if provided
    if tag_ids is not None:
        # Remove existing tags
        session.exec(
            select(TaskTag).where(TaskTag.task_id == task_id)
        )
        for task_tag in session.exec(select(TaskTag).where(TaskTag.task_id == task_id)).all():
            session.delete(task_tag)

        # Add new tags
        for tag_id in tag_ids:
            tag = session.get(Tag, tag_id)
            if tag and tag.user_id == user_id:
                task_tag = TaskTag(task_id=task.id, tag_id=tag_id)
                session.add(task_tag)

    session.commit()
    session.refresh(task)
    return task


def delete_task(session: Session, user_id: str, task_id: str) -> None:
    """
    Delete a task.

    Raises:
        HTTPException: 404 if task not found or not owned by user
    """
    task = get_task(session, user_id, task_id)
    session.delete(task)
    session.commit()


def toggle_complete(session: Session, user_id: str, task_id: str) -> Task:
    """
    Toggle task completion status.

    Raises:
        HTTPException: 404 if task not found or not owned by user
    """
    task = get_task(session, user_id, task_id)

    # Toggle status
    if task.status == TaskStatus.PENDING:
        task.status = TaskStatus.COMPLETED
    else:
        task.status = TaskStatus.PENDING

    task.updated_at = datetime.utcnow()

    session.commit()
    session.refresh(task)
    return task
