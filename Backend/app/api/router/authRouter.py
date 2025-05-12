from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.connection import get_db
from app.schemas.userSchema import UserSchema, UserCreate, UserLoginSchema
from app.api.controllers.auth.authController import UserController

authRouter = APIRouter()


@authRouter.post("/student-signup")
async def studentSignupRoute(
        userData: UserCreate, roleType: str = "student"
):
    user_controller = UserController()
    return await user_controller.signupUser(userData, roleType=roleType)


@authRouter.post("/teacher-signup")
async def teacherSignupRoute(
        userData: UserCreate, roleType: str = "teacher"
):
    user_controller = UserController()
    return await user_controller.signupUser(userData, roleType=roleType)


@authRouter.post("/login")
async def login(userData: UserLoginSchema, controller: UserController = Depends(UserController)):
    return await controller.loginUserController(userData)