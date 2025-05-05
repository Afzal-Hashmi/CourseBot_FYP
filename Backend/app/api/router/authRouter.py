from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.connection import get_db
from app.schemas.userSchema import UserSchema, UserCreate, UserLoginSchema
from app.api.controllers.auth.authController import loginUserController, signupUser

authRouter = APIRouter()


@authRouter.post("/student-signup", response_model=UserSchema)
async def studentSignupRoute(
        userData: UserCreate, roleType: str = "student"
):
    return await signupUser(userData, roleType=roleType)


@authRouter.post("/teacher-signup", response_model=UserSchema)
async def teacherSignupRoute(
        userData: UserCreate, roleType: str = "teacher"
):
    return await signupUser(userData, roleType=roleType)


@authRouter.post("/login")
async def login(userData: UserLoginSchema):
    Response = await loginUserController(userData)
    if Response:
        return JSONResponse(
            content={
                "succeeded": True,
                "message": "Data fetched successfully",
                "data": Response,
                "httpStatusCode": status.HTTP_200_OK,
            },
            status_code=status.HTTP_200_OK,
        )
    else:
        return JSONResponse(
            content={
                "succeeded": False,
                "message": str("User NOt Found"),
                "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
