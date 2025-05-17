from pydantic import BaseModel

class course_schema(BaseModel):
    course_name:str
    course_description:str
    # status:str

