"""Task Pydantic schemas for API request/response."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.models.task import TaskStatus


class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    priority_id: Optional[str] = None
    due_date: Optional[datetime] = None
    recurrence_rule: Optional[str] = Field(
        None,
        pattern="^(daily|weekly|monthly|yearly)$"
    )
    tag_ids: Optional[List[str]] = None


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    priority_id: Optional[str] = None
    due_date: Optional[datetime] = None
    recurrence_rule: Optional[str] = Field(
        None,
        pattern="^(daily|weekly|monthly|yearly)$"
    )
    tag_ids: Optional[List[str]] = None


class PriorityInTask(BaseModel):
    """Embedded priority in task response."""
    id: str
    level: str

    class Config:
        from_attributes = True


class TagInTask(BaseModel):
    """Embedded tag in task response."""
    id: str
    name: str

    class Config:
        from_attributes = True


class TaskResponse(BaseModel):
    """Task response schema."""
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: Optional[PriorityInTask] = None
    tags: List[TagInTask] = []
    due_date: Optional[datetime] = None
    recurrence_rule: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """Paginated task list response."""
    tasks: List[TaskResponse]
    total: int
    page: int
    page_size: int
