from sqlalchemy.orm import Session
from app.models.city import City
from typing import Optional


class CityService:
    @staticmethod
    def search_cities(
        db: Session,
        search: str = "",
        country: str = "",
        region: str = "",
        skip: int = 0,
        limit: int = 50
    ) -> list[City]:
        query = db.query(City)
        if search:
            query = query.filter(City.name.ilike(f"%{search}%"))
        if country:
            query = query.filter(City.country.ilike(f"%{country}%"))
        if region:
            query = query.filter(City.region.ilike(f"%{region}%"))
        return query.offset(skip).limit(limit).all()
