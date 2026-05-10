from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.trip import Trip
from app.models.trip_note import TripNote
from app.schemas.note import TripNoteCreate, TripNoteResponse, TripNoteUpdate

router = APIRouter(prefix="/trips", tags=["Notes"])


@router.get("/{trip_id}/notes", response_model=List[TripNoteResponse])
async def list_notes(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    return db.query(TripNote).filter(TripNote.trip_id == trip_id).order_by(TripNote.created_at.desc()).all()


@router.post("/{trip_id}/notes", response_model=TripNoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    trip_id: int,
    note_data: TripNoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    note = TripNote(**note_data.model_dump(), trip_id=trip_id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.put("/notes/{id}", response_model=TripNoteResponse)
async def update_note(
    id: int,
    note_data: TripNoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(TripNote).filter(TripNote.id == id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    trip = db.query(Trip).filter(Trip.id == note.trip_id).first()
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    for key, value in note_data.model_dump(exclude_unset=True).items():
        setattr(note, key, value)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/notes/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(TripNote).filter(TripNote.id == id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    trip = db.query(Trip).filter(Trip.id == note.trip_id).first()
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    db.delete(note)
    db.commit()
