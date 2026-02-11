"""Error response schemas for API documentation."""

from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """Standard error response format."""

    detail: str = Field(..., description="Human-readable error message")
    type: str = Field(..., description="Error type identifier")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "detail": "Resource not found",
                    "type": "not_found",
                },
                {
                    "detail": "Token has expired",
                    "type": "token_expired",
                },
            ]
        }
    }


class ValidationErrorDetail(BaseModel):
    """Individual validation error detail."""

    field: str = Field(..., description="Field path that failed validation")
    message: str = Field(..., description="Validation error message")
    type: str = Field(..., description="Validation error type")


class ValidationErrorResponse(BaseModel):
    """Validation error response with field-level details."""

    detail: str = Field(default="Validation error")
    type: str = Field(default="validation_error")
    errors: list[ValidationErrorDetail] = Field(
        ..., description="List of validation errors"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "detail": "Validation error",
                    "type": "validation_error",
                    "errors": [
                        {
                            "field": "body.title",
                            "message": "Field required",
                            "type": "missing",
                        }
                    ],
                }
            ]
        }
    }
