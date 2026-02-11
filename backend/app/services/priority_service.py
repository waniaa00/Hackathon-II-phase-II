"""Priority service for priority level operations."""

from typing import List
from sqlmodel import Session, select

from app.models.priority import Priority, PriorityLevel
from app.services.user_service import ensure_user_exists


def ensure_default_priorities(session: Session, user_id: str) -> List[Priority]:
    """
    Ensure default priority levels exist for a user.

    Creates high, medium, low priorities if they don't exist.

    Args:
        session: Database session
        user_id: User ID

    Returns:
        List of priority levels for the user
    """
    # Ensure user exists
    ensure_user_exists(session, user_id)

    # Check if priorities already exist
    existing = session.exec(
        select(Priority).where(Priority.user_id == user_id)
    ).all()

    if not existing:
        # Create default priorities
        for level in [PriorityLevel.HIGH, PriorityLevel.MEDIUM, PriorityLevel.LOW]:
            priority = Priority(user_id=user_id, level=level)
            session.add(priority)

        session.commit()

        # Fetch all priorities
        existing = session.exec(
            select(Priority).where(Priority.user_id == user_id)
        ).all()

    return list(existing)


def get_priorities(session: Session, user_id: str) -> List[Priority]:
    """
    Get all priority levels for a user.

    Creates defaults if none exist.

    Args:
        session: Database session
        user_id: User ID

    Returns:
        List of priority levels
    """
    return ensure_default_priorities(session, user_id)
