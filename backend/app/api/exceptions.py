"""Custom exception handlers for consistent API error responses."""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.core.logging import get_logger
from app.core.security import JWTVerificationError

logger = get_logger(__name__)


class APIError(Exception):
    """Base exception for API errors."""

    def __init__(
        self,
        message: str,
        status_code: int = 400,
        error_type: str = "api_error",
    ):
        self.message = message
        self.status_code = status_code
        self.error_type = error_type
        super().__init__(self.message)


class NotFoundError(APIError):
    """Resource not found error."""

    def __init__(self, resource: str, resource_id: str):
        super().__init__(
            message=f"{resource} with id '{resource_id}' not found",
            status_code=404,
            error_type="not_found",
        )


class ConflictError(APIError):
    """Resource conflict error (duplicate, etc.)."""

    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=409,
            error_type="conflict",
        )


class ForbiddenError(APIError):
    """Access forbidden error."""

    def __init__(self, message: str = "You do not have access to this resource"):
        super().__init__(
            message=message,
            status_code=403,
            error_type="forbidden",
        )


def register_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers with the FastAPI application."""

    @app.exception_handler(APIError)
    async def api_error_handler(request: Request, exc: APIError) -> JSONResponse:
        """Handle custom API errors."""
        logger.warning(
            "api_error",
            error_type=exc.error_type,
            message=exc.message,
            status_code=exc.status_code,
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": exc.message,
                "type": exc.error_type,
            },
        )

    @app.exception_handler(JWTVerificationError)
    async def jwt_error_handler(
        request: Request, exc: JWTVerificationError
    ) -> JSONResponse:
        """Handle JWT verification errors."""
        logger.warning(
            "auth_error",
            error_code=exc.error_code,
            message=exc.message,
        )
        return JSONResponse(
            status_code=401,
            content={
                "detail": exc.message,
                "type": exc.error_code,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Handle request validation errors with detailed field information."""
        errors = []
        for error in exc.errors():
            field = ".".join(str(loc) for loc in error["loc"])
            errors.append({
                "field": field,
                "message": error["msg"],
                "type": error["type"],
            })

        logger.warning(
            "validation_error",
            errors=errors,
        )

        return JSONResponse(
            status_code=400,
            content={
                "detail": "Validation error",
                "type": "validation_error",
                "errors": errors,
            },
        )

    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(
        request: Request, exc: IntegrityError
    ) -> JSONResponse:
        """Handle database integrity errors (unique constraint, etc.)."""
        logger.warning(
            "database_integrity_error",
            error=str(exc.orig) if exc.orig else str(exc),
        )
        return JSONResponse(
            status_code=409,
            content={
                "detail": "Resource already exists or conflicts with existing data",
                "type": "conflict",
            },
        )

    @app.exception_handler(SQLAlchemyError)
    async def database_error_handler(
        request: Request, exc: SQLAlchemyError
    ) -> JSONResponse:
        """Handle general database errors."""
        logger.exception("database_error", error=str(exc))
        return JSONResponse(
            status_code=500,
            content={
                "detail": "A database error occurred",
                "type": "database_error",
            },
        )

    @app.exception_handler(Exception)
    async def general_error_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        """Handle all unhandled exceptions."""
        logger.exception("unhandled_error", error=str(exc))
        return JSONResponse(
            status_code=500,
            content={
                "detail": "An internal server error occurred",
                "type": "internal_error",
            },
        )
