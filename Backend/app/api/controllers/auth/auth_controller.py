from sqlalchemy.ext.asyncio import AsyncSession
from app.api.services.user_services import create_user
from app.schemas.user_schema import UserCreate

async def signup_user(user_Data:UserCreate,db:AsyncSession, role_type:str):
    """
    Signs up a new user in the database.

    Args:
        user_Data (UserCreate): The user data to be created.
        db (AsyncSession): The database session.
        role_type (str): The role type for the user.

    Returns:
        JSONResponse: A JSON response with a success status and a message indicating whether the user was created successfully or not.
    """
    return await create_user(user_Data,db=db, role_type=role_type)