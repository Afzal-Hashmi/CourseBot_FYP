from sqlalchemy.ext.asyncio import AsyncSession
from app.services.userServices import createUser, loginUser
from app.schemas.userSchema import UserCreate, UserLoginSchema


async def signupUser(userData: UserCreate, db: AsyncSession, roleType: str):
    return await createUser(userData, db=db, role=roleType)


async def loginUserController(userData: UserLoginSchema):
    return await loginUser(userData)
