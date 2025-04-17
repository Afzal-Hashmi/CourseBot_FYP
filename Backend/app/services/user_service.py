from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from sqlalchemy import select
from app.db.models.user_model import Role
from app.core.connection import get_db

async def get_roleId(findRole: str, db: AsyncSession = Depends(get_db)) ->int|bool:
        
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

        if role:
            return role or role.id
        else:
            return False