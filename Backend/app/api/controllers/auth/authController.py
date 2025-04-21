from sqlalchemy.ext.asyncio import AsyncSession
from app.services.userServices import createUser, loginUser
from app.schemas.userSchema import UserCreate, UserLoginSchema

async def signupUser(userData:UserCreate,db:AsyncSession, roleType:str):
    """
    Signs up a new user in the database.

    Args:
        user_Data (UserCreate): The user data to be created.
        db (AsyncSession): The database session.
        role_type (str): The role type for the user.

    Returns:
        JSONResponse: A JSON response with a success status and a message indicating whether the user was created successfully or not.
    """
    return createUser(userData,db=db, role_type=roleType)


async def loginUserController(userData: UserLoginSchema):
    return await loginUser(userData)