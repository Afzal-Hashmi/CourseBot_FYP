from fastapi import Form
from pydantic import BaseModel
from enum import Enum

class course_schema(BaseModel):
    course_name:str
    course_description:str

class ContentType(str, Enum):
    video = "video"
    pdf = "pdf"
    quiz = "quiz"

class course_content_schema(BaseModel):
    content_title: str
    course_type: ContentType

    @classmethod
    def as_form(
        cls,
        content_title: str = Form(...),
        course_type: ContentType = Form(...)
    ):
        return cls(
            content_title=content_title,
            course_type=course_type
        )