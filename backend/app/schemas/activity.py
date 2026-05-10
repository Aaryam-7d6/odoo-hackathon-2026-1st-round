from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class ActivityBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    type: str = Field(min_length=1, max_length=50)
    duration_hours: float = Field(default=1.0, ge=0)
    estimated_cost: float = Field(default=0.0, ge=0)
    description: Optional[str] = None
    image_url: Optional[str] = None


class ActivityCreate(ActivityBase):
    city_id: int


class ActivityResponse(ActivityBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    city_id: int
    created_at: Optional[object] = None
