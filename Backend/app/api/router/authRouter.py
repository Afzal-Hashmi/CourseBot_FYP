from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.config.connection import get_db
from app.schemas.userSchema import UserCreate, UserLoginSchema
from ..controllers.auth.authController import UserController

authRouter = APIRouter()


@authRouter.post("/student-signup")
async def studentSignupRoute(
        userData: UserCreate, roleType: str = "student"
):
    user_controller = UserController()
    return await user_controller.signup_user_controller(userData, roleType=roleType)


@authRouter.post("/teacher-signup")
async def teacherSignupRoute(
        userData: UserCreate, roleType: str = "teacher"
):
    user_controller = UserController()
    return await user_controller.signup_user_controller(userData, roleType=roleType)


@authRouter.post("/login")
async def login(userData: OAuth2PasswordRequestForm = Depends(), controller: UserController = Depends(UserController)):
    print("Login route called")
    return await controller.login_user_controller(userData)