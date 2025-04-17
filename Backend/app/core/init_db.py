from app.db.base import Base
from app.core.connection import engine  # your async engine
from app.models import *  # Automatically brings in all models


# Ensure you're using the correct async engine for async operations
async def create_tables():
    async with engine.begin() as conn:
        # Use run_sync to execute the sync operation inside an async context
        await conn.run_sync(Base.metadata.create_all)

