from fastapi import HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,delete,insert
from .db.models import Course
from ..schemas.teacherSchema import course_schema
from sqlalchemy.exc import SQLAlchemyError

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
            result = Course(**course,teacher_id=current_user.get("id"))
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
        
