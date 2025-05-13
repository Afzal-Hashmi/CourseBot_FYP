from fastapi import APIRouter, HTTPException,status, Depends
from fastapi.responses import JSONResponse
from ....services.TeacherServices import TeacherService
# from ....schemas.userSchema import CourseSchema


class TeacherController:
    def __init__(self,teacher_service: TeacherService = Depends(TeacherService)):
        self.teacher_service = teacher_service

    async def fetch_courses_controller(self, current_user: dict):
        try:
            response = await self.teacher_service.fetch_courses_service(current_user)
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
                # response = [course.dict() for course in [CourseSchema.model_validate(course) for course in response]]
                
            response = [{'course_id':course.course_id,
                        'course_name':course.course_name,
                        'course_description': course.course_description,
                        'updated_at': str(course.updated_at)}
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
    async def delete_course(self, course_id: int, current_user: dict):
        try:
            response = await self.teacher_service.delete_course_service(course_id,current_user)
                # response = [course.dict() for course in [CourseSchema.model_validate(course) for course in response]]
            if len(response)==0:
                return JSONResponse(
                    content={
                        "succeeded": False,
                        "message": "Course Deleted successfully. No more courses available",
                        "data": [],
                        "httpStatusCode": status.HTTP_200_OK,
                    },
                    status_code=status.HTTP_200_OK,
                )
            response = [{'course_id':course.course_id,
                        'course_name':course.course_name,
                        'course_description': course.course_description,
                        'updated_at': str(course.updated_at)}
                        for course in response]
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Course Deleted successfully",
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
            print(f"Error deleting course: {e}")
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Error deleting course",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )