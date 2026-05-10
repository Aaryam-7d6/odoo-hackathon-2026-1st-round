from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.trip import Trip, Stop

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_users = db.query(func.count(User.id)).scalar()
    total_trips = db.query(func.count(Trip.id)).scalar()
    total_stops = db.query(func.count(Stop.id)).scalar()
    return {
        "total_users": total_users,
        "total_trips": total_trips,
        "total_stops": total_stops
    }
