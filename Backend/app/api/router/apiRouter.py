from fastapi import APIRouter

from app.api.router.authRouter import authRouter

# from app.api.controllers.user.student import student_controller
# from app.api.controllers.user.teacher import teacher_controller


apiRouter = APIRouter()

apiRouter.include_router(authRouter, tags=["Auth"])
# user_router.include_router(student_controller, tags=["Student"])
# user_router.include_router(teacher_controller, tags=["Teacher"])
