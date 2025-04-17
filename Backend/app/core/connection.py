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
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from urllib.parse import urlparse

load_dotenv()

# Parse the DATABASE_URL from environment variable
tmpPostgres = urlparse(os.getenv("DATABASE_URL"))

# Format for async SQLAlchemy URL
DATABASE_URL = (
    f"postgresql+asyncpg://{tmpPostgres.username}:{tmpPostgres.password}"
    f"@{tmpPostgres.hostname}{tmpPostgres.path}?ssl=require"
)

# Create an asynchronous SQLAlchemy engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Create a sessionmaker factory for async sessions
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Dependency function to get a DB session in routes
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:  # use async context manager
        yield session