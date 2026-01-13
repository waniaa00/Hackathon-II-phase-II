"""
User Model - Better-Auth Compatible

This model represents user accounts managed by Better-Auth.
Better-Auth handles password hashing and authentication logic.
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    """
    User entity managed by Better-Auth.

    Better-Auth automatically handles:
    - Password hashing and verification
    - Session creation and management
    - Authentication flows

    This model matches Better-Auth's expected schema.
    Note: Better-Auth uses TEXT for IDs, not UUID.
    """

    __tablename__ = "user"

    id: str = Field(primary_key=True)  # Better-Auth uses TEXT IDs
    email: str = Field(unique=True, index=True, max_length=255, nullable=False)
    email_verified: bool = Field(default=False, nullable=False, alias="emailVerified")
    name: Optional[str] = Field(default=None, max_length=255)
    image: Optional[str] = Field(default=None)  # Profile image URL
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, alias="updatedAt")

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
