from fastapi import APIRouter, Depends,status
from fastapi.responses import JSONResponse

from ...schemas.teacherSchema import course_schema
from ..controllers.user.TeacherController import TeacherController
from ...utils.auth import get_current_user

teacherRouter = APIRouter()

@teacherRouter.get("/teacher/fetchcourses")
async def fetch_courses_router(current_user: dict= Depends(get_current_user), teacher_controller: TeacherController = Depends(TeacherController)):
    if not current_user:
        return JSONResponse(
            content = {
                "succeeded":False,
                'message': 'Authentication failed: Bearder <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            }
        )
    print("Current User: ", current_user)
    return await teacher_controller.fetch_courses_controller(current_user)

@teacherRouter.delete("/teacher/deletecourse/{course_id}")
async def delete_course_router(course_id: int, current_user: dict= Depends(get_current_user), teacher_controller: TeacherController = Depends(TeacherController)):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded":False,
                'message': 'Authentication failed: Bearer <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            }
        )
    return await teacher_controller.delete_course(course_id, current_user)

@teacherRouter.post('/teacher/createcourse')
async def create_course_router(form_Data:course_schema, current_user:dict =Depends(get_current_user), teacher_controller: TeacherController = Depends(TeacherController)):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded":False,
                'message': 'Authentication failed: Bearer <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            },
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    return await teacher_controller.create_course_controller(form_Data,current_user)