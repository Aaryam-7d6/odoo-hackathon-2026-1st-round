from sqlalchemy.orm import Session
from app.models.trip import Trip, Stop
from app.models.city import City
from app.schemas.trip import TripCreate, TripUpdate


class TripService:
    @staticmethod
    def create_trip(db: Session, user_id: int, trip_data: TripCreate) -> Trip:
        trip = Trip(**trip_data.model_dump(), user_id=user_id)
        db.add(trip)
        db.commit()
        db.refresh(trip)
        return trip

    @staticmethod
    def get_user_trips(db: Session, user_id: int) -> list[Trip]:
        return db.query(Trip).filter(Trip.user_id == user_id).order_by(Trip.updated_at.desc()).all()
