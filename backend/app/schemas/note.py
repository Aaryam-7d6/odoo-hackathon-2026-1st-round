from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class TripNoteBase(BaseModel):
    content: str = Field(min_length=1)


class TripNoteCreate(TripNoteBase):
    stop_id: Optional[int] = None


class TripNoteUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1)
    stop_id: Optional[int] = None


class TripNoteResponse(TripNoteBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    trip_id: int
    stop_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
