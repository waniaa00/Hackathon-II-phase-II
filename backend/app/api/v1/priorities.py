"""Priority API endpoints."""

from typing import List
from fastapi import APIRouter

from app.database import SessionDep
from app.api.deps import VerifiedUserId
from app.schemas.priority import PriorityResponse
from app.services import priority_service

router = APIRouter(prefix="/api/priorities", tags=["Priorities"])


@router.get("", response_model=List[PriorityResponse])
async def list_priorities(
    user_id: VerifiedUserId,
    session: SessionDep,
):
    """
    List all priority levels for the authenticated user.

    Creates default priorities (high, medium, low) if none exist.
    """
    priorities = priority_service.get_priorities(session, user_id)
    return [PriorityResponse.model_validate(p) for p in priorities]
