from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./traveloop.db"
    SECRET_KEY: str = "traveloop-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    APP_NAME: str = "Traveloop"
    APP_VERSION: str = "1.0.0"

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
