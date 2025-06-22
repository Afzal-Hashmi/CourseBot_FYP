from fastapi import HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete,insert
from .db.models import Course,Enrollment,CourseFeedback
from ..schemas.teacherSchema import course_schema
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload

class StudentRepository:
    def __init__(self,db:AsyncSession):
        self.db=db
    async def fetch_courses_repo(self, current_user: dict):
        try:
            result = await self.db.execute(select(Course).options(selectinload(Course.teacher)).where(Course.course_status == 'Published'))
            result = result.scalars().all()
            return result
        except Exception as e:
            print(f"Error fetching courses: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching courses")
        
    async def enroll_course_repo(self,course_id:int,current_user:dict):
        try:
            course =await self.db.execute(insert(Enrollment).values(course_id=course_id, student_id=current_user.get("id")))
            await self.db.commit()

            return {"message": "Course enrolled successfully"}
        except SQLAlchemyError as e:
            print(f"Error enrolling in course: {e}")
            await self.db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error enrolling in course")
    async def fetch_enrolled_courses_repo(self,current_user:dict):
        try:
            result = await self.db.execute(
                select(Course, Enrollment)
                .join(Enrollment)
                .where(Enrollment.student_id == current_user.get("id"))
                .options(selectinload(Course.teacher))
            )
            return result.all()  # List of (Course, Enrollment)
            # return result
        except Exception as e:
            print(f"Error fetching enrolled courses: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching enrolled courses")
    async def unenroll_course_repo(self,enrollment_id:int,current_user:dict):
        try:
            result = await self.db.execute(delete(Enrollment).where(Enrollment.enrollment_id == enrollment_id, Enrollment.student_id == current_user.get("id")))
            await self.db.commit()
            if result.rowcount == 0:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enrollment not found")
            return {"message": "Unenrolled from course successfully"}
        except SQLAlchemyError as e:
            print(f"Error unenrolling from course: {e}")
            await self.db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error unenrolling from course")
    
    async def fetch_course_repo(self, course_id: int):
        try:
            result = await self.db.execute(
                select(Course).where(Course.course_id == course_id)
            )
            course = result.scalar_one_or_none()
            if not course:
                raise HTTPException(status_code=404, detail="Course not found")
            return course  # ✅ FastAPI will use Pydantic to serialize
        except SQLAlchemyError as e:
            print(f"Error fetching course: {e}")
            raise HTTPException(status_code=500, detail="Error fetching course")
        except Exception as e:
            print(f"Unexpected error: {e}")
            raise HTTPException(status_code=500, detail="Unexpected error occurred")

    async def submit_feedback_repo(self, course_id: int, feedback: dict, current_user: dict):
        try:
            new_feedback = CourseFeedback(
                course_id=course_id,
                student_id=feedback.user_id,
                feedback_text=feedback.feedback,
                rating=feedback.rating
            )
            self.db.add(new_feedback)
            await self.db.commit()
            return {"message": "Feedback submitted successfully"}

        except SQLAlchemyError as e:
            print(f"Error submitting feedback: {e}")
            await self.db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error submitting feedback")
        except Exception as e:
            print(f"Unexpected error: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected error occurred")