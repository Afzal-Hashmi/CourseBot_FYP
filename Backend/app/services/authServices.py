# fastapi
from datetime import datetime, timedelta
from fastapi import HTTPException, status,Depends
from fastapi.responses import JSONResponse

# sqlAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

# utils
from app.utils.generateHash import generateHash, verifyHash

# Schemas
from app.schemas.userSchema import UserCreate, UserLoginSchema

# Repo
from app.repo.userRepo import UserRepository
# from app.repo.userRepo import createUserRepo, getUserByEmail

# OS
import os

# Dotenv
from dotenv import load_dotenv

from jose import jwt, JWTError

from app.config.connection import get_db

load_dotenv()


class AuthService:
    def __init__(self,db:AsyncSession = Depends(get_db)):
        self.user_repo = UserRepository(db)
    async def create_user_service(self,userData: UserCreate, role: str):
        try:
            roleId = await self.user_repo.get_role_id_repo(role)

            if not roleId:
                raise HTTPException(status_code=400, detail="Role not found")

            userData.roleId = roleId
            userData.hashPassword, userData.salt = generateHash(userData.password)

            # Create the user in the database
            if await self.user_repo.create_user_repo(userData):
                return JSONResponse(
                    status_code=200,
                    content={"success": True, "message": "User created successfully"},
                )
            else:
                raise HTTPException(
                    status_code=500, detail="Internal server error during user creation."
                )

        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            raise HTTPException(
                status_code=500, detail="Internal server error during user creation."
            )

        except Exception as e:
            print(f"Unexpected error: {e}")
            raise HTTPException(
                status_code=500, detail="Internal server error during user creation."
            )


    async def login_user_service(self,userData: UserLoginSchema):

        user = await self.user_repo.get_user_by_email_repo(userData.username)

        if not user:
            raise HTTPException(status_code=404, detail="User does not exist")

        if not verifyHash(userData.password, user.hashPassword, user.salt):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect Password"
            )

        user = {
            "id": user.id,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "roles": user.roles.role,
            "profilePicture": user.profilePicture if user.profilePicture else None,
        }

        user.update({'exp': datetime.utcnow() + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))})

        token = jwt.encode(user, os.getenv("SECRET_KEY"), os.getenv("ALGORITHM"))
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Email and Password",
            )
        user = {**user, "token": token}
        return user
