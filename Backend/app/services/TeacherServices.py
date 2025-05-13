from fastapi import Depends, HTTPException , status
from sqlalchemy.ext.asyncio import AsyncSession
from ..config.connection import get_db
from ..repo.TeacherRepo import TeacherRepository

class TeacherService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.teacher_repo = TeacherRepository(db)

    async def fetch_courses_service(self, current_user: dict):
        # Simulate fetching courses from a database
        try:
            response = await self.teacher_repo.fetch_courses_repo(current_user)
            return response
        except Exception as e:
            print(f"Error fetching courses: {e}")
            raise HTTPException("Error fetching courses")
    async def delete_course_service(self,course_id:int, current_user:dict):
        try:
            response = await self.teacher_repo.delete_course_repo(course_id, current_user)
            if response:
                response = await self.teacher_repo.fetch_courses_repo(current_user)
                return response
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course Not Found")
        except Exception as e:
            print(f"Error deleting course: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting course")