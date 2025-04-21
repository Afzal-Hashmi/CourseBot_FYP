from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from sqlalchemy import select
from app.config.connection import get_db, get_db_connection
from app.repo.db.models.userModel import Role, User
from app.schemas.userSchema import UserCreate, UserLoginSchema, UserSchema
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload,joinedload

# from uti

async def getRoleId(role: str, db: AsyncSession) ->int|bool:
        role_result = await db.execute(select(Role.id).where(Role.role == role))
        return role_result.scalar_one_or_none()
    
async def createUserRepo(userData: UserCreate, db: AsyncSession):
    try:
        userDict= userData.model_dump(exclude={'password'})
        user = User(**userDict)
        db.add(user)
        await db.commit()
        await db.refresh(user)

        return True
     
    except Exception as e:
        print(f"Error while creating user: {e.args}")
        raise HTTPException(status_code=500, detail="Email already exists or other error.")
    


async def getUserByEmail(email: str):
    try:
        session = get_db_connection()
        db = session()
        # Query to get the user with their role (joinedload loads the role eagerly)
        result = db.execute(
            select(User).options(joinedload(User.roles)).where(User.email == email)
        )
        user = result.scalar_one_or_none()

        if user:
           return user
        else:
            print("User not found.")
            return None

    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return None

    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
    
    
     