from ...utils.auth import get_current_user
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, Body, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from app.schemas.userSchema import UserCreate
from ..controllers.auth.authController import UserController
from ...schemas.userSchema import UserPasswordResetSchema

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

@authRouter.patch("/reset-password")
async def resetPassword(
                        data: UserPasswordResetSchema = Body(...),
                        currentUser = Depends(get_current_user), 
                        controller: UserController = Depends(UserController)):
    try:
        # if data.currentPassword == data.newPassword:
        #     raise ValueError("New password must be different from the current password.")
        # if len(data.newPassword) < 8 or len(data.newPassword) > 50:
        #     raise ValueError("Password must be between 8 and 50 characters long.")
        # if not any(char.isdigit() for char in data.newPassword):
        #     raise ValueError("Password must contain at least one digit.")
        # if not any(char.isupper() for char in data.newPassword):
        #     raise ValueError("Password must contain at least one uppercase letter.")
        # if not any(char.islower() for char in data.newPassword):
        #     raise ValueError("Password must contain at least one lowercase letter.")
        # if not any(char in "!@#$%^&*()-_=+[]{}|;:,.<>?/" for char in data.newPassword):
        #     raise ValueError("Password must contain at least one special character.")
        # print("Current User:", currentUser)
        # print("Current Password:", data.currentPassword)
        # print("New Password:", data.newPassword)
        return await controller.reset_password_controller(data, currentUser)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))