from fastapi import Depends, HTTPException , status
from sqlalchemy.ext.asyncio import AsyncSession

from ..config.connection import get_db
from ..repo.StudentRepo import StudentRepository

class StudentService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.student_repo = StudentRepository(db)

    async def fetch_courses_service(self, current_user: dict):

        try:
            response = await self.student_repo.fetch_courses_repo(current_user)
            if not response:
                return []
            return response
        except Exception as e:
            print(f"Error fetching courses: {e}")
            raise HTTPException("Error fetching courses")

    async def enroll_course_service(self,course_id:int, current_user:dict):
        try:
            response = await self.student_repo.enroll_course_repo(course_id, current_user)
            return response
        except Exception as e:
            print(f"Error enrolling in course: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error enrolling in course")
    async def fetch_enrolled_courses_service(self, current_user: dict):
        try:
            response = await self.student_repo.fetch_enrolled_courses_repo(current_user)
            if not response:
                return []
            return response
        except Exception as e:
            print(f"Error fetching enrolled courses: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching enrolled courses")
    async def unenroll_course_service(self, enrollment_id: int, current_user: dict):
        try:
            response = await self.student_repo.unenroll_course_repo( enrollment_id, current_user)
            return response
        except Exception as e:
            print(f"Error unenrolling from course: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error unenrolling from course")