"""Schemas package - Pydantic request/response models."""

from app.schemas.user import UserResponse
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskListResponse,
    PriorityInTask,
    TagInTask,
)
from app.schemas.tag import TagCreate, TagUpdate, TagResponse
from app.schemas.priority import PriorityResponse
from app.schemas.error import ErrorResponse, ValidationErrorResponse, ValidationErrorDetail
from app.schemas.pagination import PaginationParams, PaginationMeta
from app.schemas.filters import TaskFilterParams, TaskSortParams, SortField, SortOrder

__all__ = [
    # User
    "UserResponse",
    # Task
    "TaskCreate",
    "TaskUpdate",
    "TaskResponse",
    "TaskListResponse",
    "PriorityInTask",
    "TagInTask",
    # Tag
    "TagCreate",
    "TagUpdate",
    "TagResponse",
    # Priority
    "PriorityResponse",
    # Error
    "ErrorResponse",
    "ValidationErrorResponse",
    "ValidationErrorDetail",
    # Pagination
    "PaginationParams",
    "PaginationMeta",
    # Filters
    "TaskFilterParams",
    "TaskSortParams",
    "SortField",
    "SortOrder",
]
