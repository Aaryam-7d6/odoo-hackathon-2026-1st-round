from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import date, datetime


class StopBase(BaseModel):
    city_id: int
    order_index: int = 0
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    notes: Optional[str] = None


class StopCreate(StopBase):
    pass


class StopUpdate(BaseModel):
    city_id: Optional[int] = None
    order_index: Optional[int] = None
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    notes: Optional[str] = None


class StopResponse(StopBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    trip_id: int
    created_at: datetime
    updated_at: datetime


class TripBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    cover_photo_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_public: bool = False


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    cover_photo_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_public: Optional[bool] = None


class TripResponse(TripBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    share_token: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class TripDetailResponse(TripResponse):
    stops: List[StopResponse] = []


class ReorderStopsRequest(BaseModel):
    stops: List[dict] = Field(..., description="List of {id, order_index}")
