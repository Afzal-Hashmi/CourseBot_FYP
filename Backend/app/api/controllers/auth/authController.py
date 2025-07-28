from fastapi import Depends, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from ....services.authServices import AuthService
from ....schemas.userSchema import UserCreate, UserPasswordResetSchema
import cloudinary
import cloudinary.uploader

class UserController:
    def __init__(self,service: AuthService = Depends(AuthService)):
        self.user_service = service

    async def signup_user_controller(self,userData: UserCreate, roleType: str, profileImage=None):
        if profileImage:
            upload_result = cloudinary.uploader.upload(profileImage.file, folder="profile_images")
            userData.profilePicture = upload_result.get('secure_url')
        elif not userData.profilePicture:
            userData.profilePicture = None

        return await self.user_service.create_user_service(userData, role=roleType)


    async def login_user_controller(self,userData: OAuth2PasswordRequestForm = Depends()):
        Response = await self.user_service.login_user_service(userData)
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
        
    async def user_exist_controller(self, userEmail: str):
        userExist = await self.user_service.user_exist_service(userEmail)
        return userExist
    
    async def google_signup_controller(self, userinfo: dict, roleType: str = "student"):
        userData = UserCreate(
            firstName=userinfo.get("given_name"),
            lastName=userinfo.get("family_name"),
            email=userinfo.get("email"),
            password=userinfo.get("sub"),
            profilePicture=userinfo.get('picture')
        )
        return await self.signup_user_controller(userData, roleType)
        
    async def reset_password_controller(self, data: UserPasswordResetSchema, currentUser: dict):
        if not currentUser:
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Unauthorized",
                    "httpStatusCode": status.HTTP_401_UNAUTHORIZED,
                },
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        
        response = await self.user_service.reset_password_service(data, currentUser)
        if response:
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Password updated successfully",
                    "httpStatusCode": status.HTTP_200_OK,
                },
                status_code=status.HTTP_200_OK,
            )
        else:
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Failed to update password",
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

