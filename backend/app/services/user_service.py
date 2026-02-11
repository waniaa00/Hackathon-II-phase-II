"""User service for user persistence operations."""

from sqlmodel import Session, select

from app.models.user import User


def ensure_user_exists(session: Session, user_id: str) -> User:
    """
    Ensure a user record exists in the database.

    Creates the user if they don't exist (first API call).

    Args:
        session: Database session
        user_id: User ID from JWT token

    Returns:
        User model instance
    """
    user = session.get(User, user_id)

    if not user:
        user = User(id=user_id)
        session.add(user)
        session.commit()
        session.refresh(user)

    return user


def get_user(session: Session, user_id: str) -> User | None:
    """
    Get user by ID.

    Args:
        session: Database session
        user_id: User ID

    Returns:
        User if found, None otherwise
    """
    return session.get(User, user_id)
