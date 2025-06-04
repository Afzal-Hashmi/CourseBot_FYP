from fastapi import APIRouter, HTTPException,status, Depends
from fastapi.responses import JSONResponse

from ....schemas.teacherSchema import course_schema
from ....services.StudentServices import StudentService


class StudentController:
    def __init__(self,student_service: StudentService = Depends(StudentService)):
        self.student_service = student_service

    async def fetch_courses_controller(self, current_user: dict):
        try:
            if (current_user.get("roles") != "student"):
                return JSONResponse(
                    content={
                        "succeeded":False,
                        "message":"You are not a student",
                        'data': [],
                        'httpStatusCode': status.HTTP_401_UNAUTHORIZED
                    },
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            response = await self.student_service.fetch_courses_service(current_user)
            if len(response)==0:
                return JSONResponse(
                    content = {
                        "succeeded": True,
                        'message': 'No courses available',
                        'data': [],
                        'httpStatusCode': status.HTTP_200_OK
                    },
                    status_code=status.HTTP_200_OK
                )
                
            response = [{'course_id':course.course_id,
                        'course_name':course.course_name,
                        'course_description': course.course_description,
                        'updated_at': str(course.updated_at),
                        'teacher_id': course.teacher_id,
                        'teacher_name': course.teacher.firstName + " "+ course.teacher.lastName,
                        }
                        for course in response]
            
            return JSONResponse(
                    content={
                        "succeeded": True,
                        "message": "Data fetched successfully",
                        "data": response,
                        "httpStatusCode": status.HTTP_200_OK,
                    },
                    status_code=status.HTTP_200_OK,
                )
        except HTTPException as e:
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": e.detail,
                    "data": [],
                    "httpStatusCode": e.status_code,
                },
                status_code=e.status_code,
            )
        except Exception as e:
            return JSONResponse(
                content={
                    "succeeded":False,
                    "message": "Error fetching courses",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code= status.HTTP_500_INTERNAL_SERVER_ERROR
            )
