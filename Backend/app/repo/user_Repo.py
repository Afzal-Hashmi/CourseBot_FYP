from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException
from sqlalchemy import select
from app.repo.db.models.user_model import Role, User
from app.schemas.user_schema import UserCreate

async def get_roleId(findRole: str, db: AsyncSession) ->int|bool:
        
        """
        Gets the role ID by the given role name. If the role does not exist, creates
        it and returns the ID of the newly created role.

        :param findRole: The role name to search.
        :type findRole: str
        :param db: The database session.
        :type db: sqlalchemy.ext.asyncio.AsyncSession
        :return: The role ID if found, False otherwise.
        :rtype: int or bool
        """

        role_result = await db.execute(select(Role.id).where(Role.role == findRole))
        role = role_result.scalar_one_or_none()
        if not role:
            role = Role(role=findRole)
            db.add(role)
            await db.commit()
            await db.refresh(role)
            return role.id

        return role

async def create_user_repo(user_Data: UserCreate, db: AsyncSession):
    """
    Creates a new user in the database.

    Args:
        user_Data (UserCreate): The user data to be created.
        db (AsyncSession): The database session.

    Returns:
        bool: True if the user was created successfully, False otherwise.
    """
    try:
        user_Dict= user_Data.model_dump(exclude={'password'})
        user = User(**user_Dict)
        db.add(user)
        await db.commit()
        await db.refresh(user)

        return True
     
    except Exception as e:
        print(f"Error while creating user: {e.args}")
        raise HTTPException(status_code=500, detail="Email already exists or other error.")