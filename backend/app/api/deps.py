"""API dependencies for authentication and session management."""

from typing import Annotated
from fastapi import Depends, HTTPException, Header

from app.database import SessionDep
from app.services.user_service import ensure_user_exists
from app.core.security import JWTVerificationError, verify_token


async def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
    session: SessionDep = None,
) -> dict:
    """
    Extract and verify user from Authorization header.
    Creates user record in database if it doesn't exist.

    Returns:
        Dictionary with user id and email from JWT claims
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing authorization header"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format. Use 'Bearer <token>'"
        )

    token = authorization[7:]  # Remove "Bearer " prefix

    try:
        payload = verify_token(token)
        user_data = {
            "id": payload.get("sub"),
            "email": payload.get("email"),
        }

        # Ensure user exists in database on first API call
        if session and user_data["id"]:
            ensure_user_exists(session, user_data["id"])

        return user_data
    except JWTVerificationError as e:
        raise HTTPException(status_code=401, detail=str(e))


# Type alias for current user dependency
CurrentUser = Annotated[dict, Depends(get_current_user)]


async def get_verified_user_id(current_user: CurrentUser) -> str:
    """
    Extract the user ID from the authenticated JWT token.

    Returns:
        The user_id string from the JWT claims
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="User ID not found in token"
        )
    return user_id


# Type alias for verified user id (extracted from JWT, no path param needed)
VerifiedUserId = Annotated[str, Depends(get_verified_user_id)]
