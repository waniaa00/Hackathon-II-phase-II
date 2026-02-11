"""Tag Pydantic schemas for API request/response."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TagCreate(BaseModel):
    """Schema for creating a new tag."""
    name: str = Field(..., min_length=1, max_length=50)


class TagUpdate(BaseModel):
    """Schema for updating an existing tag."""
    name: Optional[str] = Field(None, min_length=1, max_length=50)


class TagResponse(BaseModel):
    """Tag response schema."""
    id: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True
