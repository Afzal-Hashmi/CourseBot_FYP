from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.repo.db.base import Base
from datetime import datetime


class CourseFeedback(Base):
    __tablename__ = "course_feedback"

    feedback_id = Column(Integer, primary_key=True)
    feedback_text = Column(String, nullable=False)

    student_id = Column(Integer, ForeignKey('users.id'))
    course_id = Column(Integer, ForeignKey('courses.course_id'))

    student = relationship("User", back_populates="course_feedback")
    course = relationship("Course", back_populates="course_feedback")
