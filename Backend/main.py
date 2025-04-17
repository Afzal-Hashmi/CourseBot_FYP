from fastapi import FastAPI, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import asyncio
from app.core.init_db import create_tables

from app.core.connection import get_db

import uvicorn

from app.api.router.user_router import user_router

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
    )

@app.on_event("startup")
async def on_startup():
    await create_tables()

app.include_router(user_router, prefix="/api")

@app.get("/")
def index():
    return RedirectResponse(url= "http://localhost:5173/login", status_code=302)
# @app.get("/")
# def index():
#     return RedirectResponse(url= "http://localhost:5173/login", status_code=302)


@app.get("/ping-db")
async def ping_db(session: AsyncSession = Depends(get_db)):
    result = await session.execute(text("SELECT * from user"))
    return {"message": result.scalar_one()}



if __name__ == "__main__":
       # First create tables
    # asyncio.run(create_tables())

    # Then start the server
    uvicorn.run("app.main:app", host="127.0.0.1", port=9090, reload=True)
