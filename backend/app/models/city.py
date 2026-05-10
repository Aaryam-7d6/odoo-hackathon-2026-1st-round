from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    country = Column(String(255), nullable=False, index=True)
    region = Column(String(255), nullable=True)
    cost_index = Column(Float, default=5.0)
    popularity_score = Column(Integer, default=5)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    stops = relationship("Stop", back_populates="city")
    activities = relationship("Activity", back_populates="city")
