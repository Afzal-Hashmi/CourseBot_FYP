from fastapi import APIRouter
# Routers

from app.api.router.auth_router import auth_router
# from app.api.controllers.user.student import student_controller
# from app.api.controllers.user.teacher import teacher_controller


api_router= APIRouter()

api_router.include_router(auth_router,tags=['Auth'])
# user_router.include_router(student_controller, tags=["Student"])
# user_router.include_router(teacher_controller, tags=["Teacher"])