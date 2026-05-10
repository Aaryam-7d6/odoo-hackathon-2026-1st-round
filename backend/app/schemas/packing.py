from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class PackingItemBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    category: str = Field(min_length=1, max_length=50)


class PackingItemCreate(PackingItemBase):
    pass


class PackingItemUpdate(BaseModel):
    is_packed: bool


class PackingItemResponse(PackingItemBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    trip_id: int
    is_packed: bool
    created_at: datetime
    updated_at: datetime
