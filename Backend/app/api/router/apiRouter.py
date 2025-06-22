from fastapi import APIRouter

from .authRouter import authRouter
from .teacherRouter import teacherRouter
from .studentRouter import studentRouter
from .google_oauth import router as google_oauth_router


apiRouter = APIRouter()

apiRouter.include_router(authRouter, tags=["Auth"])
apiRouter.include_router(teacherRouter, tags=["Teacher"])
apiRouter.include_router(studentRouter, tags=["Student"])
apiRouter.include_router(google_oauth_router, tags=["Google OAuth"])