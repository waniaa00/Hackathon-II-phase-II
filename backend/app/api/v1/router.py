"""API v1 router aggregator."""

from fastapi import APIRouter

from app.api.v1.tasks import router as tasks_router
from app.api.v1.tags import router as tags_router
from app.api.v1.priorities import router as priorities_router
from app.api.v1.stats import router as stats_router

# Create main v1 router
router = APIRouter()

# Include all routes
router.include_router(tasks_router)
router.include_router(tags_router)
router.include_router(priorities_router)
router.include_router(stats_router)
