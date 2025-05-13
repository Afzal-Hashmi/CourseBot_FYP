from fastapi import HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete
from .db.models import Course

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