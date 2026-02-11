"""User Pydantic schemas for API request/response."""

from datetime import datetime
from pydantic import BaseModel, Field


class UserResponse(BaseModel):
    """User response schema."""
    id: str = Field(..., description="User ID from JWT")
    created_at: datetime = Field(..., description="When user was first seen")

    class Config:
        from_attributes = True
