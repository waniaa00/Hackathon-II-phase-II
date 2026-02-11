"""Pagination schemas for list endpoints."""

from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    """Pagination parameters for list queries."""

    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    page_size: int = Field(
        default=20,
        ge=1,
        le=100,
        description="Number of items per page (max 100)",
    )

    @property
    def offset(self) -> int:
        """Calculate SQL offset from page and page_size."""
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """Return limit value (same as page_size)."""
        return self.page_size


class PaginationMeta(BaseModel):
    """Pagination metadata for list responses."""

    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Items per page")
    total_pages: int = Field(..., description="Total number of pages")

    @classmethod
    def from_params(
        cls, total: int, page: int, page_size: int
    ) -> "PaginationMeta":
        """Create pagination metadata from parameters."""
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1
        return cls(
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
