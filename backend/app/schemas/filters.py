"""Filter and sort schemas for task queries."""

from datetime import date
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class SortField(str, Enum):
    """Available fields for sorting tasks."""

    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"
    DUE_DATE = "due_date"
    TITLE = "title"
    PRIORITY = "priority"


class SortOrder(str, Enum):
    """Sort order options."""

    ASC = "asc"
    DESC = "desc"


class TaskFilterParams(BaseModel):
    """Filter parameters for task list queries."""

    status: Optional[str] = Field(
        default=None,
        description="Filter by status (pending, completed)",
    )
    priority_id: Optional[str] = Field(
        default=None,
        description="Filter by priority ID",
    )
    tag_id: Optional[str] = Field(
        default=None,
        description="Filter by tag ID (tasks with this tag)",
    )
    due_before: Optional[date] = Field(
        default=None,
        description="Filter tasks due before this date",
    )
    due_after: Optional[date] = Field(
        default=None,
        description="Filter tasks due after this date",
    )
    search: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Search in title and description",
    )


class TaskSortParams(BaseModel):
    """Sort parameters for task list queries."""

    sort_by: SortField = Field(
        default=SortField.CREATED_AT,
        description="Field to sort by",
    )
    sort_order: SortOrder = Field(
        default=SortOrder.DESC,
        description="Sort order (asc or desc)",
    )
