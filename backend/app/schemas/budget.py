from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class BudgetBase(BaseModel):
    transport_budget: float = Field(default=0.0, ge=0)
    stay_budget: float = Field(default=0.0, ge=0)
    activities_budget: float = Field(default=0.0, ge=0)
    meals_budget: float = Field(default=0.0, ge=0)
    misc_budget: float = Field(default=0.0, ge=0)
    total_budget: float = Field(default=0.0, ge=0)


class BudgetUpdate(BaseModel):
    transport_budget: Optional[float] = Field(None, ge=0)
    stay_budget: Optional[float] = Field(None, ge=0)
    activities_budget: Optional[float] = Field(None, ge=0)
    meals_budget: Optional[float] = Field(None, ge=0)
    misc_budget: Optional[float] = Field(None, ge=0)
    total_budget: Optional[float] = Field(None, ge=0)


class BudgetResponse(BudgetBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    trip_id: int
    created_at: datetime
    updated_at: datetime
