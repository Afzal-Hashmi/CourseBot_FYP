from fastapi import Form
from pydantic import BaseModel
from enum import Enum

class course_schema(BaseModel):
    course_name:str
    course_description:str
    course_image:str = None

    @classmethod
    def as_form(
        cls,
        course_name: str = Form(...),
        course_description: str = Form(...)
    ):
        return cls(
            course_name=course_name,
            course_description=course_description
        )

class ContentType(str, Enum):
    video = "video"
    pdf = "pdf"
    quiz = "quiz"

class course_content_schema(BaseModel):
    content_title: str
    content_type: ContentType
    course_id: int

    @classmethod
    def as_form(
        cls,
        content_title: str = Form(...),
        content_type: ContentType = Form(...),
        course_id: int = Form(...)
    ):
        return cls(
            content_title=content_title,
            content_type=content_type,
            course_id=course_id
        )