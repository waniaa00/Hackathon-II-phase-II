"""Priority model for task priority levels."""

from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional
from uuid import uuid4
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import UniqueConstraint, Column, String, ForeignKey

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.task import Task


class PriorityLevel(str, Enum):
    """Priority level options."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Priority(SQLModel, table=True):
    """Priority levels for tasks."""
    __tablename__ = "priority"
    __table_args__ = (
        UniqueConstraint("user_id", "level", name="uq_priority_user_level"),
    )

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
    level: PriorityLevel = Field(max_length=20)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="priorities")
    tasks: List["Task"] = Relationship(back_populates="priority")
