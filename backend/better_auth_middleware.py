"""
Better-Auth Integration for FastAPI
Handles session validation and user authentication
"""

from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import httpx
import os
from pydantic import BaseModel


class BetterAuthUser(BaseModel):
    id: str
    email: str
    name: Optional[str] = None


class BetterAuthMiddleware:
    def __init__(self):
        self.auth_url = os.getenv("BETTER_AUTH_URL", "http://localhost:3000/api/auth")
        self.client = httpx.AsyncClient()

    async def get_session_from_cookies(self, request: Request) -> Optional[BetterAuthUser]:
        """
        Extract Better-Auth session from cookies and validate it
        """
        try:
            # Get the session cookie
            session_token = request.cookies.get("__Secure-authjs.session-token")
            if not session_token:
                # Try alternative cookie names that Better-Auth might use
                for cookie_name in ["authjs.session-token", "better-auth.session-token"]:
                    session_token = request.cookies.get(cookie_name)
                    if session_token:
                        break

            if not session_token:
                return None

            # Validate session with Better-Auth API
            auth_response = await self.client.get(
                f"{self.auth_url}/session",
                headers={"Cookie": f"__Secure-authjs.session-token={session_token}"},
            )

            if auth_response.status_code != 200:
                return None

            session_data = auth_response.json()
            if not session_data.get("session"):
                return None

            user_data = session_data["user"]
            return BetterAuthUser(
                id=user_data["id"],
                email=user_data["email"],
                name=user_data.get("name"),
            )

        except Exception as e:
            print(f"[BETTER_AUTH] Error validating session: {e}")
            return None

    async def close(self):
        await self.client.aclose()


# Global instance
better_auth_middleware = BetterAuthMiddleware()