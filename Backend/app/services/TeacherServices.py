from fastapi import Depends, HTTPException , status
from sqlalchemy.ext.asyncio import AsyncSession

from ..schemas.teacherSchema import course_schema
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
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting course students enrolled in the course")
    
    async def create_course_service(self,form_Data: course_schema, current_user:dict):
        try:
            response = await self.teacher_repo.create_course_repo(form_Data,current_user)
            if response:
                response = await self.fetch_courses_service(current_user)
                return response
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Course Not Created")
        except Exception as e:
            print(f"Error creating course: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error creating course") 

    async def edit_course_service(self, course_id: int, form_Data: dict, current_user: dict):
        try:
            response = await self.teacher_repo.edit_course_repo(course_id, form_Data, current_user)
            if response:
                response = await self.fetch_courses_service(current_user)
                return response
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course Not Found")
        except Exception as e:
            print(f"Error editing course: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error editing course")
    
    async def fetch_feedback_service(self, current_user: dict):
        try:
            response = await self.teacher_repo.fetch_feedback_repo(current_user)
            if not response:
                return []
            return response
        except Exception as e:
            print(f"Error fetching feedback: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching feedback")