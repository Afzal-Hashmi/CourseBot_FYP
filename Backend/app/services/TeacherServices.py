import datetime
import http
import json
import os
import uuid

import urllib
from fastapi import Depends, HTTPException , status, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from ..schemas.teacherSchema import course_content_schema, course_schema
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
        
    async def upload_content_service(self, form_data: course_content_schema, file: UploadFile, current_user: dict, url: str = None):
        db_record = None
        
        try:
            # Save to database first
            response = await self.teacher_repo.upload_content_repo(form_data, url)
            db_record = response

            # Read file content for Vectara
            file_content = await file.read()
            if not file_content:
                raise HTTPException(status_code=400, detail="File is empty")
            
            boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
            course_id = response.get("course_id")
            content_id = response.get("content_id")
            vectera_document_id= form_data.content_title + "-" + str(form_data.course_id)
            
            # Prepare metadata as JSON
            metadata = {
                "title": form_data.content_title,
                "type": form_data.content_type,
                "filename": vectera_document_id,
                "upload_date": datetime.datetime.now().isoformat(),
                "course_id": course_id,
                "content_id": content_id,
            }
            metadata_json = json.dumps(metadata)
            
            # Construct multipart body manually
            body = b''
            
            # Add metadata field with proper Content-Type
            body += (
                f'--{boundary}\r\n'
                f'Content-Disposition: form-data; name="metadata"\r\n'
                f'Content-Type: application/json\r\n\r\n'
            ).encode('utf-8')
            body += metadata_json.encode('utf-8')
            body += b'\r\n'
            
            # Add file field
            body += (
                f'--{boundary}\r\n'
                f'Content-Disposition: form-data; name="file"; filename="{vectera_document_id}"\r\n'
                f'Content-Type: {file.content_type}\r\n\r\n'
            ).encode('utf-8')
            body += file_content
            body += f'\r\n--{boundary}--\r\n'.encode('utf-8')
            
            conn = http.client.HTTPSConnection("api.vectara.io")
            
            headers = {
                'Content-Type': f'multipart/form-data; boundary={boundary}',
                'Accept': 'application/json',
                'x-api-key': os.getenv("VECTARA_API_KEY"),
            }
            
            conn.request("POST", "/v2/corpora/Tester/upload_file", body, headers)
            res = conn.getresponse()
            data = res.read()
            
            
            if res.status == 201:
                return {
                    "succeeded": True,
                    "message": "Content uploaded successfully",
                    "data": {
                        "filename": vectera_document_id,
                        "content_id": response.get("content_id"),
                        "course_id": response.get("course_id"),
                        "content_url": url,
                        "title": form_data.content_title,
                        "type": form_data.content_type
                    },
                    "httpStatusCode": status.HTTP_201_CREATED
                }
            else:
                raise HTTPException(status_code=400, detail=f"Vectara upload failed: {data.decode('utf-8')}")
                    
        except HTTPException:
            # Cleanup database record if Vectara fails
            if db_record and db_record.get("content_id"):
                try:
                    await self.teacher_repo.delete_content_repo(db_record.get("content_id"), current_user)
                except Exception as cleanup_error:
                    print(f"Failed to cleanup DB record: {cleanup_error}")
            raise
        except Exception as e:
            # Cleanup database record on any other failure
            if db_record and db_record.get("content_id"):
                try:
                    await self.teacher_repo.delete_content_repo(db_record.get("content_id"))
                except:
                    pass
            print(f"Upload error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    async def get_content_service(self, course_id: int):
        try:
            response = await self.teacher_repo.get_content_repo(course_id)
            if not response:
                return []
            return response
        except Exception as e:
            print(f"Error fetching content: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching content")
    async def delete_content_service(self, content_id: int, current_user:dict):
        try:
            response = await self.teacher_repo.delete_content_repo(content_id,current_user)
           
            if not response:
                return []
            return response
        except Exception as e:
            print(f"Error deleting content: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching content")
    async def save_chat_id_service(self,payload:str,chat_id:str,course_id:int,current_user:dict):
        await self.teacher_repo.save_chat_id_repo(payload,chat_id,course_id,current_user)
    async def get_chat_id_service(self,course_id:int,current_user:dict):
        return await self.teacher_repo.get_chat_id_repo(course_id,current_user)
    async def get_students_service(self,current_user:dict):
        return await self.teacher_repo.get_students_repo(current_user)


