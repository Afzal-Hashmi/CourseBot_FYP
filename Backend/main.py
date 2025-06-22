from fastapi import FastAPI, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from starlette.middleware.sessions import SessionMiddleware
# import asyncio
# from app.config.init_db import createTables

from app.config.connection import get_db

import uvicorn

from app.api.router.apiRouter import apiRouter

app = FastAPI()

origins = [  
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "localhost:5173",
    "localhost:5174",
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
    )
app.add_middleware(SessionMiddleware, secret_key="Afzal1234")
# @app.on_event("startup")
# async def on_startup():
#     await createTables()

app.include_router(apiRouter)

@app.get("/")
def index():
    return RedirectResponse(url= "http://localhost:5173/login", status_code=302)


if __name__ == "__main__":
    # Then start the server
    uvicorn.run(app, host="127.0.0.1", port=9090)
