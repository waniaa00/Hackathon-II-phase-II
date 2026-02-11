"""API package - FastAPI routers, dependencies, and middleware."""

from app.api.deps import (
    get_current_user,
    get_verified_user_id,
    CurrentUser,
    VerifiedUserId,
)
from app.api.middleware import (
    configure_cors,
    RequestLoggingMiddleware,
)
from app.api.exceptions import (
    APIError,
    NotFoundError,
    ConflictError,
    ForbiddenError,
    register_exception_handlers,
)

__all__ = [
    # Dependencies
    "get_current_user",
    "get_verified_user_id",
    "CurrentUser",
    "VerifiedUserId",
    # Middleware
    "configure_cors",
    "RequestLoggingMiddleware",
    # Exceptions
    "APIError",
    "NotFoundError",
    "ConflictError",
    "ForbiddenError",
    "register_exception_handlers",
]
