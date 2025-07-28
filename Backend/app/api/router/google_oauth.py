from app.api.controllers.auth.authController import UserController
from app.schemas.userSchema import UserLoginSchema
from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from dotenv import load_dotenv
from urllib.parse import urlencode
import json
import os

load_dotenv()

router = APIRouter()

config = Config(environ={
    'GOOGLE_CLIENT_ID': os.getenv('GOOGLE_CLIENT_ID'),
    'GOOGLE_CLIENT_SECRET': os.getenv('GOOGLE_CLIENT_SECRET'),
})
oauth = OAuth(config)
oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    redirect_uri="http://localhost:8000/auth",
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@router.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/auth')
async def auth(request: Request, controller: UserController = Depends(UserController)):
    google = oauth.create_client('google')
    token = await google.authorize_access_token(request)
    userinfo = token['userinfo']
    print("User Info:", userinfo)

    exist = await controller.user_exist_controller(userinfo.get("email")) 

    if exist:
        userData = UserLoginSchema(username=userinfo.get("email"), password=userinfo.get("sub"))
        login_result = await controller.login_user_controller(userData)
    else:
        print("User Doesnot Exist 🐞")
        completed = await controller.google_signup_controller(userinfo, roleType="student")
        if not completed:
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Google Signup Failed",
                    "httpStatusCode": 500,
                },
                status_code=500,
            )
        print("Google Signup Completed 🐞")
        userData = UserLoginSchema(username=userinfo.get("email"), password=userinfo.get("sub"))
        login_result = await controller.login_user_controller(userData)

    login_json = json.loads(login_result.body.decode())

    token = login_json["data"]["token"]
    role = login_json["data"]["roles"]
    user = login_json["data"]

    redirect_url = f"http://localhost:5173/google/success?token={token}&role={role}&user={json.dumps(user)}"
    return RedirectResponse(url=redirect_url)