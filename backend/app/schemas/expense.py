from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date


class ExpenseCreate(BaseModel):
    stop_id: Optional[int] = None
    category: str = Field(min_length=1, max_length=50)
    amount: float = Field(..., ge=0)
    description: Optional[str] = None
    date: Optional[date] = None


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    trip_id: int
    stop_id: Optional[int] = None
    category: str
    amount: float
    description: Optional[str] = None
    date: Optional[date] = None
    created_at: object
