from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin


class AuthService:
    @staticmethod
    def register(db: Session, user_data: UserCreate) -> tuple[User, str]:
        user = User(
            email=user_data.email,
            name=user_data.name,
            password_hash=get_password_hash(user_data.password)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        token = create_access_token(data={"sub": str(user.id)})
        return user, token

    @staticmethod
    def login(db: Session, credentials: UserLogin) -> tuple[User, str]:
        user = db.query(User).filter(User.email == credentials.email).first()
        if not user or not verify_password(credentials.password, user.password_hash):
            return None, None
        token = create_access_token(data={"sub": str(user.id)})
        return user, token
