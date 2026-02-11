"""Stats response schemas for analytics endpoint."""

from pydantic import BaseModel


class PriorityCount(BaseModel):
    """Task count by priority level."""
    name: str
    level: int
    count: int


class TagCount(BaseModel):
    """Task count by tag."""
    name: str
    color: str
    count: int


class DailyActivity(BaseModel):
    """Daily task creation/completion activity."""
    date: str
    created: int
    completed: int


class StatsResponse(BaseModel):
    """Aggregated task statistics for a user."""
    total_tasks: int
    pending_tasks: int
    completed_tasks: int
    overdue_tasks: int
    completion_rate: float
    tasks_by_priority: list[PriorityCount]
    tasks_by_tag: list[TagCount]
    recent_activity: list[DailyActivity]
