from fastapi import APIRouter,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.connection import get_db
from app.schemas.user_schema import Userschema,UserCreate
from app.api.controllers.auth.auth_controller import signup_user

auth_router = APIRouter()

# in this we can use our middlewares

@auth_router.post('/student-signup', response_model=Userschema)
async def student_signup_route(user_Data:UserCreate , db: AsyncSession=Depends(get_db), role_type:str='student'):
    """
    Endpoint to handle student sign-up.

    Args:
        user_Data (UserCreate): The user data for creating a new student account.
        db (AsyncSession, optional): The database session dependency.
        role_type (str, optional): The role type for the user, defaults to 'student'.

    Returns:
        Userschema: The user schema of the newly created student.
    """

    return await signup_user(user_Data,db=db, role_type=role_type)


@auth_router.post('/teacher-signup', response_model=Userschema)
async def teacher_signup_route(user_Data:UserCreate , db: AsyncSession=Depends(get_db), role_type:str='teacher'):
    """
    Endpoint to handle teacher sign-up.

    Args:
        user_Data (UserCreate): The user data for creating a new teacher account.
        db (AsyncSession, optional): The database session dependency.
        role_type (str, optional): The role type for the user, defaults to 'teacher'.

    Returns:
        Userschema: The user schema of the newly created teacher.
    """
    
    return await signup_user(user_Data,db=db, role_type=role_type)