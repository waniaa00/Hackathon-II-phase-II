"""Stats API endpoint for analytics dashboard."""

from fastapi import APIRouter

from app.database import SessionDep
from app.api.deps import VerifiedUserId
from app.schemas.stats import StatsResponse
from app.services.stats_service import get_user_stats

router = APIRouter(prefix="/api/stats", tags=["Stats"])


@router.get("", response_model=StatsResponse)
async def get_stats(
    user_id: VerifiedUserId,
    session: SessionDep,
):
    """Get aggregated task statistics for the authenticated user."""
    return get_user_stats(session, user_id)
