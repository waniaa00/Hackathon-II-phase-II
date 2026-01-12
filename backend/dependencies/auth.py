"""
Authentication Dependency for FastAPI

This module provides authentication dependencies for protecting API routes.
It validates Better-Auth session tokens from HTTP-only cookies.
"""

from fastapi import Depends, HTTPException, status, Request
from sqlmodel import Session, select
from datetime import datetime
from uuid import UUID
from typing import Dict

from backend.database import get_session
from backend.models.session import SessionModel
from backend.utils.errors import NOT_AUTHENTICATED_ERROR, create_error_response


async def get_current_user(
    request: Request,
    db: Session = Depends(get_session)
) -> Dict[str, UUID]:
    """
    Validate Better-Auth session and return current user context.

    This dependency:
    1. Extracts session token from HTTP-only cookie
    2. Validates session token against database
    3. Checks session expiration
    4. Returns user_id for authorization checks

    Args:
        request: FastAPI Request object containing cookies
        db: Database session from dependency injection

    Returns:
        Dict containing user_id: {"user_id": UUID}

    Raises:
        HTTPException: 401 if not authenticated or session expired

    Usage:
        @router.get("/todos")
        async def get_todos(current_user: dict = Depends(get_current_user)):
            user_id = current_user["user_id"]
            # ... query todos filtered by user_id
    """
    # Extract session token from cookie
    # Better-Auth uses "better-auth.session_token" by default
    session_token = request.cookies.get("better-auth.session_token")

    if not session_token:
        # Try alternative cookie names for compatibility
        for cookie_name in [
            "better-auth.session-token",
            "__Secure-better-auth.session_token",
            "authjs.session-token",
        ]:
            session_token = request.cookies.get(cookie_name)
            if session_token:
                break

    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=NOT_AUTHENTICATED_ERROR.detail,
        )

    # Validate session token format (basic sanity check)
    # Session tokens should be reasonable length and not contain dangerous characters
    if len(session_token) < 10 or len(session_token) > 2000 or '\x00' in session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=NOT_AUTHENTICATED_ERROR.detail,  # Generic message to prevent enumeration
        )

    # Query session from database
    statement = select(SessionModel).where(SessionModel.token == session_token)
    session = db.exec(statement).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=create_error_response(
                "Invalid or expired session",
                status_code=401,
                error_code="INVALID_SESSION"
            ).detail,
        )

    # Check session expiration
    if session.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=create_error_response("Session expired", status_code=401, error_code="SESSION_EXPIRED").detail,
        )

    # Return user context
    return {"user_id": session.user_id}
