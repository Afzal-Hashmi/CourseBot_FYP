from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException,Depends
from sqlalchemy import select
from app.config.connection import get_db
from app.repo.db.models import Role, User
from app.schemas.userSchema import UserCreate, UserLoginSchema, UserSchema
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload, joinedload


class UserRepository:
    def __init__(self, db:AsyncSession):
        self.db = db

    async def get_role_id_repo(self, role: str) -> int | bool:
        role_result = await self.db.execute(select(Role.id).where(Role.role == role))
        return role_result.scalar_one_or_none()

    async def create_user_repo(self, userData: UserCreate) -> bool:
        try:
            userDict = userData.model_dump(exclude={"password"})
            user = User(**userDict)
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)

            return True

        except Exception as e:
            print(f"Error while creating user: {e.args}")
            raise HTTPException(
                status_code=500, detail="Email already exists or other error."
            )

    async def get_user_by_email_repo(self, email: str):
        try:
            # session = get_db_connection()
            # db = session()
            result = await self.db.execute(
                select(User).options(joinedload(User.roles)).where(User.email == email)
            )
            user = result.scalar_one_or_none()

            if user:
                return user
            else:
                return None

        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            return None

        except Exception as e:
            print(f"Unexpected error: {e}")
            return None
