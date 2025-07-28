# # import psycopg2
# # from dotenv import load_dotenv
# # from app.core.config import settings


# # def get_db_connection():
# #     """Establishes and returns a connection to the PostgreSQL database."""
# #     conn = psycopg2.connect(
# #         host=settings.PG_HOST,
# #         database=settings.PG_NAME,
# #         user=settings.PG_USER_NAME,
# #         password=settings.PG_PASSWORD,
# #         port=settings.PG_PORT

# #     )
# #     return conn


import os
from typing import AsyncGenerator
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from urllib.parse import urlparse

load_dotenv()

tmpPostgres = urlparse(os.getenv("DATABASE_URL"))

DATABASE_URL = (
    f"postgresql+asyncpg://{tmpPostgres.username}:{tmpPostgres.password}"
    f"@{tmpPostgres.hostname}{tmpPostgres.path}"
)

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


# def get_db_connection():
#     Engine = create_engine(os.getenv("DATABASE_URL"))
#     Session = sessionmaker(bind=Engine)
#     return Session


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session: 
        yield session
