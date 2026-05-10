from pydantic import BaseModel, ConfigDict
from typing import Optional


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    user_id: int
    email: str
    name: str
    access_token: str
    token_type: str = "bearer"
