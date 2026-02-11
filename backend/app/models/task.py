"""Task model - core entity for to-do items."""

from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional
from uuid import uuid4
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String, Text, ForeignKey

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.priority import Priority
    from app.models.tag import Tag

from app.models.task_tag import TaskTag


class TaskStatus(str, Enum):
    """Task status options."""
    PENDING = "pending"
    COMPLETED = "completed"


class Task(SQLModel, table=True):
    """Core entity representing a to-do item."""
    __tablename__ = "task"

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        max_length=36
    )
    user_id: str = Field(
        sa_column=Column(
            String(36),
            ForeignKey("user.id", ondelete="CASCADE"),
            nullable=False,
            index=True
        )
    )
    title: str = Field(max_length=255, index=True)
    description: Optional[str] = Field(
        default=None,
        sa_column=Column(Text, nullable=True)
    )
    status: TaskStatus = Field(default=TaskStatus.PENDING, max_length=20)
    priority_id: Optional[str] = Field(
        default=None,
        sa_column=Column(
            String(36),
            ForeignKey("priority.id", ondelete="SET NULL"),
            nullable=True
        )
    )
    due_date: Optional[datetime] = Field(default=None, index=True)
    recurrence_rule: Optional[str] = Field(default=None, max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="tasks")
    priority: Optional["Priority"] = Relationship(back_populates="tasks")
    task_tags: List["TaskTag"] = Relationship(
        back_populates="task",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

    # Computed property to access tags through junction table
    @property
    def tags(self) -> List["Tag"]:
        return [tt.tag for tt in self.task_tags if tt.tag]
