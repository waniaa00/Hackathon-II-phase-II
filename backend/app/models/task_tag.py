"""TaskTag junction table for many-to-many relationship."""

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String, ForeignKey


from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.task import Task
    from app.models.tag import Tag

class TaskTag(SQLModel, table=True):
    """Many-to-many relationship between tasks and tags."""
    __tablename__ = "task_tag"

    task_id: str = Field(
        sa_column=Column(
            String(36),
            ForeignKey("task.id", ondelete="CASCADE"),
            primary_key=True
        )
    )
    tag_id: str = Field(
        sa_column=Column(
            String(36),
            ForeignKey("tag.id", ondelete="CASCADE"),
            primary_key=True
        )
    )

    # Relationships
    task: "Task" = Relationship(back_populates="task_tags")
    tag: "Tag" = Relationship(back_populates="task_tags")
