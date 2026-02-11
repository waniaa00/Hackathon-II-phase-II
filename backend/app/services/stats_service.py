"""Stats service for analytics queries."""

from datetime import datetime, timedelta
from sqlmodel import Session, select, func, cast, Date
from sqlalchemy import case

from app.models.task import Task, TaskStatus
from app.models.task_tag import TaskTag
from app.models.tag import Tag
from app.models.priority import Priority
from app.schemas.stats import (
    StatsResponse,
    PriorityCount,
    TagCount,
    DailyActivity,
)

PRIORITY_LEVEL_MAP = {"high": 1, "medium": 2, "low": 3}
TAG_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"]


def get_user_stats(session: Session, user_id: str) -> StatsResponse:
    """Get aggregated task statistics for a user."""
    now = datetime.utcnow()

    # --- Basic counts ---
    total = session.exec(
        select(func.count(Task.id)).where(Task.user_id == user_id)
    ).one()

    pending = session.exec(
        select(func.count(Task.id)).where(
            Task.user_id == user_id, Task.status == TaskStatus.PENDING
        )
    ).one()

    completed = session.exec(
        select(func.count(Task.id)).where(
            Task.user_id == user_id, Task.status == TaskStatus.COMPLETED
        )
    ).one()

    overdue = session.exec(
        select(func.count(Task.id)).where(
            Task.user_id == user_id,
            Task.status == TaskStatus.PENDING,
            Task.due_date < now,
            Task.due_date.isnot(None),  # type: ignore[union-attr]
        )
    ).one()

    completion_rate = round((completed / total * 100), 1) if total > 0 else 0.0

    # --- Tasks by priority ---
    priority_rows = session.exec(
        select(Priority.level, func.count(Task.id))
        .join(Task, Task.priority_id == Priority.id)
        .where(Task.user_id == user_id)
        .group_by(Priority.level)
    ).all()

    tasks_by_priority = [
        PriorityCount(
            name=row[0].value.capitalize(),
            level=PRIORITY_LEVEL_MAP.get(row[0].value, 9),
            count=row[1],
        )
        for row in priority_rows
    ]
    tasks_by_priority.sort(key=lambda p: p.level)

    # --- Tasks by tag ---
    tag_rows = session.exec(
        select(Tag.name, func.count(TaskTag.task_id))
        .join(TaskTag, TaskTag.tag_id == Tag.id)
        .join(Task, Task.id == TaskTag.task_id)
        .where(Task.user_id == user_id)
        .group_by(Tag.name)
        .order_by(func.count(TaskTag.task_id).desc())
    ).all()

    tasks_by_tag = [
        TagCount(
            name=row[0],
            color=TAG_COLORS[i % len(TAG_COLORS)],
            count=row[1],
        )
        for i, row in enumerate(tag_rows)
    ]

    # --- Recent activity (last 7 days) ---
    seven_days_ago = now - timedelta(days=6)
    start_of_range = seven_days_ago.replace(hour=0, minute=0, second=0, microsecond=0)

    activity_rows = session.exec(
        select(
            cast(Task.created_at, Date).label("day"),
            func.count(Task.id).label("created"),
            func.sum(
                case(
                    (Task.status == TaskStatus.COMPLETED, 1),
                    else_=0,
                )
            ).label("completed_count"),
        )
        .where(Task.user_id == user_id, Task.created_at >= start_of_range)
        .group_by(cast(Task.created_at, Date))
        .order_by(cast(Task.created_at, Date))
    ).all()

    # Build a map for the last 7 days and fill gaps
    activity_map: dict[str, dict[str, int]] = {}
    for i in range(7):
        day = (start_of_range + timedelta(days=i)).strftime("%Y-%m-%d")
        activity_map[day] = {"created": 0, "completed": 0}

    for row in activity_rows:
        day_str = str(row[0])
        if day_str in activity_map:
            activity_map[day_str]["created"] = row[1]
            activity_map[day_str]["completed"] = int(row[2] or 0)

    recent_activity = [
        DailyActivity(date=day, created=data["created"], completed=data["completed"])
        for day, data in activity_map.items()
    ]

    return StatsResponse(
        total_tasks=total,
        pending_tasks=pending,
        completed_tasks=completed,
        overdue_tasks=overdue,
        completion_rate=completion_rate,
        tasks_by_priority=tasks_by_priority,
        tasks_by_tag=tasks_by_tag,
        recent_activity=recent_activity,
    )
