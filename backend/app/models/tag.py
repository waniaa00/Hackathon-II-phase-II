"""Tag model for task organization."""

from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from uuid import uuid4
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import UniqueConstraint, Column, String, ForeignKey

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.task import Task
    from app.models.task_tag import TaskTag


class Tag(SQLModel, table=True):
    """User-defined labels for organizing tasks."""
    __tablename__ = "tag"
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_tag_user_name"),
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
    name: str = Field(max_length=50, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="tags")
    task_tags: List["TaskTag"] = Relationship(
        back_populates="tag",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
