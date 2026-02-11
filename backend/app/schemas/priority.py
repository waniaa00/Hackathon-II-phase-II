"""Priority Pydantic schemas for API request/response."""

from datetime import datetime
from pydantic import BaseModel, Field

from app.models.priority import PriorityLevel


class PriorityResponse(BaseModel):
    """Priority response schema."""
    id: str
    level: PriorityLevel
    created_at: datetime

    class Config:
        from_attributes = True
