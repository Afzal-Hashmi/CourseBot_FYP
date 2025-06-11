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
                        'teacher_email': course.teacher.email,
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
    async def enroll_course_controller(self, course_id: int, current_user: dict):
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
            response = await self.student_service.enroll_course_service(course_id, current_user)
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": response.get("message"),
                    "data": [],
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
                    "message": "Error enrolling in course",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code= status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    async def fetch_enrolled_courses_controller(self, current_user: dict):
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
            response = await self.student_service.fetch_enrolled_courses_service(current_user)
            if len(response)==0:
                return JSONResponse(
                    content = {
                        "succeeded": True,
                        'message': 'No enrolled courses',
                        'data': [],
                        'httpStatusCode': status.HTTP_200_OK
                    },
                    status_code=status.HTTP_200_OK
                )
            response = [{'course_id':course.course_id,
                        'course_name':course.course_name,
                        'course_description': course.course_description,
                        'teacher_name': course.teacher.firstName + " "+ course.teacher.lastName,
                        'teacher_email': course.teacher.email,
                        'enrolled_at': str(course.enrollments[0].enrollment_date) if course.enrollments else None,
                        'enrollment_id': course.enrollments[0].enrollment_id if course.enrollments else None,
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
                    "message": "Error fetching enrolled courses",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code= status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    async def unenroll_course_controller(self, enrollment_id: int, current_user: dict):
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
            response = await self.student_service.unenroll_course_service(enrollment_id, current_user)
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": response.get("message"),
                    "data": [],
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
                    "message": "Error unenrolling from course",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code= status.HTTP_500_INTERNAL_SERVER_ERROR
            )