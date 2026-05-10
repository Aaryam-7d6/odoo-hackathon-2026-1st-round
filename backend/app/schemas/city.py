from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class CityBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    country: str = Field(min_length=1, max_length=255)
    region: Optional[str] = None
    cost_index: float = Field(default=5.0, ge=1.0, le=10.0)
    popularity_score: int = Field(default=5, ge=1, le=10)
    description: Optional[str] = None


class CityCreate(CityBase):
    pass


class CityResponse(CityBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[object] = None
