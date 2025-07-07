from datetime import datetime
from sqlalchemy import CheckConstraint, Column, DateTime, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_utils import URLType
from ..base import Base


class CourseContent(Base):
    __tablename__ = 'course_content'

    content_id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    content_type = Column(Enum('video', 'pdf', 'txt', 'ppt', name='content_type_enum'), nullable=False)
    content_url = Column(String, nullable=False)
    vectera_document_id = Column(String,nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # Replace the URLType with String and add a simple check constraint for URL format
    # content_url = Column(String, nullable=False, 
    #                      CheckConstraint('content_url LIKE "http%" OR content_url LIKE "https%"'))
    course_id = Column(Integer, ForeignKey('courses.course_id'))
    courses = relationship('Course', back_populates='course_content')