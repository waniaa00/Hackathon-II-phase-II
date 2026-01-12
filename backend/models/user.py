"""
User Model - Better-Auth Compatible

This model represents user accounts managed by Better-Auth.
Better-Auth handles password hashing and authentication logic.
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional


class User(SQLModel, table=True):
    """
    User entity managed by Better-Auth.

    Better-Auth automatically handles:
    - Password hashing and verification
    - Session creation and management
    - Authentication flows

    This model matches Better-Auth's expected schema.
    """

    __tablename__ = "user"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255, nullable=False)
    email_verified: bool = Field(default=False, nullable=False)
    name: Optional[str] = Field(default=None, max_length=255)
    image: Optional[str] = Field(default=None)  # Profile image URL
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "user@example.com",
                "name": "John Doe",
                "email_verified": False,
                "created_at": "2026-01-12T10:30:00Z",
                "updated_at": "2026-01-12T10:30:00Z",
            }
        }
