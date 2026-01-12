"""
Backend Error Utilities - Better-Auth Integration

Defines error response models and utilities for consistent error handling.
"""

from typing import Optional
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """
    Standard error response model for API endpoints

    Matches the error response contract defined in contracts/auth-contract.ts
    """
    detail: str
    status_code: Optional[int] = None
    error_code: Optional[str] = None


def create_error_response(detail: str, status_code: Optional[int] = None, error_code: Optional[str] = None) -> ErrorResponse:
    """
    Helper function to create standardized error responses

    Args:
        detail: Human-readable error message
        status_code: HTTP status code (optional)
        error_code: Application-specific error code (optional)

    Returns:
        ErrorResponse: Standardized error response object
    """
    return ErrorResponse(
        detail=detail,
        status_code=status_code,
        error_code=error_code
    )


# Common error response instances
INVALID_CREDENTIALS_ERROR = ErrorResponse(
    detail="Invalid email or password",
    error_code="INVALID_CREDENTIALS"
)

EMAIL_ALREADY_EXISTS_ERROR = ErrorResponse(
    detail="Email already registered",
    error_code="EMAIL_EXISTS"
)

NOT_AUTHENTICATED_ERROR = ErrorResponse(
    detail="Authentication required",
    status_code=401,
    error_code="NOT_AUTHENTICATED"
)

FORBIDDEN_ERROR = ErrorResponse(
    detail="Access forbidden",
    status_code=403,
    error_code="FORBIDDEN"
)

NOT_FOUND_ERROR = ErrorResponse(
    detail="Resource not found",
    status_code=404,
    error_code="NOT_FOUND"
)

SERVICE_UNAVAILABLE_ERROR = ErrorResponse(
    detail="Service temporarily unavailable",
    status_code=503,
    error_code="SERVICE_UNAVAILABLE",
)
