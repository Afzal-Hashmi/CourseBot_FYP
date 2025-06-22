from fastapi import HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete,insert

from .db.models import CourseFeedback
from .db.models import Course
from ..schemas.teacherSchema import course_schema
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
