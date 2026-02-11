"""JWT security and token verification utilities."""

from functools import lru_cache
import jwt
from jwt import PyJWKClient

from app.config import get_settings


class JWTVerificationError(Exception):
    """Raised when JWT verification fails."""

    def __init__(self, message: str, error_code: str = "invalid_token"):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)


@lru_cache(maxsize=1)
def get_jwk_client() -> PyJWKClient:
    """
    Get cached JWK client for token verification.

    The client caches JWKS keys for 1 hour to reduce network calls.
    """
    settings = get_settings()
    return PyJWKClient(settings.jwks_url, cache_keys=True, lifespan=3600)


def verify_token(token: str) -> dict:
    """
    Verify JWT token using JWKS from Better Auth.

    Args:
        token: The JWT token string

    Returns:
        Token payload as dictionary

    Raises:
        JWTVerificationError: If token is invalid or expired
    """
    try:
        jwk_client = get_jwk_client()
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA", "ES256", "RS256"],
            options={"verify_aud": False}  # Better Auth may not set audience
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise JWTVerificationError("Token has expired", "token_expired")
    except jwt.InvalidTokenError as e:
        raise JWTVerificationError(f"Invalid token: {str(e)}", "invalid_token")
