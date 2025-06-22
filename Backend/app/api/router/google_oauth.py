from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from jose import jwt
from jose.exceptions import JWTError
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Authlib OAuth configuration
config = Config(environ={
    'GOOGLE_CLIENT_ID': os.getenv('GOOGLE_CLIENT_ID'),
    'GOOGLE_CLIENT_SECRET': os.getenv('GOOGLE_CLIENT_SECRET'),
})
oauth = OAuth(config)
oauth.register(
    name='google',
    client_id= os.getenv('GOOGLE_CLIENT_ID'),
    client_secret= os.getenv('GOOGLE_CLIENT_SECRET'),
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
async def auth(request: Request):
    google = oauth.create_client('google')
    token = await google.authorize_access_token(request)
    userinfo = token['userinfo']
    user = {
        "email": userinfo.get("email"),
        "name": userinfo.get("name"),
        "picture": userinfo.get("picture"),
        "sub": userinfo.get("sub"),
    }
    return JSONResponse(user)