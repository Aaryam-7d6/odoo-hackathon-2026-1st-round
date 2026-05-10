import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, init_db
from app.models.city import City
from app.models.activity import Activity


def seed():
    init_db()
    db = SessionLocal()

    try:
        if db.query(City).count() > 0:
            print("Seed data already exists. Skipping.")
            return

        city_data = [
            {"name": "Paris", "country": "France", "region": "Europe", "cost_index": 8.5, "popularity_score": 10, "description": "The City of Light, famous for the Eiffel Tower and world-class cuisine."},
            {"name": "Tokyo", "country": "Japan", "region": "Asia", "cost_index": 9.0, "popularity_score": 10, "description": "A vibrant metropolis blending ultramodern and traditional."},
            {"name": "New York", "country": "USA", "region": "North America", "cost_index": 9.5, "popularity_score": 10, "description": "The city that never sleeps, home to iconic landmarks and Broadway."},
            {"name": "London", "country": "United Kingdom", "region": "Europe", "cost_index": 8.0, "popularity_score": 9, "description": "Historic capital with royal palaces, world-class museums, and diverse culture."},
            {"name": "Bali", "country": "Indonesia", "region": "Asia", "cost_index": 5.0, "popularity_score": 9, "description": "Tropical paradise with stunning beaches, ancient temples, and lush rice terraces."},
            {"name": "Rome", "country": "Italy", "region": "Europe", "cost_index": 7.5, "popularity_score": 9, "description": "The Eternal City with ancient ruins, the Vatican, and incredible food."},
            {"name": "Barcelona", "country": "Spain", "region": "Europe", "cost_index": 7.0, "popularity_score": 8, "description": "Mediterranean gem with Gaudi architecture, beaches, and vibrant nightlife."},
            {"name": "Dubai", "country": "UAE", "region": "Middle East", "cost_index": 8.0, "popularity_score": 9, "description": "Futuristic city of superlatives, luxury shopping, and desert adventures."},
            {"name": "Sydney", "country": "Australia", "region": "Oceania", "cost_index": 8.5, "popularity_score": 8, "description": "Harbor city with iconic Opera House, beaches, and vibrant culture."},
            {"name": "Santorini", "country": "Greece", "region": "Europe", "cost_index": 8.0, "popularity_score": 9, "description": "Stunning volcanic island with white-washed buildings, blue domes, and sunsets."},
            {"name": "Marrakech", "country": "Morocco", "region": "Africa", "cost_index": 4.0, "popularity_score": 7, "description": "Colorful medina with souks, palaces, and vibrant street life."},
            {"name": "Reykjavik", "country": "Iceland", "region": "Europe", "cost_index": 9.0, "popularity_score": 7, "description": "Gateway to Iceland's dramatic landscapes, geysers, and northern lights."},
            {"name": "Cape Town", "country": "South Africa", "region": "Africa", "cost_index": 5.5, "popularity_score": 8, "description": "Stunning coastal city with Table Mountain, wine regions, and rich history."},
            {"name": "Berlin", "country": "Germany", "region": "Europe", "cost_index": 6.5, "popularity_score": 7, "description": "Vibrant capital with rich history, street art, and nightlife."},
            {"name": "Amsterdam", "country": "Netherlands", "region": "Europe", "cost_index": 7.5, "popularity_score": 8, "description": "Canal city with world-class museums, cycling culture, and charming architecture."},
            {"name": "Bangkok", "country": "Thailand", "region": "Asia", "cost_index": 4.5, "popularity_score": 9, "description": "City of contrasts with ornate temples, bustling markets, and amazing street food."},
            {"name": "Prague", "country": "Czech Republic", "region": "Europe", "cost_index": 5.5, "popularity_score": 7, "description": "Medieval fairytale city with stunning architecture, castle views, and cheap beer."},
            {"name": "Lisbon", "country": "Portugal", "region": "Europe", "cost_index": 6.0, "popularity_score": 8, "description": "Hilly coastal capital with historic trams, Fado music, and pastel buildings."},
            {"name": "Istanbul", "country": "Turkey", "region": "Europe/Asia", "cost_index": 5.5, "popularity_score": 9, "description": "Bridge between East and West with stunning mosques, bazaars, and history."},
            {"name": "Cartagena", "country": "Colombia", "region": "South America", "cost_index": 4.5, "popularity_score": 7, "description": "Colorful colonial port city with walled old town and Caribbean charm."},
        ]

        activities_data = {
            "Paris": [
                {"name": "Eiffel Tower Visit", "type": "Sightseeing", "duration_hours": 2.5, "estimated_cost": 28.0},
                {"name": "Louvre Museum", "type": "Museum", "duration_hours": 4.0, "estimated_cost": 17.0},
                {"name": "Montmartre Walking Tour", "type": "Cultural", "duration_hours": 3.0, "estimated_cost": 25.0},
                {"name": "Seine River Cruise", "type": "Sightseeing", "duration_hours": 1.5, "estimated_cost": 15.0},
                {"name": "Le Marais Food Tour", "type": "Food & Drink", "duration_hours": 3.0, "estimated_cost": 50.0},
            ],
            "Tokyo": [
                {"name": "Senso-ji Temple Visit", "type": "Cultural", "duration_hours": 2.0, "estimated_cost": 0.0},
                {"name": "Tsukiji Outer Market Food Tour", "type": "Food & Drink", "duration_hours": 3.0, "estimated_cost": 50.0},
                {"name": "Shibuya Crossing Experience", "type": "Sightseeing", "duration_hours": 1.0, "estimated_cost": 0.0},
                {"name": "TeamLab Borderless Art Museum", "type": "Museum", "duration_hours": 3.0, "estimated_cost": 32.0},
                {"name": "Akihabara Electronics District", "type": "Shopping", "duration_hours": 3.0, "estimated_cost": 100.0},
            ],
            "New York": [
                {"name": "Statue of Liberty & Ellis Island", "type": "Sightseeing", "duration_hours": 4.0, "estimated_cost": 24.0},
                {"name": "Central Park Walk", "type": "Nature", "duration_hours": 2.0, "estimated_cost": 0.0},
                {"name": "Broadway Show", "type": "Entertainment", "duration_hours": 3.0, "estimated_cost": 150.0},
                {"name": "Metropolitan Museum of Art", "type": "Museum", "duration_hours": 4.0, "estimated_cost": 25.0},
                {"name": "Brooklyn Bridge Walk", "type": "Sightseeing", "duration_hours": 1.5, "estimated_cost": 0.0},
            ],
            "London": [
                {"name": "British Museum Visit", "type": "Museum", "duration_hours": 4.0, "estimated_cost": 0.0},
                {"name": "Tower of London Tour", "type": "Cultural", "duration_hours": 3.0, "estimated_cost": 30.0},
                {"name": "Thames River Cruise", "type": "Sightseeing", "duration_hours": 1.5, "estimated_cost": 18.0},
                {"name": "West End Theatre Show", "type": "Entertainment", "duration_hours": 3.0, "estimated_cost": 80.0},
                {"name": "Borough Market Food Tour", "type": "Food & Drink", "duration_hours": 2.0, "estimated_cost": 25.0},
            ],
            "Bali": [
                {"name": "Tegallalang Rice Terraces", "type": "Nature", "duration_hours": 2.0, "estimated_cost": 5.0},
                {"name": "Uluwatu Temple Sunset", "type": "Cultural", "duration_hours": 3.0, "estimated_cost": 15.0},
                {"name": "Ubud Monkey Forest", "type": "Nature", "duration_hours": 2.0, "estimated_cost": 10.0},
                {"name": "Snorkeling at Padan Bay", "type": "Adventure", "duration_hours": 3.0, "estimated_cost": 40.0},
                {"name": "Traditional Balinese Cooking Class", "type": "Food & Drink", "duration_hours": 4.0, "estimated_cost": 35.0},
            ],
            "Rome": [
                {"name": "Colosseum Guided Tour", "type": "Cultural", "duration_hours": 3.0, "estimated_cost": 45.0},
                {"name": "Vatican Museums & Sistine Chapel", "type": "Museum", "duration_hours": 4.0, "estimated_cost": 17.0},
                {"name": "Trastevere Food Tour", "type": "Food & Drink", "duration_hours": 3.0, "estimated_cost": 60.0},
                {"name": "Trevi Fountain & Spanish Steps Walk", "type": "Sightseeing", "duration_hours": 2.0, "estimated_cost": 0.0},
                {"name": "Borghese Gallery", "type": "Museum", "duration_hours": 3.0, "estimated_cost": 15.0},
            ],
            "Barcelona": [
                {"name": "La Sagrada Familia Tour", "type": "Cultural", "duration_hours": 2.5, "estimated_cost": 26.0},
                {"name": "Park Guell Visit", "type": "Cultural", "duration_hours": 2.0, "estimated_cost": 10.0},
                {"name": "La Boqueria Market Tour", "type": "Food & Drink", "duration_hours": 1.5, "estimated_cost": 15.0},
                {"name": "Barceloneta Beach Day", "type": "Beach", "duration_hours": 4.0, "estimated_cost": 0.0},
                {"name": "Gothic Quarter Walking Tour", "type": "Cultural", "duration_hours": 2.0, "estimated_cost": 20.0},
            ],
            "Dubai": [
                {"name": "Burj Khalifa Observation Deck", "type": "Sightseeing", "duration_hours": 1.5, "estimated_cost": 50.0},
                {"name": "Desert Safari", "type": "Adventure", "duration_hours": 5.0, "estimated_cost": 75.0},
                {"name": "Dubai Mall Shopping", "type": "Shopping", "duration_hours": 4.0, "estimated_cost": 100.0},
                {"name": "Old Dubai Walking Tour", "type": "Cultural", "duration_hours": 3.0, "estimated_cost": 30.0},
                {"name": "Dhow Cruise Dinner", "type": "Food & Drink", "duration_hours": 2.5, "estimated_cost": 60.0},
            ],
            "Sydney": [
                {"name": "Sydney Opera House Tour", "type": "Cultural", "duration_hours": 1.5, "estimated_cost": 40.0},
                {"name": "Bondi to Coogee Coastal Walk", "type": "Nature", "duration_hours": 3.0, "estimated_cost": 0.0},
                {"name": "Blue Mountains Day Trip", "type": "Nature", "duration_hours": 8.0, "estimated_cost": 100.0},
                {"name": "Taronga Zoo Visit", "type": "Entertainment", "duration_hours": 4.0, "estimated_cost": 40.0},
                {"name": "Harbour Bridge Climb", "type": "Adventure", "duration_hours": 3.5, "estimated_cost": 220.0},
            ],
            "Santorini": [
                {"name": "Oia Sunset Viewpoint", "type": "Sightseeing", "duration_hours": 2.0, "estimated_cost": 0.0},
                {"name": "Akrotiri Archaeological Site", "type": "Cultural", "duration_hours": 2.0, "estimated_cost": 12.0},
                {"name": "Red Beach Visit", "type": "Beach", "duration_hours": 2.0, "estimated_cost": 0.0},
                {"name": "Wine Tasting Tour", "type": "Food & Drink", "duration_hours": 3.0, "estimated_cost": 50.0},
                {"name": "Caldera Boat Cruise", "type": "Adventure", "duration_hours": 5.0, "estimated_cost": 120.0},
            ],
        }

        default_activities = [
            {"name": "City Walking Tour", "type": "Cultural", "duration_hours": 3.0, "estimated_cost": 20.0},
            {"name": "Local Market Visit", "type": "Shopping", "duration_hours": 2.0, "estimated_cost": 10.0},
            {"name": "Traditional Restaurant Dinner", "type": "Food & Drink", "duration_hours": 2.0, "estimated_cost": 40.0},
            {"name": "Museum Visit", "type": "Museum", "duration_hours": 2.5, "estimated_cost": 15.0},
            {"name": "Sunset Viewing Spot", "type": "Sightseeing", "duration_hours": 1.5, "estimated_cost": 5.0},
            {"name": "Local Cooking Class", "type": "Food & Drink", "duration_hours": 4.0, "estimated_cost": 50.0},
            {"name": "Photography Walk", "type": "Cultural", "duration_hours": 2.0, "estimated_cost": 0.0},
            {"name": "Street Food Tasting", "type": "Food & Drink", "duration_hours": 2.0, "estimated_cost": 15.0},
            {"name": "Beach Day", "type": "Beach", "duration_hours": 5.0, "estimated_cost": 10.0},
            {"name": "Day Trip to Nearby Town", "type": "Adventure", "duration_hours": 8.0, "estimated_cost": 60.0},
        ]

        city_objects = {}
        for cd in city_data:
            city = City(**cd)
            db.add(city)
            db.flush()
            city_objects[city.name] = city

        db.commit()

        for city_name, acts in activities_data.items():
            city = city_objects.get(city_name)
            if city:
                for act in acts:
                    activity = Activity(city_id=city.id, **act)
                    db.add(activity)

        for city in city_objects.values():
            if city.name not in activities_data:
                for act in default_activities:
                    activity = Activity(city_id=city.id, **act)
                    db.add(activity)

        db.commit()
        print(f"Seeded {len(city_objects)} cities with activities.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
