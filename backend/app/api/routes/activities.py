from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.activity import Activity
from app.models.trip import Stop, Trip
from app.models.stop_activity import StopActivity
from app.schemas.activity import ActivityResponse
from app.schemas.stop_activity import StopActivityCreate, StopActivityResponse

router = APIRouter(tags=["Activities"])


@router.get("/activities", response_model=List[ActivityResponse])
async def list_activities(
    city_id: int = None,
    type: str = "",
    max_cost: float = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if city_id:
        query = query.filter(Activity.city_id == city_id)
    if type:
        query = query.filter(Activity.type.ilike(f"%{type}%"))
    if max_cost is not None:
        query = query.filter(Activity.estimated_cost <= max_cost)
    return query.offset(skip).limit(limit).all()


@router.post("/stops/{stop_id}/activities", response_model=StopActivityResponse, status_code=status.HTTP_201_CREATED)
async def add_activity_to_stop(
    stop_id: int,
    activity_data: StopActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")
    trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    sa = StopActivity(**activity_data.model_dump(), stop_id=stop_id)
    db.add(sa)
    db.commit()
    db.refresh(sa)
    return sa


@router.delete("/stop-activities/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_stop_activity(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sa = db.query(StopActivity).filter(StopActivity.id == id).first()
    if not sa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    stop = db.query(Stop).filter(Stop.id == sa.stop_id).first()
    trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    db.delete(sa)
    db.commit()
