# fastapi
from fastapi import HTTPException
from fastapi.responses import JSONResponse
# sqlAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
# utils
from app.utils.generateHash import generateHash
# Schemas
from app.schemas.user_schema import UserCreate
# Repo
from app.repo.user_Repo import get_roleId
from app.repo.user_Repo import create_user_repo
# OS
import os
# Dotenv
from dotenv import load_dotenv
load_dotenv()


async def create_user(user_Data: UserCreate, db: AsyncSession, role_type: str):
    """
    Creates a new user in the database.

    Args:
        user_Data (UserCreate): The user information to be created.
        db (AsyncSession): The database session.

    Returns:
        JSONResponse: A JSON response with a success status and a message indicating whether the user was created successfully or not.
    """
    try:
        role_id=await get_roleId(findRole=role_type,db=db)
        if not role_id:  # Ensure the role is not None before accessing its ID
            raise HTTPException(status_code=400, detail="Role not found or could not be created.")
            
        # Ensure password is not empty before hashing
        if not user_Data.password or len(user_Data.password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")

        user_Data.roleId = role_id
        # Hash the password and set the necessary fields
        user_Data.hashPassword, user_Data.salt = generateHash(user_Data.password)

        # Create the user in the database
        if await create_user_repo(user_Data,db=db):
            return JSONResponse(content={"success": True, "message": "User created successfully", "status": 200})
        else:
            raise HTTPException(status_code=500, detail="Internal server error during user creation.")
    except SQLAlchemyError as e:
        # Catch database errors and log the exception
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during user creation.")

    except Exception as e:
        # Catch other unexpected errors and log the exception
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during user creation.")



