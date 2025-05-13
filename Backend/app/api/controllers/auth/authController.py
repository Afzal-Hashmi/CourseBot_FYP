from fastapi import Depends, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from ....services.authServices import AuthService
from app.schemas.userSchema import UserCreate, UserLoginSchema


class UserController:
    def __init__(self,service: AuthService = Depends(AuthService)):
        self.user_service = service

    async def signupUser(self,userData: UserCreate, roleType: str):
        return await self.user_service.createUser(userData, role=roleType)


    async def loginUserController(self,userData: OAuth2PasswordRequestForm = Depends()):
        print(userData)
        Response = await self.user_service.loginUser(userData)
        print("Response: ", Response.get('token'))
        if Response:
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Data fetched successfully",
                    "data": Response,
                    "httpStatusCode": status.HTTP_200_OK,
                    "access_token": Response.get('token'),
                    'token_type': "Bearer",

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

