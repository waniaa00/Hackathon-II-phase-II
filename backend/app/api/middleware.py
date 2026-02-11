"""API middleware for CORS, logging, and request processing."""

import time
import uuid
from typing import Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import get_logger, bind_context, clear_context

logger = get_logger(__name__)


def configure_cors(app: FastAPI, origins: list[str]) -> None:
    """
    Configure CORS middleware for the application.

    Args:
        app: FastAPI application instance
        origins: List of allowed origins
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID"],
    )


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware for logging all incoming requests with correlation IDs.

    Adds:
    - X-Request-ID header for request tracing
    - Request timing metrics
    - Structured logging with context
    """

    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        # Generate or extract request ID
        request_id = request.headers.get(
            "X-Request-ID", str(uuid.uuid4())[:8]
        )

        # Bind request context for all logs in this request
        bind_context(
            request_id=request_id,
            method=request.method,
            path=request.url.path,
        )

        start_time = time.time()

        # Log incoming request
        logger.info(
            "request_started",
            client_host=request.client.host if request.client else "unknown",
        )

        try:
            response = await call_next(request)
            process_time = time.time() - start_time

            # Log completed request
            logger.info(
                "request_completed",
                status_code=response.status_code,
                duration_ms=round(process_time * 1000, 2),
            )

            # Add request ID header for client tracing
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.3f}"

            return response

        except Exception as e:
            process_time = time.time() - start_time
            logger.exception(
                "request_failed",
                error=str(e),
                duration_ms=round(process_time * 1000, 2),
            )
            raise

        finally:
            # Clear context after request
            clear_context()
