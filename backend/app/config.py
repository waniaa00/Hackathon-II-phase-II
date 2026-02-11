"""Environment configuration using pydantic-settings."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    neon_db_url: str

    # Frontend (for JWKS and CORS)
    frontend_url: str = "http://localhost:3000"

    # Better Auth (for JWT verification)
    better_auth_secret: str

    # Environment
    environment: str = "development"

    @property
    def jwks_url(self) -> str:
        """JWKS endpoint for JWT verification."""
        return f"{self.frontend_url}/api/auth/jwks"

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment == "development"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
