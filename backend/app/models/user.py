"""User model - minimal reference for task ownership."""

from datetime import datetime
from typing import TYPE_CHECKING, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import func

if TYPE_CHECKING:
    from app.models.task import Task
    from app.models.tag import Tag
    from app.models.priority import Priority


class User(SQLModel, table=True):
    """
    Minimal user record for establishing foreign key relationships.
    Full user data is managed by Better Auth on the frontend.
    """
    __tablename__ = "user"

    id: str = Field(primary_key=True, max_length=36)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": func.now()}
    )

    # Relationships
    tasks: List["Task"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    tags: List["Tag"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    priorities: List["Priority"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
