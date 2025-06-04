from fastapi import APIRouter

from .authRouter import authRouter
from .teacherRouter import teacherRouter
from .studentRouter import studentRouter


apiRouter = APIRouter()

apiRouter.include_router(authRouter, tags=["Auth"])
apiRouter.include_router(teacherRouter, tags=["Teacher"])
apiRouter.include_router(studentRouter, tags=["Student"])