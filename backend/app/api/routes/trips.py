from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.trip import Trip, Stop
from app.models.budget import Budget
from app.schemas.trip import (
    TripCreate, TripUpdate, TripResponse, TripDetailResponse,
    StopCreate, StopUpdate, StopResponse, ReorderStopsRequest
)

router = APIRouter(prefix="/trips", tags=["Trips"])


def _check_ownership(trip: Trip, user_id: int):
    if trip.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this trip")


@router.get("", response_model=List[TripResponse])
async def list_trips(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Trip).filter(Trip.user_id == current_user.id).offset(skip).limit(limit).order_by(Trip.updated_at.desc()).all()


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    trip_data: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = Trip(**trip_data.model_dump(), user_id=current_user.id)
    db.add(trip)
    db.commit()
    db.refresh(trip)
    budget = Budget(trip_id=trip.id)
    db.add(budget)
    db.commit()
    return trip


@router.get("/share/{share_token}", response_model=TripDetailResponse)
async def get_shared_trip(share_token: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.share_token == share_token).first()
    if not trip or not trip.is_public:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shared trip not found")
    stops = db.query(Stop).filter(Stop.trip_id == trip.id).order_by(Stop.order_index).all()
    trip_dict = {
        "id": trip.id, "user_id": trip.user_id, "name": trip.name,
        "description": trip.description, "cover_photo_url": trip.cover_photo_url,
        "start_date": trip.start_date, "end_date": trip.end_date,
        "is_public": trip.is_public, "share_token": trip.share_token,
        "created_at": trip.created_at, "updated_at": trip.updated_at,
        "stops": stops
    }
    return trip_dict


@router.get("/{trip_id}", response_model=TripDetailResponse)
async def get_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    _check_ownership(trip, current_user.id)
    stops = db.query(Stop).filter(Stop.trip_id == trip_id).order_by(Stop.order_index).all()
    return TripDetailResponse(
        id=trip.id, user_id=trip.user_id, name=trip.name,
        description=trip.description, cover_photo_url=trip.cover_photo_url,
        start_date=trip.start_date, end_date=trip.end_date,
        is_public=trip.is_public, share_token=trip.share_token,
        created_at=trip.created_at, updated_at=trip.updated_at,
        stops=[StopResponse.model_validate(s) for s in stops]
    )


@router.put("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: int,
    trip_data: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    _check_ownership(trip, current_user.id)
    for key, value in trip_data.model_dump(exclude_unset=True).items():
        setattr(trip, key, value)
    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    _check_ownership(trip, current_user.id)
    db.delete(trip)
    db.commit()


@router.get("/{trip_id}/share", response_model=dict)
async def share_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    _check_ownership(trip, current_user.id)
    trip.generate_share_token()
    trip.is_public = True
    db.commit()
    db.refresh(trip)
    return {"share_token": trip.share_token, "share_url": f"/trip/share/{trip.share_token}"}


@router.get("/{trip_id}/stops", response_model=List[StopResponse])
async def list_stops(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    _check_ownership(trip, current_user.id)
    return db.query(Stop).filter(Stop.trip_id == trip_id).order_by(Stop.order_index).all()


@router.post("/{trip_id}/stops", response_model=StopResponse, status_code=status.HTTP_201_CREATED)
async def add_stop(
    trip_id: int,
    stop_data: StopCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    _check_ownership(trip, current_user.id)
    max_order = db.query(Stop).filter(Stop.trip_id == trip_id).count()
    stop = Stop(**stop_data.model_dump(), trip_id=trip_id, order_index=max_order)
    db.add(stop)
    db.commit()
    db.refresh(stop)
    return stop


@router.put("/stops/{stop_id}", response_model=StopResponse)
async def update_stop(
    stop_id: int,
    stop_data: StopUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")
    trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
    _check_ownership(trip, current_user.id)
    for key, value in stop_data.model_dump(exclude_unset=True).items():
        setattr(stop, key, value)
    db.commit()
    db.refresh(stop)
    return stop


@router.delete("/stops/{stop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stop(stop_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")
    trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
    _check_ownership(trip, current_user.id)
    db.delete(stop)
    db.commit()


@router.patch("/stops/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_stops(
    reorder_data: ReorderStopsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for item in reorder_data.stops:
        stop = db.query(Stop).filter(Stop.id == item["id"]).first()
        if stop:
            trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
            if trip and trip.user_id == current_user.id:
                stop.order_index = item["order_index"]
    db.commit()
