# fastapi
from fastapi import APIRouter,Depends
from fastapi.responses import JSONResponse
# sqlAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
# Models
from app.db.models.user_model import User
# DB Connection
from app.core.connection import get_db
# utils
from app.utils.generateHash import generateHash
# Schemas
from app.schemas.user_schema import Userschema, UserCreate
# Services
from app.services.user_service import get_roleId
# OS
import os
# Dotenv
from dotenv import load_dotenv
load_dotenv()
# Routers
# from app.api.endpoints.user.student import student_router
# from app.api.endpoints.user.teacher import teacher_router

user_router = APIRouter()


@user_router.post("/create_user", response_model=Userschema)
async def create_user(user_Data: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        if user_Data.secret == (os.getenv("SECRET_KEY")):
            role=await get_roleId(findRole='teacher',db=db)
        else:
            role=await get_roleId(findRole='student',db=db)
        if role:  # Ensure the role is not None before accessing its ID
            user_Data.roleId = role
        else:
            return JSONResponse(content={"success": False, "message": "Error: Role creation failed", "status": 400})

        # Ensure password is not empty before hashing
        if not user_Data.password and len(user_Data.password) > 8:
            return JSONResponse(content={"success": False, "message": "Password is required and have atleast 8 characters", "status": 400})

        # Hash the password and set the necessary fields
        hashPassword, salt = generateHash(user_Data.password)
        user_Data.hashPassword = hashPassword.decode('utf-8')
        user_Data.salt = salt.decode('utf-8')

        # Create the user in the database
        user_dict = user_Data.dict(exclude={"password","secret"})
        user = User(**user_dict)
        db.add(user)
        await db.commit()
        await db.refresh(user)

        # Return success response
        return JSONResponse(content={"success": True, "message": "User created successfully", "status": 200})

    except SQLAlchemyError as e:
        # Catch database errors and log the exception
        print(f"Database error: {e}")
        return JSONResponse(content={"success": False, "message": "Database error while creating user", "status": 500})

    except Exception as e:
        # Catch other unexpected errors and log the exception
        print(f"Unexpected error: {e}")
        return JSONResponse(content={"success": False, "message": "Unexpected error while creating user", "status": 400})


# user_router.include_router(student_router, tags=["Student"])
# user_router.include_router(teacher_router, tags=["Teacher"])
