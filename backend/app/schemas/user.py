from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    photo_url: Optional[str] = None
    language_pref: Optional[str] = Field(None, max_length=10)


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    photo_url: Optional[str] = None
    language_pref: str = "en"
    created_at: datetime
