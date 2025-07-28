from ..repo.db.base import Base
from .connection import engine
import asyncio


async def createTables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(createTables())