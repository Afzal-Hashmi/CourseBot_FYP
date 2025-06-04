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
            print(f"Fetched courses: {response}")
            return response
        except Exception as e:
            print(f"Error fetching courses: {e}")
            raise HTTPException("Error fetching courses")
