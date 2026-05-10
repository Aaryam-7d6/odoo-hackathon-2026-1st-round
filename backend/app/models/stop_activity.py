from sqlalchemy import Column, Integer, Float, Boolean, Time, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class StopActivity(Base):
    __tablename__ = "stop_activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    stop_id = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_id = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False, index=True)
    scheduled_time = Column(Time, nullable=True)
    actual_cost = Column(Float, nullable=True)
    is_confirmed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    stop = relationship("Stop", back_populates="stop_activities")
    activity = relationship("Activity", back_populates="stop_activities")
