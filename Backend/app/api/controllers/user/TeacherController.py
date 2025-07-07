import io
from PyPDF2 import PdfReader
from fastapi import APIRouter, HTTPException, UploadFile,status, Depends
from fastapi.responses import JSONResponse
from langchain_text_splitters import RecursiveCharacterTextSplitter

from ....schemas.teacherSchema import course_content_schema, course_schema
from ....services.TeacherServices import TeacherService
# from ....schemas.userSchema import CourseSchema
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

class TeacherController:
    def __init__(self,teacher_service: TeacherService = Depends(TeacherService)):
        self.teacher_service = teacher_service

    async def fetch_courses_controller(self, current_user: dict):
        try:
            if (current_user.get("roles") != "teacher"):
                return JSONResponse(
                    content={
                        "succeeded":False,
                        "message":"You are not a Teacher",
                        'data': [],
                        'httpStatusCode': status.HTTP_401_UNAUTHORIZED
                    },
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
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
                        'course_image': course.course_image,
                        'updated_at': str(course.updated_at),
                        'course_status': course.course_status}
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
                        'updated_at': str(course.updated_at),
                        }
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
                    "message": "Error deleting course Students enrolled in this course",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    async def create_course_controller(self, form_Data:course_schema, current_user:dict,file: UploadFile):
        try:
            if (current_user.get("roles") != "teacher"):
                return JSONResponse(
                    content={
                        "succeeded":False,
                        "message":"You are not a Teacher",
                        'data': [],
                        'httpStatusCode': status.HTTP_401_UNAUTHORIZED
                    },
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            # Upload the file to Cloudinary
            result = cloudinary.uploader.upload(file.file)
            url = result['secure_url']
            form_Data.course_image = url
            print("File uploaded to Cloudinary:", form_Data)
            response=await self.teacher_service.create_course_service(form_Data,current_user)
            if len(response) == 0 :
                return JSONResponse(
                    content={
                        "succeeded": False,
                        "message": "Course Not Created",
                        "data": [],
                        "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    }
                )
            reponse = [{'course_id':course.course_id,
                        'course_name':course.course_name,
                        'course_description': course.course_description,
                        'updated_at': str(course.updated_at),
                        'course_image': course.course_image,
                        'course_status': course.course_status}
                        for course in response]
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Course Created successfully",
                    "data": reponse,
                    "httpStatusCode": status.HTTP_200_OK,
                }
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
            print(f"Error creating course: {e}")
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Error creating course",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    async def upload_course_controller(self, form_data: course_content_schema, file: UploadFile):
        
        try:
            # result = cloudinary.uploader.upload(file.file)
            # url = result['secure_url']
            # print("File uploaded to Cloudinary:", result)

            # return {"image_url": url}

            # 1. Extract PDF text first
            pdf_bytes = await file.read()
            text = ""

            pdf_file = BytesIO(pdf_bytes)
            pdf = PdfReader(pdf_file)
        
            for page in pdf.pages:
                text += page.extract_text()

            if not text:
                raise HTTPException(
                    status_code=400,
                    detail='No text found in PDF'
                )

            # 2. Split into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=100,
                chunk_overlap=10
            )
            chunks = text_splitter.split_text(text)
            
            # Here you'd normally save them to your vector db
            # e.g.: vectordb.upsert(chunks)
            print(f"Number of chunks created: {chunks}")

            return JSONResponse(
                content={
                    "succeeded": True,
                    "msg": "PDF processed successfully.",
                    "course_id": chunks if chunks else None,
                    "number_of_chunks": len(chunks),
                    "httpStatusCode": 200,
                },
                status_code=200,
            )

        except HTTPException as e:
            return JSONResponse(
                content={
                    "succeeded": False,
                    "msg": e.detail,
                    "httpStatusCode": e.status_code,
                },
                status_code=e.status_code
            )
        except Exception as e:
            return JSONResponse(
                content={
                    "succeeded": False,
                    "msg": str(e),
                    "httpStatusCode": 500,
                },
                status_code=500
            )






    #     if (current_user.get("roles") != "teacher"):
    #         return JSONResponse(
    #             content={
    #                 "succeeded":False,
    #                 "message":"You are not a Teacher",
    #                 'data': [],
    #                 'httpStatusCode': status.HTTP_401_UNAUTHORIZED
    #             },
    #             status_code=status.HTTP_401_UNAUTHORIZED
    #         )
    #     response = await self.teacher_service.update_course_service(course_id, form_Data, current_user)
    #     if len(response) == 0:
    #         return JSONResponse(
    #             content={
    #                 "succeeded": False,
    #                 "message": "Course Not Updated",
    #                 "data": [],
    #                 "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             }
    #         )
    #     response = [{'course_id':course.course_id,
    #                 'course_name':course.course_name,
    #                 'course_description': course.course_description,
    #                 'updated_at': str(course.updated_at)}
    #                 for course in response]
    #     return JSONResponse(
    #         content={
    #             "succeeded": True,
    #             "message": "Course Updated successfully",
    #             "data": response,
    #             "httpStatusCode": status.HTTP_200_OK,
    #         }
    #     )
    # except HTTPException as e:
    #     return JSONResponse(
    #         content={
    #             "succeeded": False,
    #             "message": e.detail,
    #             "data": [],
    #             "httpStatusCode": e.status_code,
    #         },
    #         status_code=e.status_code,
    #     )
    # except Exception as e:
    #     print(f"Error updating course: {e}")
    #     return JSONResponse(
    #         content={
    #             "succeeded": False,
    #             "message": "Error updating course",
    #             "data": [],
    #             "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         },
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        # )

    async def edit_course_controller(self, course_id: int, form_Data: dict, current_user: dict):
        try:
            if (current_user.get("roles") != "teacher"):
                return JSONResponse(
                    content={
                        "succeeded":False,
                        "message":"You are not a Teacher",
                        'data': [],
                        'httpStatusCode': status.HTTP_401_UNAUTHORIZED
                    },
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            response = await self.teacher_service.edit_course_service(course_id, form_Data, current_user)
            if len(response) == 0:
                return JSONResponse(
                    content={
                        "succeeded": False,
                        "message": "Course Not Updated",
                        "data": [],
                        "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    }
                )
            response = [{'course_id':course.course_id,
                        'course_name':course.course_name,
                        'course_description': course.course_description,
                        'updated_at': str(course.updated_at),
                        'course_image': course.course_image,
                        'course_status': course.course_status}
                        for course in response]
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Course Updated successfully",
                    "data": response,
                    "httpStatusCode": status.HTTP_200_OK,
                }
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
            print(f"Error updating course: {e}")
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Error updating course",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    async def fetch_feedback_controller(self, current_user: dict):
        try:
            if (current_user.get("roles") != "teacher"):
                return JSONResponse(
                    content={
                        "succeeded":False,
                        "message":"You are not a Teacher",
                        'data': [],
                        'httpStatusCode': status.HTTP_401_UNAUTHORIZED
                    },
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            response = await self.teacher_service.fetch_feedback_service(current_user)
            if len(response) == 0:
                return JSONResponse(
                    content={
                        "succeeded": True,
                        "message": "No feedback available",
                        "data": [],
                        "httpStatusCode": status.HTTP_200_OK,
                    },
                    status_code=status.HTTP_200_OK,
                )
            for feedback in response:
                print(feedback.get('student_email'))
            response = [{
                        'course_name':feedback.get('course_name'),
                        'feedback': feedback.get('feedback_text'),
                        'rating': feedback.get('rating'),
                        'student_id': feedback.get('student_id'),
                        'student_name': feedback.get('student_name'),
                        'student_email': feedback.get('student_email'),
                        'student_profilePicture': feedback.get('student_profilePicture')
                        }
                        for feedback in response]
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Feedback fetched successfully",
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
            print(f"Error fetching feedback: {e}")
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Error fetching feedback",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    async def upload_content_controller(self, form_data: course_content_schema, file: UploadFile, current_user:dict):
        cloudinary_url = None
        cloudinary_public_id = None
        
        try:
            if not file:
                raise HTTPException(status_code=400, detail='No file uploaded')
            
            file_content = await file.read()
            if not file_content:
                raise HTTPException(status_code=400, detail='File is empty')
            
            print("Uploading file to Cloudinary...")
            result = cloudinary.uploader.upload(
                file_content,
                resource_type='auto', 
                public_id=form_data.content_title.strip().replace(" ", "_"),
            )
            cloudinary_url = result['secure_url']
            cloudinary_public_id = result.get('public_id')
            print("File uploaded to Cloudinary:", cloudinary_url)

            file.file = io.BytesIO(file_content)
            
            response = await self.teacher_service.upload_content_service(form_data, file, current_user, cloudinary_url)
            
            return response
            
        except HTTPException:
            # Cleanup Cloudinary on failure
            if cloudinary_public_id:
                try:
                    cloudinary.uploader.destroy(cloudinary_public_id)
                    print(f"Cleaned up Cloudinary file: {cloudinary_public_id}")
                except Exception as cleanup_error:
                    print(f"Failed to cleanup Cloudinary: {cleanup_error}")
            raise
        except Exception as e:
            # Cleanup Cloudinary on failure
            if cloudinary_public_id:
                try:
                    cloudinary.uploader.destroy(cloudinary_public_id)
                except:
                    pass
            print(f"Error uploading content: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error uploading content"
            )
    async def get_content_controller(self, content_id: int):
        try:
            response = await self.teacher_service.get_content_service(content_id)
            if not response:
                return JSONResponse(
                    content={
                        "succeeded": False,
                        "message": "Content not found",
                        "data": [],
                        "httpStatusCode": status.HTTP_404_NOT_FOUND,
                    },
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            
            response = [{
                'content_id': content.content_id,
                'content_title': content.title,
                'content_type': content.content_type,
                'content_url': content.content_url,
                'course_id': content.course_id,
            } for content in response]

            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Content fetched successfully",
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
            print(f"Error fetching content: {e}")
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Error fetching content",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    async def delete_content_controller(self,content_id:int, current_user:dict):
        try:
            response = await self.teacher_service.delete_content_service(content_id,current_user)
            print("controller",response)
            if not response:
                return JSONResponse(
                    content={
                        "succeeded": False,
                        "message": "Content not found",
                        "data": [],
                        "httpStatusCode": status.HTTP_404_NOT_FOUND,
                    },
                    status_code=status.HTTP_404_NOT_FOUND,
                )

            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Content Deleted successfully",
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
            print(f"Error Deleting content: {e}")
            return JSONResponse(
                content={
                    "succeeded": False,
                    "message": "Error Deleting content",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    async def save_chat_id(self,payload:str,chat_id:str,course_id:int,current_user:dict):
        await self.teacher_service.save_chat_id_service(payload,chat_id,course_id,current_user)
    
    async def get_chat_id(self,course_id:int,current_user:dict):
       chats = await self.teacher_service.get_chat_id_service(course_id,current_user)
       formatted_chats = []
       for chat in chats:
            formatted_chats.append({
                "chat_id": chat.chat_id,
                "title": chat.chat_title,
                "date": chat.created_at,
            })
            
       return {"chats": formatted_chats}
    async def get_students_controller(self, current_user: dict):
        try:
            response = await self.teacher_service.get_students_service(current_user)
            if len(response)==0:
                return JSONResponse(
                    content={
                        "succeeded": True,
                        "message": "No Enrollment found.",
                        "data": [],
                        "httpStatusCode": status.HTTP_200_OK,
                    },
                    status_code=status.HTTP_200_OK,
                )
            response = [{'student_firstname':student.User.firstName,
                        'course_name':student.Course.course_name,
                        'course_id':student.Course.course_id,
                        'student_lastname': student.User.lastName,
                        'student_email': student.User.email,
                        'enrollment_id':student.Enrollment.enrollment_id
                        }
                        for student in response]
            return JSONResponse(
                content={
                    "succeeded": True,
                    "message": "Students fetched successfully",
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
                    "message": "Error fetching Students enrolled in this course",
                    "data": [],
                    "httpStatusCode": status.HTTP_500_INTERNAL_SERVER_ERROR,
                },
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )