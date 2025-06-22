from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from app.config.connection import get_db
from app.schemas.userSchema import UserCreate, UserLoginSchema, UserSignupSchema
from ..controllers.auth.authController import UserController

authRouter = APIRouter()


@authRouter.post("/student-signup")
async def studentSignupRoute(
    firstName: str = Form(...),
    lastName: str = Form(...),
    email: EmailStr = Form(...),
    password: str = Form(..., min_length=8, max_length=50),
    profilePicture: UploadFile = File(None),
    controller: UserController = Depends(UserController)
):
    try:
        # Validate form data using UserSignupSchema
        user_data = UserCreate(
            firstName=firstName,
            lastName=lastName,
            email=email,
            password=password
        )
        return await controller.signup_user_controller(user_data, roleType="student", profileImage=profilePicture)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


@authRouter.post("/teacher-signup")
async def teacherSignupRoute(
    firstName: str = Form(...),
    lastName: str = Form(...),
    email: EmailStr = Form(...),
    password: str = Form(..., min_length=8, max_length=50),
    profilePicture: UploadFile = File(None),
    controller: UserController = Depends(UserController)
):
    try:
        # Validate form data using UserSignupSchema
        user_data = UserCreate(
            firstName=firstName,
            lastName=lastName,
            email=email,
            password=password
        )
        return await controller.signup_user_controller(user_data, roleType="teacher", profileImage=profilePicture)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


@authRouter.post("/login")
async def login(userData: OAuth2PasswordRequestForm = Depends(), controller: UserController = Depends(UserController)):
    return await controller.login_user_controller(userData)
