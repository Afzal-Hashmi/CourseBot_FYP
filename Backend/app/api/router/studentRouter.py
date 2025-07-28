from typing import Optional
from fastapi import APIRouter, Depends, HTTPException,status, File, UploadFile,Form
from fastapi.responses import JSONResponse

from ...schemas.feedbackSchema import FeedbackBase
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
    return await student_controller.fetch_courses_controller(current_user)

@studentRouter.post("/student/enrollcourse/{course_id}")
async def enroll_course_router(course_id:int, current_user: dict = Depends(get_current_user), student_controller: StudentController = Depends(StudentController)):
    if not current_user:
        return JSONResponse(
            content={
                "succeeded": False,
                'message': 'Authentication failed: Bearer <token> not found',
                'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            }
        )
    return await student_controller.enroll_course_controller(course_id, current_user)
@studentRouter.get("/student/fetchenrolledcourses")
async def fetch_enrolled_courses_router(
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
    return await student_controller.fetch_enrolled_courses_controller(current_user)
@studentRouter.delete("/student/unenrollcourse/{enrollment_id}")
async def unenroll_course_router(
    enrollment_id: int,
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
    return await student_controller.unenroll_course_controller(enrollment_id, current_user)

@studentRouter.get("/student/fetchCourse/{course_id}")
async def fetch_course_router(
    course_id: int,
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
    return await student_controller.fetch_course_controller(course_id,current_user)

@studentRouter.post("/student/feedback/{course_id}")
async def submit_feedback(
    course_id: int,
    feedback_data: FeedbackBase,
    current_user: dict = Depends(get_current_user),
    student_controller: StudentController = Depends(StudentController)
):
    if not 1 <= feedback_data.rating <= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    if feedback_data.anonymous:
        feedback_data.user_id = None
    return await student_controller.submit_feedback_controller(
        course_id=course_id, feedback_data=feedback_data, current_user=current_user
    )