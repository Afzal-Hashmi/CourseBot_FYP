from fastapi import Depends, status
from fastapi.responses import JSONResponse
from app.services.userServices import UserService
from app.schemas.userSchema import UserCreate, UserLoginSchema


class UserController:
    def __init__(self,service: UserService = Depends(UserService)):
        self.user_service = service

    async def signupUser(self,userData: UserCreate, roleType: str):
        return await self.user_service.createUser(userData, role=roleType)


    async def loginUserController(self,userData: UserLoginSchema):
        Response = await self.user_service.loginUser(userData)
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

