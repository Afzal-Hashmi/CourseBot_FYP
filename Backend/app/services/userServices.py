# fastapi
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

# sqlAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

# utils
from app.utils.generateHash import generateHash, verifyHash

# Schemas
from app.schemas.userSchema import UserCreate, UserLoginSchema

# Repo
from app.repo.userRepo import getRoleId
from app.repo.userRepo import createUserRepo, getUserByEmail

# OS
import os

# Dotenv
from dotenv import load_dotenv

from jose import jwt, JWTError


load_dotenv()


async def createUser(userData: UserCreate, db: AsyncSession, role: str):
    try:
        roleId = await getRoleId(role, db)

        if not roleId:
            raise HTTPException(status_code=400, detail="Role not found")

        userData.roleId = roleId
        userData.hashPassword, userData.salt = generateHash(userData.password)

        # Create the user in the database
        if await createUserRepo(userData, db=db):
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


async def loginUser(userData: UserLoginSchema):
    user = await getUserByEmail(userData.email)

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
    }

    token = jwt.encode(user, "afzal", "HS256")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Email and Password",
        )
    user = {**user, "token": token}
    return user
