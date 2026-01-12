"""
Session Model - Better-Auth Session Management

This model represents authentication sessions managed by Better-Auth.
Sessions are stored in HTTP-only cookies and validated on each request.
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional


class SessionModel(SQLModel, table=True):
    """
    Session entity managed by Better-Auth.

    Better-Auth creates and manages sessions with:
    - Secure token generation
    - HTTP-only cookie storage
    - Automatic expiration (7 days)
    - Session renewal on activity

    This model matches Better-Auth's expected schema.
    """

    __tablename__ = "session"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", index=True, nullable=False)
    token: str = Field(unique=True, index=True, max_length=255, nullable=False)
    expires_at: datetime = Field(index=True, nullable=False)
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "650e8400-e29b-41d4-a716-446655440000",
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "token": "secure-random-token-value",
                "expires_at": "2026-01-19T10:30:00Z",
                "ip_address": "192.168.1.1",
                "user_agent": "Mozilla/5.0...",
                "created_at": "2026-01-12T10:30:00Z",
                "updated_at": "2026-01-12T10:30:00Z",
            }
        }
