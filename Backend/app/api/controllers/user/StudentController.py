import traceback
from fastapi import APIRouter, HTTPException, UploadFile,status, Depends
from fastapi.responses import JSONResponse

from ....schemas.teacherSchema import course_schema
from ....services.StudentServices import StudentService
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
load_dotenv()

# Configure with your credentials
cloudinary.config(
  cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
  api_key=os.getenv('CLOUDINARY_API_KEY'),
  api_secret=os.getenv('CLOUDINARY_API_SECRET'),
)

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
                        'teacher_profile_picture': course.teacher.profilePicture if course.teacher.profilePicture else None,
                        'course_image': course.course_image if course.course_image else None,
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

            if len(response) == 0:
                return JSONResponse(
                    content={
                        "succeeded": True,
                        "message": "No enrolled courses",
                        "data": [],
                        "httpStatusCode": status.HTTP_200_OK,
                    },
                    status_code=status.HTTP_200_OK
                )

            formatted_response = [
                {
                    "course_id": course.course_id,
                    "course_name": course.course_name,
                    "course_description": course.course_description,
                    "teacher_name": f"{course.teacher.firstName} {course.teacher.lastName}",
                    "teacher_email": course.teacher.email,
                    "enrolled_at": str(enrollment.enrollment_date),
                    "enrollment_id": enrollment.enrollment_id,
                    "course_image": course.course_image,
                }
                for course, enrollment in response
            ]

            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Courses fetched successfully",
                    "data": formatted_response,
                    "httpStatusCode": status.HTTP_200_OK,
                },
                status_code=status.HTTP_200_OK
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
    async def update_profile_controller(self, file: UploadFile, form_Data: dict, current_user: dict):
        try:
            print("STEP 1: Check role:", current_user.get("roles"))
            if current_user.get("roles") != "student":
                print("STEP 2: User is not student")
                return JSONResponse(
                    content={
                        "succeeded": False,
                        "message": "You are not a student",
                        "data": [],
                        "httpStatusCode": status.HTTP_401_UNAUTHORIZED
                    },
                    status_code=status.HTTP_401_UNAUTHORIZED
                )

            print("STEP 3: Handling file...")
            try:
                print("STEP 3.1: Uploading file to Cloudinary...")
                upload_result = cloudinary.uploader.upload(file.file)
                print(upload_result['secure_url'])
                form_Data["profile_picture"] = upload_result['secure_url']
                print("STEP 3.2: Upload success:", form_Data["profile_picture"])
            except Exception as upload_error:
                print("Upload error:", str(upload_error))
                raise HTTPException(
                    status_code=500,
                    detail="Failed to upload profile image"
                )
            print("STEP 4: No file uploaded")

            print("STEP 5: Form data complete:", form_Data)

            # You can replace this with your actual service call
            # response = await self.student_service.update_profile_service(form_Data, current_user)

            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Debug: Profile updated successfully",
                    "data": form_Data,
                    "httpStatusCode": status.HTTP_200_OK,
                },
                status_code=status.HTTP_200_OK,
            )

        except HTTPException as e:
            print("HTTPException:", e.detail)
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
            print("Unexpected error:", str(e))
            traceback.print_exc()
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Unexpected server error: " + str(e),
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    async def fetch_course_controller(self, course_id: int):
        try:
            # if (current_user.get("roles") != "student"):
            #     return JSONResponse(
            #         content={
            #             "succeeded":False,
            #             "message":"You are not a student",
            #             'data': [],
            #             'httpStatusCode': status.HTTP_401_UNAUTHORIZED
            #         },
            #         status_code=status.HTTP_401_UNAUTHORIZED
            #     )
            response = await self.student_service.fetch_course_service(course_id)

            

            if not response:
                return JSONResponse(
                    content={
                        "succeeded": False,
                        "message": "Course not found",
                        "data": [],
                        "httpStatusCode": status.HTTP_404_NOT_FOUND,
                    },
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            
            course_data = {
                'course_id': response.course_id,
                'course_name': response.course_name,
                'course_description': response.course_description,
                'course_status': response.course_status,
                'updated_at': str(response.updated_at),
                # 'teacher_name': response.teacher.firstName + " " + response.teacher.lastName if response.teacher else "Unknown",
                # 'teacher_email': response.teacher.email if response.teacher else "Unknown",
                'course_image': response.course_image if response.course_image else None,
            }
            print(f"Course data prepared: {course_data}")
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Data fetched successfully",
                    "data": course_data,
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
                    "message": "Error fetching course",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code= status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    async def submit_feedback_controller(self, course_id: int, feedback_data: dict, current_user: dict):
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
            response = await self.student_service.submit_feedback_service(course_id, feedback_data, current_user)
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
                    "message": "Error submitting feedback",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code= status.HTTP_500_INTERNAL_SERVER_ERROR
            )