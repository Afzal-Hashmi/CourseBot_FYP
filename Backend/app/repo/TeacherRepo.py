import http
import os
import urllib
import cloudinary
from fastapi import HTTPException,status,UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete,insert

from .db.models import CourseFeedback
from .db.models import Course, CourseContent,ChatID,Enrollment,User
from ..schemas.teacherSchema import course_content_schema, course_schema
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload

class TeacherRepository:
    def __init__(self,db:AsyncSession):
        self.db=db
    async def fetch_courses_repo(self, current_user: dict):
        try:
            result = await self.db.execute(select(Course).filter(Course.teacher_id == current_user.get('id')))
            result = result.scalars().all()
            return result
        except Exception as e:
            print(f"Error fetching courses: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching courses")
        
    async def delete_course_repo(self, course_id:int , current_user:dict):
        result = await self.db.execute(delete(Course).where(Course.course_id == course_id, Course.teacher_id == current_user.get("id")))
        if result.rowcount == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Course Not Found")
        
        await self.db.commit()

        
        return result
    
    async def create_course_repo(self,form_Data: course_schema,current_user:dict):
        
        # result = await self.db.execute(insert(Course).values(form_Data))
        try:
            course = form_Data.model_dump()
            result = Course(**course ,course_status='Draft',teacher_id=current_user.get("id"))
            self.db.add(result)
            await self.db.commit()
            await self.db.refresh(result)
            return result
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error Creating Course")

        except Exception as e:
            print(f"Error Creating Course {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error Creating Course")
        
    async def edit_course_repo(self, course_id: int, form_Data: dict, current_user: dict):
        try:
            course = await self.db.execute(
                select(Course).where(
                    Course.course_id == course_id,
                    Course.teacher_id == current_user.get("id")
                )
            )
            course = course.scalar_one_or_none()

            if not course:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Course not found."
                )

            # Update only course_status if it's provided
            if "course_status" in form_Data:
                if form_Data["course_status"] == 'Draft':
                       course.course_status = 'Published'
                elif form_Data["course_status"] == 'Published':
                    course.course_status = 'Draft'
                else:
                    return
                # course.course_status = form_Data["course_status"]

            await self.db.commit()
            await self.db.refresh(course)
            return course

        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error while updating course."
            )
        except Exception as e:
            print(f"Error while updating course: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error while updating course."
            )

        try:
            course = await self.db.execute(select(Course).where(Course.course_id == course_id, Course.teacher_id == current_user.get("id")))
            course = course.scalar_one_or_none()
            if not course:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course Not Found")
            
            for key, value in form_Data.items():
                setattr(course, key, value)
            
            await self.db.commit()
            await self.db.refresh(course)
            return course
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error Editing Course")
        except Exception as e:
            print(f"Error Editing Course: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error Editing Course")
    async def fetch_feedback_repo(self, current_user: dict):
        try:
            result = await self.db.execute(
                select(Course)
                .where(Course.teacher_id == current_user.get("id"))
                .options(selectinload(Course.course_feedback).selectinload(CourseFeedback.student))
            )
            courses = result.scalars().all()
            feedbacks_with_course_info = []

            for course in courses:
                for feedback in course.course_feedback:
                    feedbacks_with_course_info.append({
                        "course_id": course.course_id,
                        "course_name": course.course_name,
                        "feedback_id": feedback.feedback_id,
                        "feedback_text": feedback.feedback_text,
                        "rating": feedback.rating,
                        "student_id": feedback.student_id,
                        "student_name": f"{feedback.student.firstName} {feedback.student.lastName}" if feedback.student else "Anonymous",
                        "student_email": feedback.student.email if feedback.student else "Anonymous",
                        "student_profilePicture": feedback.student.profilePicture if feedback.student else "Anonymous"
                    })
            return feedbacks_with_course_info

        except Exception as e:
            print(f"Error fetching feedback: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching feedback"
            )
    
    # async def upload_content_repo(self, form_data: course_content_schema, url: str = None):
    #     try:
    #         print("Repo")
    #         content = form_data.model_dump()
    #         print(content["course_id"]+"-"+content["content_id"])
    #         doc_id=content["course_id"]"-"content["content_id"]

    #         result = CourseContent(
    #             title=content["content_title"],
    #             content_type=content["content_type"], 
    #             content_url=url, 
    #             course_id=content["course_id"],
    #             vectera_document_id=doc_id
    #         )

    #         self.db.add(result)
    #         await self.db.commit()
    #         await self.db.refresh(result) 
    #         print("Done Repo")
    #         return {
    #             "content_id": result.content_id, 
    #             "title": result.title,
    #             "content_type": result.content_type,
    #             "content_url": result.content_url,
    #             "course_id": result.course_id,
    #         }

    async def upload_content_repo(self, form_data: course_content_schema, url: str = None):
        try:
            content = form_data.model_dump()
            vectara_id = content["content_title"]+"-"+str(content["course_id"])
            
            # Create record first
            result = CourseContent(
                title=content["content_title"],
                content_type=content["content_type"], 
                content_url=url, 
                course_id=content["course_id"],
                vectera_document_id=vectara_id

            )

            self.db.add(result)
            await self.db.commit()
            await self.db.refresh(result)
            
            return {
                "content_id": result.content_id, 
                "title": result.title,
                "content_type": result.content_type,
                "content_url": result.content_url,
                "course_id": result.course_id,
                "vectara_document_id": result.vectera_document_id
            }
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error Creating Course Content"
            )
    async def get_content_repo(self, course_id: int):
        try:
            result = await self.db.execute(
                select(CourseContent).where(CourseContent.course_id == course_id).options(selectinload(CourseContent.courses))
            )
            contents = result.scalars().all()
            return contents
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching course content"
            )
        except Exception as e:
            print(f"Error fetching course content: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching course content"
            )
    async def delete_content_repo(self, content_id: int, current_user: dict):
        try:
            # Execute the delete query
            response = await self.db.execute(select(CourseContent).where(CourseContent.content_id == content_id))
            result = await self.db.execute(
                delete(CourseContent).where(
                    CourseContent.content_id == content_id, 
                )
            )
            response = response.scalar_one_or_none()
            print(response.vectera_document_id)
            content_id=content_id
            conn = http.client.HTTPSConnection("api.vectara.io")
            payload = ''
            headers = {
            'x-api-key': os.getenv("VECTARA_API_KEY"),
            }
            # conn.request("DELETE", "/v2/corpora/Tester/documents/{content_id}", payload, headers)
            # res = conn.getresponse()
            # data = res.read()
            print(f"Deleting content {content_id} from Vectara...")
        
            # ✅ FIXED: Percent-encode the document_id as required by Vectara API
            document_id = str(response.vectera_document_id)
            encoded_document_id = urllib.parse.quote(document_id, safe='')
            
            # ✅ FIXED: Use proper corpus_key in URL structure
            corpus_key = "Tester"  # Your corpus key
            vectara_url = f"/v2/corpora/{corpus_key}/documents/{encoded_document_id}"
        
            conn.request("DELETE", vectara_url, payload, headers)
            res = conn.getresponse()
            data = res.read()
            print(data.decode("utf-8"))
            
            print(f"Delete result: {result}")
            print(f"Rows affected: {result.rowcount}")

            cloudinary.uploader.destroy(response.content_url)
            print(f"Cleaned up Cloudinary file: {response.content_url}")
            
            # Check if any rows were actually deleted
            if result.rowcount == 0:
                # No rows found - either content doesn't exist or user doesn't own it
                await self.db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Content not found or you don't have permission to delete it"
                )
            
            # IMPORTANT: Commit the transaction
            await self.db.commit()
            print("Transaction committed successfully")
            
            return {
                "rows_deleted": result.rowcount,
                "message": "Content deleted successfully"
            }
            
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except SQLAlchemyError as e:
            await self.db.rollback()
            print(f"Database error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error while deleting course content"
            )
        except Exception as e:
            await self.db.rollback()
            print(f"Error Deleting course content: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error deleting course content"
            )
    async def save_chat_id_repo(self, payload: str, chat_id: str, course_id: int, current_user: dict):
        try:
            result = ChatID(
                chat_title=payload,
                chat_id=chat_id,
                user_id=current_user.get('id'),
                course_id=course_id,
            )
            self.db.add(result)
            await self.db.commit()
            await self.db.refresh(result)
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error Creating Course Content"
            )
    async def get_chat_id_repo(self,course_id:int,current_user:dict):
        try:
            result = await self.db.execute(select(ChatID).where(ChatID.course_id==course_id, ChatID.user_id==current_user.get('id')))
            contents = result.scalars().all()
            return contents
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching course content"
            )
        except Exception as e:
            print(f"Error fetching course content: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching course content"
            )
    async def get_students_repo(self, current_user: dict):
        try:
            result = await self.db.execute(
                select(Course, User,Enrollment)
                .join(Enrollment, Enrollment.student_id == User.id)
                .join(Course, Enrollment.course_id == Course.course_id)
                .where(Course.teacher_id == current_user.get("id"))
            )

            result = result.all()  # ✅ keep (Course, User) tuples
            return result

        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching enrolled students"
            )
        except Exception as e:
            print(f"Error fetching enrolled students: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error fetching enrolled students"
            )
