"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.config import get_settings
from app.database import init_db, check_connection
from app.api.v1.router import router as v1_router
from app.api.middleware import configure_cors, RequestLoggingMiddleware
from app.api.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger

# Configure structured logging
settings = get_settings()
configure_logging(
    level="DEBUG" if settings.is_development else "INFO",
    json_format=not settings.is_development,
)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown."""
    logger.info(
        "application_starting",
        environment=settings.environment,
    )

    # Verify database connection on startup
    if not check_connection():
        logger.error("database_connection_failed")
        raise RuntimeError("Failed to connect to database. Check NEON_DB_URL.")

    logger.info("database_connected")

    # Initialize tables (in development) or verify connection
    if settings.is_development:
        init_db()
        logger.info("database_tables_initialized")

    yield

    # Shutdown: Cleanup if needed
    logger.info("application_shutting_down")


# Create FastAPI application
app = FastAPI(
    title="Todo App API",
    description="Backend API for Todo App task management",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS
configure_cors(app, origins=[settings.frontend_url])

# Add request logging middleware
app.add_middleware(RequestLoggingMiddleware)

# Register exception handlers
register_exception_handlers(app)

# Include API routers
app.include_router(v1_router)


@app.get("/health", tags=["System"])
async def health_check():
    """
    Health check endpoint.

    Returns database connection status. No authentication required.
    """
    db_connected = check_connection()

    return {
        "status": "healthy" if db_connected else "unhealthy",
        "database": "connected" if db_connected else "disconnected",
        "version": "1.0.0",
    }
