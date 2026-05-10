from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    transport_budget = Column(Float, default=0.0)
    stay_budget = Column(Float, default=0.0)
    activities_budget = Column(Float, default=0.0)
    meals_budget = Column(Float, default=0.0)
    misc_budget = Column(Float, default=0.0)
    total_budget = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    trip = relationship("Trip", back_populates="budget")
