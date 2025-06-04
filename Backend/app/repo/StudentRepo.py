from fastapi import HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete,insert
from .db.models import Course
from ..schemas.teacherSchema import course_schema
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload

class StudentRepository:
    def __init__(self,db:AsyncSession):
        self.db=db
    async def fetch_courses_repo(self, current_user: dict):
        try:
            result = await self.db.execute(select(Course).options(selectinload(Course.teacher)))
            print(f"Query executed successfully. Result: {result}")
            result = result.scalars().all()
            print(f"Fetched courses: {result}")
            return result
        except Exception as e:
            print(f"Error fetching courses: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching courses")
        