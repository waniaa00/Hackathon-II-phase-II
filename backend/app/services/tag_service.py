"""Tag service for tag CRUD operations."""

from typing import List, Optional
from sqlmodel import Session, select
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.models.tag import Tag
from app.services.user_service import ensure_user_exists


def create_tag(session: Session, user_id: str, name: str) -> Tag:
    """
    Create a new tag for a user.

    Args:
        session: Database session
        user_id: Owner's user ID
        name: Tag name

    Returns:
        Created tag

    Raises:
        HTTPException: 409 if tag name already exists for user
    """
    # Ensure user exists
    ensure_user_exists(session, user_id)

    # Create tag
    tag = Tag(user_id=user_id, name=name)
    session.add(tag)

    try:
        session.commit()
        session.refresh(tag)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=409,
            detail="A tag with this name already exists"
        )

    return tag


def get_tags(session: Session, user_id: str) -> List[Tag]:
    """
    Get all tags for a user.

    Args:
        session: Database session
        user_id: User ID

    Returns:
        List of tags
    """
    tags = session.exec(
        select(Tag).where(Tag.user_id == user_id).order_by(Tag.name)
    ).all()
    return list(tags)


def get_tag(session: Session, user_id: str, tag_id: str) -> Tag:
    """
    Get a single tag by ID with ownership check.

    Raises:
        HTTPException: 404 if tag not found or not owned by user
    """
    tag = session.get(Tag, tag_id)

    if not tag or tag.user_id != user_id:
        raise HTTPException(status_code=404, detail="Tag not found")

    return tag


def update_tag(
    session: Session,
    user_id: str,
    tag_id: str,
    name: Optional[str] = None,
) -> Tag:
    """
    Update an existing tag.

    Raises:
        HTTPException: 404 if tag not found
        HTTPException: 409 if new name conflicts with existing tag
    """
    tag = get_tag(session, user_id, tag_id)

    if name is not None:
        tag.name = name

    try:
        session.commit()
        session.refresh(tag)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=409,
            detail="A tag with this name already exists"
        )

    return tag


def delete_tag(session: Session, user_id: str, tag_id: str) -> None:
    """
    Delete a tag.

    Raises:
        HTTPException: 404 if tag not found or not owned by user
    """
    tag = get_tag(session, user_id, tag_id)
    session.delete(tag)
    session.commit()
