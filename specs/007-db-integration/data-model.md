# Data Model: Todo App Database & Integration

**Feature**: 007-db-integration
**Date**: 2026-02-04
**Status**: Complete

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           BETTER AUTH (Frontend)                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │    user      │    │   session    │    │   account    │               │
│  │  (managed)   │───▶│  (managed)   │    │  (managed)   │               │
│  └──────┬───────┘    └──────────────┘    └──────────────┘               │
│         │ JWT contains user.id                                           │
└─────────┼───────────────────────────────────────────────────────────────┘
          │
          │ user_id (from JWT 'sub' claim)
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND DATABASE (Neon PostgreSQL)               │
│                                                                          │
│  ┌──────────────┐                                                        │
│  │    user      │◀─────────────────────────────────────────┐            │
│  │  (minimal)   │                                          │            │
│  └──────┬───────┘                                          │            │
│         │                                                  │            │
│         │ 1:N                                              │            │
│         ▼                                                  │            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │            │
│  │    task      │───▶│   priority   │◀───│     tag      │ │            │
│  │              │ N:1│              │    │              │─┘            │
│  └──────┬───────┘    └──────────────┘    └──────┬───────┘              │
│         │                                        │                      │
│         │ M:N                                    │                      │
│         ▼                                        │                      │
│  ┌──────────────┐                                │                      │
│  │   task_tag   │◀───────────────────────────────┘                      │
│  │  (junction)  │                                                        │
│  └──────────────┘                                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Entities

### 1. User (Backend Reference)

Minimal user record for establishing foreign key relationships. Full user data is managed by Better Auth.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID matching Better Auth user.id |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When user first created a task |

**Notes**:
- Created on first task/tag/priority creation
- ID comes from JWT `sub` claim
- No email/password stored (Better Auth handles this)

```python
class User(SQLModel, table=True):
    __tablename__ = "user"

    id: str = Field(primary_key=True, max_length=36)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"server_default": func.now()}
    )

    # Relationships
    tasks: list["Task"] = Relationship(back_populates="user", cascade_delete=True)
    tags: list["Tag"] = Relationship(back_populates="user", cascade_delete=True)
    priorities: list["Priority"] = Relationship(back_populates="user", cascade_delete=True)
```

---

### 2. Task

Core entity representing a to-do item.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID |
| user_id | VARCHAR(36) | FK → user.id, NOT NULL, ON DELETE CASCADE | Owner |
| title | VARCHAR(255) | NOT NULL, INDEX | Task title |
| description | TEXT | NULL | Detailed description |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | 'pending' or 'completed' |
| priority_id | VARCHAR(36) | FK → priority.id, NULL | Priority level |
| due_date | TIMESTAMP | NULL, INDEX | Optional due date |
| recurrence_rule | VARCHAR(100) | NULL | e.g., 'daily', 'weekly' |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW(), ON UPDATE NOW() | Last modified |

**Indexes**:
- `idx_task_user_id` on (user_id)
- `idx_task_title` on (title)
- `idx_task_due_date` on (due_date)
- `idx_task_status` on (status)

```python
class TaskStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"

class Task(SQLModel, table=True):
    __tablename__ = "task"

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        max_length=36
    )
    user_id: str = Field(
        foreign_key="user.id",
        nullable=False,
        index=True,
        sa_column_kwargs={"ondelete": "CASCADE"}
    )
    title: str = Field(max_length=255, nullable=False, index=True)
    description: str | None = Field(default=None, sa_type=Text)
    status: TaskStatus = Field(default=TaskStatus.PENDING, max_length=20)
    priority_id: str | None = Field(
        default=None,
        foreign_key="priority.id",
        max_length=36
    )
    due_date: datetime | None = Field(default=None, index=True)
    recurrence_rule: str | None = Field(default=None, max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="tasks")
    priority: "Priority" = Relationship(back_populates="tasks")
    tags: list["Tag"] = Relationship(
        back_populates="tasks",
        link_model=TaskTag
    )
```

---

### 3. Tag

User-defined labels for organizing tasks.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID |
| user_id | VARCHAR(36) | FK → user.id, NOT NULL, ON DELETE CASCADE | Owner |
| name | VARCHAR(50) | NOT NULL | Tag name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

**Constraints**:
- UNIQUE(user_id, name) - Tag names unique per user

**Indexes**:
- `idx_tag_user_id` on (user_id)
- `idx_tag_name` on (name)

```python
class Tag(SQLModel, table=True):
    __tablename__ = "tag"
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_tag_user_name"),
    )

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        max_length=36
    )
    user_id: str = Field(
        foreign_key="user.id",
        nullable=False,
        index=True,
        sa_column_kwargs={"ondelete": "CASCADE"}
    )
    name: str = Field(max_length=50, nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="tags")
    tasks: list["Task"] = Relationship(
        back_populates="tags",
        link_model=TaskTag
    )
```

---

### 4. Priority

Priority levels for tasks.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID |
| user_id | VARCHAR(36) | FK → user.id, NOT NULL, ON DELETE CASCADE | Owner |
| level | VARCHAR(20) | NOT NULL | 'high', 'medium', 'low' |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |

**Constraints**:
- UNIQUE(user_id, level) - One priority per level per user

```python
class PriorityLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class Priority(SQLModel, table=True):
    __tablename__ = "priority"
    __table_args__ = (
        UniqueConstraint("user_id", "level", name="uq_priority_user_level"),
    )

    id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True,
        max_length=36
    )
    user_id: str = Field(
        foreign_key="user.id",
        nullable=False,
        index=True,
        sa_column_kwargs={"ondelete": "CASCADE"}
    )
    level: PriorityLevel = Field(max_length=20, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="priorities")
    tasks: list["Task"] = Relationship(back_populates="priority")
```

---

### 5. TaskTag (Junction Table)

Many-to-many relationship between tasks and tags.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| task_id | VARCHAR(36) | PK, FK → task.id, ON DELETE CASCADE | Task reference |
| tag_id | VARCHAR(36) | PK, FK → tag.id, ON DELETE CASCADE | Tag reference |

```python
class TaskTag(SQLModel, table=True):
    __tablename__ = "task_tag"

    task_id: str = Field(
        foreign_key="task.id",
        primary_key=True,
        sa_column_kwargs={"ondelete": "CASCADE"}
    )
    tag_id: str = Field(
        foreign_key="tag.id",
        primary_key=True,
        sa_column_kwargs={"ondelete": "CASCADE"}
    )
```

---

## Validation Rules

### Task
| Field | Rule |
|-------|------|
| title | 1-255 characters, non-empty |
| description | 0-5000 characters |
| status | Must be 'pending' or 'completed' |
| due_date | Must be valid datetime or null |
| recurrence_rule | One of: null, 'daily', 'weekly', 'monthly', 'yearly' |

### Tag
| Field | Rule |
|-------|------|
| name | 1-50 characters, non-empty, unique per user |

### Priority
| Field | Rule |
|-------|------|
| level | Must be 'high', 'medium', or 'low' |

---

## State Transitions

### Task Status
```
[pending] ──── complete ────▶ [completed]
    ▲                              │
    └────── uncomplete ────────────┘
```

---

## Sample Queries

### Get all tasks for a user
```sql
SELECT t.*, p.level as priority_level
FROM task t
LEFT JOIN priority p ON t.priority_id = p.id
WHERE t.user_id = :user_id
ORDER BY t.created_at DESC;
```

### Get tasks with tags
```sql
SELECT t.*, array_agg(tg.name) as tag_names
FROM task t
LEFT JOIN task_tag tt ON t.id = tt.task_id
LEFT JOIN tag tg ON tt.tag_id = tg.id
WHERE t.user_id = :user_id
GROUP BY t.id;
```

### Filter by status and priority
```sql
SELECT t.*
FROM task t
WHERE t.user_id = :user_id
  AND t.status = :status
  AND t.priority_id = :priority_id
ORDER BY t.due_date ASC NULLS LAST;
```

### Search tasks by title
```sql
SELECT t.*
FROM task t
WHERE t.user_id = :user_id
  AND t.title ILIKE '%' || :search || '%'
ORDER BY t.created_at DESC;
```
