from logging.config import fileConfig
from urllib.parse import urlparse

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context
import os
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv
import asyncio
from sqlalchemy.ext.asyncio import AsyncEngine
from alembic import context
from app.repo.db.base import Base  # Import your Base
from app.repo.db.models import *   # Import your models
from app.config.connection import engine  # Import your engine
load_dotenv()
# Set the target metadata for Alembic to use migrations
target_metadata = Base.metadata

# def run_migrations_online():
#     """Run migrations in 'online' mode."""
#     connectable = engine  # ✅ Use engine directly, no need to wrap with AsyncEngine

#     async def run_async_migrations():
#         async with connectable.connect() as connection:
#             # Configure the connection with the target metadata
#             await connection.run_sync(
#                 lambda conn: context.configure(
#                     connection=conn,
#                     target_metadata=target_metadata
#                 )
#             )
#             await connection.run_sync(context.run_migrations)

#     # Run the async migration logic
#     asyncio.run(run_async_migrations())

# tmpPostgres = urlparse(os.getenv("DATABASE_URL"))

# # Format for async SQLAlchemy URL
# DATABASE_URL = (
#     f"postgresql+asyncpg://{tmpPostgres.username}:{tmpPostgres.password}"
#     f"@{tmpPostgres.hostname}{tmpPostgres.path}"
# )

# def run_migrations_online():
#     # Load the database URL from the environment variable
#     # config.set_main_option('sqlalchemy.url', os.getenv("DATABASE_URL"))

#     # Create the engine
#     connectable = create_async_engine(config.get_main_option(DATABASE_URL), echo=True)

#     async def run_async_migrations():
#         async with connectable.connect() as connection:
#             await connection.run_sync(context.configure)
#             await connection.run_sync(context.run_migrations)

#     asyncio.run(run_async_migrations())

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

def get_url():
   return os.getenv("DATABASE_URL")

config.set_main_option(
    'sqlalchemy.url',
    os.getenv("DATABASE_URL"))

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("DATABASE_URL")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
