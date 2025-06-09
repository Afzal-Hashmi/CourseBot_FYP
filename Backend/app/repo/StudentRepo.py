from fastapi import HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete,insert
from .db.models import Course,Enrollment
from ..schemas.teacherSchema import course_schema
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload

class StudentRepository:
    def __init__(self,db:AsyncSession):
        self.db=db
    async def fetch_courses_repo(self, current_user: dict):
        try:
            result = await self.db.execute(select(Course).options(selectinload(Course.teacher)))
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
            result= await self.db.execute(select(Course,Enrollment).join(Enrollment).where(Enrollment.student_id == current_user.get("id")).options(selectinload(Course.teacher), selectinload(Course.enrollments)))
            result = result.scalars().all()
            return result
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