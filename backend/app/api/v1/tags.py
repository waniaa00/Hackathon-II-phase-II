"""Tag API endpoints."""

from typing import List
from fastapi import APIRouter

from app.database import SessionDep
from app.api.deps import VerifiedUserId
from app.schemas.tag import TagCreate, TagUpdate, TagResponse
from app.services import tag_service

router = APIRouter(prefix="/api/tags", tags=["Tags"])


@router.get("", response_model=List[TagResponse])
async def list_tags(
    user_id: VerifiedUserId,
    session: SessionDep,
):
    """List all tags for the authenticated user."""
    tags = tag_service.get_tags(session, user_id)
    return [TagResponse.model_validate(t) for t in tags]


@router.post("", response_model=TagResponse, status_code=201)
async def create_tag(
    user_id: VerifiedUserId,
    session: SessionDep,
    tag_data: TagCreate,
):
    """
    Create a new tag.

    Returns 409 Conflict if tag name already exists.
    """
    tag = tag_service.create_tag(session, user_id, tag_data.name)
    return TagResponse.model_validate(tag)


@router.put("/{tag_id}", response_model=TagResponse)
async def update_tag(
    user_id: VerifiedUserId,
    session: SessionDep,
    tag_id: str,
    tag_data: TagUpdate,
):
    """Update an existing tag."""
    tag = tag_service.update_tag(session, user_id, tag_id, tag_data.name)
    return TagResponse.model_validate(tag)


@router.delete("/{tag_id}", status_code=204)
async def delete_tag(
    user_id: VerifiedUserId,
    session: SessionDep,
    tag_id: str,
):
    """Delete a tag."""
    tag_service.delete_tag(session, user_id, tag_id)
    return None
