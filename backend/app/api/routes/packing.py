from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.trip import Trip
from app.models.packing_item import PackingItem
from app.schemas.packing import PackingItemCreate, PackingItemResponse, PackingItemUpdate

router = APIRouter(prefix="/trips", tags=["Packing"])


@router.get("/{trip_id}/packing", response_model=List[PackingItemResponse])
async def list_packing_items(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    return db.query(PackingItem).filter(PackingItem.trip_id == trip_id).all()


@router.post("/{trip_id}/packing", response_model=PackingItemResponse, status_code=status.HTTP_201_CREATED)
async def create_packing_item(
    trip_id: int,
    item_data: PackingItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    item = PackingItem(**item_data.model_dump(), trip_id=trip_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/packing/{id}", response_model=PackingItemResponse)
async def toggle_packing_item(
    id: int,
    update_data: PackingItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(PackingItem).filter(PackingItem.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    trip = db.query(Trip).filter(Trip.id == item.trip_id).first()
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    item.is_packed = update_data.is_packed
    db.commit()
    db.refresh(item)
    return item


@router.delete("/packing/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_packing_item(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(PackingItem).filter(PackingItem.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    trip = db.query(Trip).filter(Trip.id == item.trip_id).first()
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    db.delete(item)
    db.commit()
