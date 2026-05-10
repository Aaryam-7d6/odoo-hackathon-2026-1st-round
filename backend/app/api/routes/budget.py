from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.trip import Trip
from app.models.budget import Budget
from app.models.expense import Expense
from app.schemas.budget import BudgetResponse, BudgetUpdate
from app.schemas.expense import ExpenseCreate, ExpenseResponse

router = APIRouter(prefix="/trips", tags=["Budget"])


@router.get("/{trip_id}/budget", response_model=BudgetResponse)
async def get_budget(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    budget = db.query(Budget).filter(Budget.trip_id == trip_id).first()
    if not budget:
        budget = Budget(trip_id=trip_id)
        db.add(budget)
        db.commit()
        db.refresh(budget)
    return budget


@router.put("/{trip_id}/budget", response_model=BudgetResponse)
async def update_budget(
    trip_id: int,
    budget_data: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    budget = db.query(Budget).filter(Budget.trip_id == trip_id).first()
    if not budget:
        budget = Budget(trip_id=trip_id)
        db.add(budget)
    for key, value in budget_data.model_dump(exclude_unset=True).items():
        setattr(budget, key, value)
    db.commit()
    db.refresh(budget)
    return budget


@router.get("/{trip_id}/expenses", response_model=List[ExpenseResponse])
async def list_expenses(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    return db.query(Expense).filter(Expense.trip_id == trip_id).all()


@router.post("/{trip_id}/expenses", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    trip_id: int,
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission")
    expense = Expense(**expense_data.model_dump(), trip_id=trip_id)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense
