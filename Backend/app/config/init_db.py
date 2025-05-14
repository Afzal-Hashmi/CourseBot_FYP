from ..repo.db.base import Base
from .connection import engine
# from app.repo.db.models import *
import asyncio


# Ensure you're using the correct async engine for async operations
async def createTables():
    async with engine.begin() as conn:
        # Use run_sync to execute the sync operation inside an async context
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(createTables())