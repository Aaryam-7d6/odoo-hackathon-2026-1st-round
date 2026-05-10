from fastapi import APIRouter
from app.api.routes import auth, cities, trips, activities, budget, packing, notes, admin, users

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(cities.router)
api_router.include_router(trips.router)
api_router.include_router(activities.router)
api_router.include_router(budget.router)
api_router.include_router(packing.router)
api_router.include_router(notes.router)
api_router.include_router(admin.router)
api_router.include_router(users.router)
