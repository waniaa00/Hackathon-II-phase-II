# Data Model: Todo App Backend & API

**Feature**: 008-backend-api
**Date**: 2026-02-05
**Status**: Complete
**Dependency**: 007-db-integration (see `specs/007-db-integration/data-model.md` for database entities)

## Overview

This document defines API-specific data entities used for request/response handling, authentication context, and pagination. Database entities (User, Task, Tag, Priority, TaskTag) are defined in 007-db-integration.

---

## API Request/Response Flow

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                     │
│                                                                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐       │
│  │  Request Schema │───▶│  Service Layer  │───▶│ Response Schema │       │
│  │   (Pydantic)    │    │  (Business)     │    │   (Pydantic)    │       │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘       │
│           │                      │                      │                 │
│           │                      ▼                      │                 │
│           │             ┌─────────────────┐             │                 │
│           │             │  Database Model │             │                 │
│           │             │   (SQLModel)    │             │                 │
│           │             └─────────────────┘             │                 │
│           │                                             │                 │
│           └──────────── Validation ─────────────────────┘                 │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Entities

### 1. Authentication Context

Extracted from JWT token, used throughout request lifecycle.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | str | JWT `sub` claim | User's unique identifier |
| email | str | JWT `email` claim | User's email address |

```python
from pydantic import BaseModel, Field

class AuthContext(BaseModel):
    """User information extracted from JWT token."""
    id: str = Field(..., description="User ID from JWT 'sub' claim")
    email: str = Field(..., description="User email from JWT")

    class Config:
        frozen = True  # Immutable after creation
```

---

### 2. Pagination Parameters

Query parameters for list endpoints.

| Field | Type | Default | Constraints | Description |
|-------|------|---------|-------------|-------------|
| page | int | 1 | >= 1 | Current page number |
| page_size | int | 20 | 1-100 | Items per page |

```python
from pydantic import BaseModel, Field

class PaginationParams(BaseModel):
    """Pagination query parameters."""
    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    page_size: int = Field(
        default=20,
        ge=1,
        le=100,
        description="Items per page (max 100)"
    )

    @property
    def offset(self) -> int:
        """Calculate SQL offset."""
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """Alias for page_size."""
        return self.page_size
```

---

### 3. Pagination Metadata

Response wrapper for paginated lists.

| Field | Type | Description |
|-------|------|-------------|
| total | int | Total items matching filters |
| page | int | Current page number |
| page_size | int | Items per page |
| total_pages | int | Calculated total pages |

```python
from pydantic import BaseModel, computed_field
from typing import Generic, TypeVar, List

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response wrapper."""
    items: List[T]
    total: int
    page: int
    page_size: int

    @computed_field
    @property
    def total_pages(self) -> int:
        """Calculate total number of pages."""
        if self.total == 0:
            return 0
        return (self.total + self.page_size - 1) // self.page_size
```

---

### 4. Task Filter Parameters

Query parameters for filtering task lists.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| status | str? | None | Filter by 'pending' or 'completed' |
| priority_id | str? | None | Filter by priority UUID |
| tag_id | str? | None | Filter by tag UUID |
| due_before | datetime? | None | Tasks due before this date |
| due_after | datetime? | None | Tasks due after this date |
| search | str? | None | Search in title/description |

```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TaskFilterParams(BaseModel):
    """Filter parameters for task listing."""
    status: Optional[str] = Field(
        default=None,
        pattern="^(pending|completed)$",
        description="Filter by task status"
    )
    priority_id: Optional[str] = Field(
        default=None,
        description="Filter by priority UUID"
    )
    tag_id: Optional[str] = Field(
        default=None,
        description="Filter by tag UUID"
    )
    due_before: Optional[datetime] = Field(
        default=None,
        description="Filter tasks due before this datetime"
    )
    due_after: Optional[datetime] = Field(
        default=None,
        description="Filter tasks due after this datetime"
    )
    search: Optional[str] = Field(
        default=None,
        max_length=100,
        description="Search term for title/description"
    )
```

---

### 5. Task Sort Parameters

Query parameters for sorting task lists.

| Field | Type | Default | Allowed Values | Description |
|-------|------|---------|----------------|-------------|
| sort_by | str | created_at | created_at, due_date, title, priority | Column to sort by |
| sort_order | str | desc | asc, desc | Sort direction |

```python
from pydantic import BaseModel, Field
from enum import Enum

class SortField(str, Enum):
    CREATED_AT = "created_at"
    DUE_DATE = "due_date"
    TITLE = "title"
    PRIORITY = "priority"

class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"

class TaskSortParams(BaseModel):
    """Sort parameters for task listing."""
    sort_by: SortField = Field(
        default=SortField.CREATED_AT,
        description="Field to sort by"
    )
    sort_order: SortOrder = Field(
        default=SortOrder.DESC,
        description="Sort direction"
    )
```

---

### 6. Error Response

Standard error response format.

| Field | Type | Description |
|-------|------|-------------|
| detail | str | Human-readable error message |
| code | str | Machine-readable error code |

```python
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    """Standard API error response."""
    detail: str
    code: str

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Task not found",
                "code": "NOT_FOUND"
            }
        }
```

---

### 7. Validation Error Response

Detailed validation error for 400 responses.

| Field | Type | Description |
|-------|------|-------------|
| detail | str | Error summary |
| code | str | Always "VALIDATION_ERROR" |
| errors | list | Field-level error details |

```python
from pydantic import BaseModel
from typing import List, Any

class ValidationErrorDetail(BaseModel):
    """Single validation error."""
    loc: List[str]  # Field location path
    msg: str        # Error message
    type: str       # Error type

class ValidationErrorResponse(BaseModel):
    """Validation error response with field details."""
    detail: str = "Validation error"
    code: str = "VALIDATION_ERROR"
    errors: List[ValidationErrorDetail]
```

---

### 8. Task List Response

Response for GET /api/{user_id}/tasks.

| Field | Type | Description |
|-------|------|-------------|
| tasks | TaskResponse[] | Array of task objects |
| total | int | Total matching tasks |
| page | int | Current page |
| page_size | int | Items per page |

```python
from pydantic import BaseModel
from typing import List
from app.schemas.task import TaskResponse

class TaskListResponse(BaseModel):
    """Paginated task list response."""
    tasks: List[TaskResponse]
    total: int
    page: int
    page_size: int
```

---

## Request Schema Summary

| Endpoint | Request Schema | Response Schema |
|----------|---------------|-----------------|
| POST /api/{user_id}/tasks | TaskCreate | TaskResponse |
| PUT /api/{user_id}/tasks/{id} | TaskUpdate | TaskResponse |
| GET /api/{user_id}/tasks | FilterParams + SortParams + PaginationParams | TaskListResponse |
| GET /api/{user_id}/tasks/{id} | - | TaskResponse |
| DELETE /api/{user_id}/tasks/{id} | - | 204 No Content |
| PATCH /api/{user_id}/tasks/{id}/complete | - | TaskResponse |
| POST /api/{user_id}/tags | TagCreate | TagResponse |
| PUT /api/{user_id}/tags/{id} | TagUpdate | TagResponse |
| GET /api/{user_id}/tags | - | List[TagResponse] |
| DELETE /api/{user_id}/tags/{id} | - | 204 No Content |
| GET /api/{user_id}/priorities | - | List[PriorityResponse] |

---

## Schema Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                     REQUEST SCHEMAS                              │
├─────────────────────────────────────────────────────────────────┤
│  TaskCreate ─────────────▶ TaskService.create() ─▶ Task (DB)    │
│  TaskUpdate ─────────────▶ TaskService.update() ─▶ Task (DB)    │
│  TaskFilterParams ───────▶ TaskService.list()                   │
│  TaskSortParams ─────────▶ TaskService.list()                   │
│  PaginationParams ───────▶ TaskService.list()                   │
│  TagCreate ──────────────▶ TagService.create() ──▶ Tag (DB)     │
│  TagUpdate ──────────────▶ TagService.update() ──▶ Tag (DB)     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     RESPONSE SCHEMAS                             │
├─────────────────────────────────────────────────────────────────┤
│  Task (DB) ──────────────▶ TaskResponse                         │
│  Tag (DB) ───────────────▶ TagResponse                          │
│  Priority (DB) ──────────▶ PriorityResponse                     │
│  List[Task] + count ─────▶ TaskListResponse                     │
│  Exception ──────────────▶ ErrorResponse / ValidationErrorResp  │
└─────────────────────────────────────────────────────────────────┘
```
