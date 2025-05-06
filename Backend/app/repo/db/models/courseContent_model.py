from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_utils import URLType
from ..base import Base


class CourseContent(Base):
    __tablename__ = 'course_content'

    content_id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    content_type = Column(Enum('video', 'pdf', 'txt', 'ppt',name='content_type_enum'), nullable=False)
    content_url = Column(URLType, nullable=False)
    course_id = Column(Integer, ForeignKey('courses.course_id'))
    course = relationship('Course', back_populates='course_content')
