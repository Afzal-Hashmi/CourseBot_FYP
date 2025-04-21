from fastapi import APIRouter,Depends,status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.connection import get_db
from app.schemas.userSchema import UserSchema,UserCreate, UserLoginSchema
from app.api.controllers.auth.authController import loginUserController, signupUser

authRouter = APIRouter()

# in this we can use our middlewares

@authRouter.post('/student-signup', response_model=UserSchema)
async def studentSignupRoute(userData:UserCreate , db: AsyncSession=Depends(get_db), roleType:str='student'):
    """
    Endpoint to handle student sign-up.

    Args:
        user_Data (UserCreate): The user data for creating a new student account.
        db (AsyncSession, optional): The database session dependency.
        role_type (str, optional): The role type for the user, defaults to 'student'.

    Returns:
        Userschema: The user schema of the newly created student.
    """

    return await signupUser(userData,db=db, roleType=roleType)


@authRouter.post('/teacher-signup', response_model=UserSchema)
async def teacherSignupRoute(userData:UserCreate , db: AsyncSession=Depends(get_db), roleType:str='teacher'):
    """
    Endpoint to handle teacher sign-up.

    Args:
        user_Data (UserCreate): The user data for creating a new teacher account.
        db (AsyncSession, optional): The database session dependency.
        role_type (str, optional): The role type for the user, defaults to 'teacher'.

    Returns:
        Userschema: The user schema of the newly created teacher.
    """
    
    return await signupUser(userData,db=db, roleType=roleType)



@authRouter.post('/login')
async def login(userData: UserLoginSchema):
    Response= await loginUserController(userData) 
    if Response:
        return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Data fetched successfully",
                    "data": Response,
                    "httpStatusCode": status.HTTP_200_OK,
                },
                status_code=status.HTTP_200_OK,
            )
    else:
        return JSONResponse(
            content={
                "succeeded": False,
                "message": str("User NOt Found"),
                "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )