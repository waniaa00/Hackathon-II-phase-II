"""
Todo Model - User-Scoped Task Management

This model represents user-owned todo items with full authorization.
Each todo belongs to exactly one user and is protected by authorization checks.
"""

from sqlmodel import SQLModel, Field, Column
from sqlalchemy import ARRAY, String
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional, List
from enum import Enum


class TodoStatus(str, Enum):
    """Todo status values"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TodoPriority(str, Enum):
    """Todo priority levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RecurrenceFrequency(str, Enum):
    """Recurrence frequency for recurring tasks"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class Todo(SQLModel, table=True):
    """
    Todo entity for user task management.

    Each todo belongs to exactly one user (enforced via foreign key).
    Authorization is enforced at the API level:
    - All queries MUST filter by user_id
    - Ownership verified before update/delete
    - Cross-user access returns 403 Forbidden
    """

    __tablename__ = "todo"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(
        foreign_key="user.id",
        index=True,
        nullable=False,
        description="Owner user ID - enforces data isolation"
    )
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None)
    status: TodoStatus = Field(default=TodoStatus.PENDING, nullable=False, index=True)
    priority: TodoPriority = Field(default=TodoPriority.MEDIUM, nullable=False)
    due_date: Optional[datetime] = Field(default=None, index=True)
    tags: Optional[List[str]] = Field(
        default=None,
        sa_column=Column(ARRAY(String))
    )
    is_recurring: bool = Field(default=False)
    frequency: Optional[RecurrenceFrequency] = Field(default=None)
    interval: Optional[int] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "750e8400-e29b-41d4-a716-446655440000",
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "title": "Complete project documentation",
                "description": "Write comprehensive docs for authentication feature",
                "status": "in_progress",
                "priority": "high",
                "due_date": "2026-01-15T17:00:00Z",
                "tags": ["work", "documentation"],
                "is_recurring": False,
                "frequency": None,
                "interval": None,
                "created_at": "2026-01-12T10:30:00Z",
                "updated_at": "2026-01-12T11:45:00Z",
            }
        }
