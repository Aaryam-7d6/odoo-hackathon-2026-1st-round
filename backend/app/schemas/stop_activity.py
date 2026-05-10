from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import time


class StopActivityBase(BaseModel):
    activity_id: int
    scheduled_time: Optional[time] = None
    actual_cost: Optional[float] = None
    is_confirmed: bool = False


class StopActivityCreate(StopActivityBase):
    pass


class StopActivityResponse(StopActivityBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    stop_id: int
    created_at: Optional[object] = None
    updated_at: Optional[object] = None
