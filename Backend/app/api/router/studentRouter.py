from fastapi import APIRouter, Depends,status
from fastapi.responses import JSONResponse

from ...schemas.teacherSchema import course_content_schema, course_schema
from ..controllers.user.StudentController import StudentController
from ...utils.auth import get_current_user


studentRouter = APIRouter()

@studentRouter.get("/student/fetchcourses")
async def fetch_courses_router(
    current_user: dict = Depends(get_current_user),
    student_controller: StudentController = Depends(StudentController)
):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded": False,
                'message': 'Authentication failed: Bearer <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            }
        )
    print("Current User: ", current_user)
    return await student_controller.fetch_courses_controller(current_user)