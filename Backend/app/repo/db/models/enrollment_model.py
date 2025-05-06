from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.repo.db.base import Base
from datetime import datetime


class Enrollment(Base):
    __tablename__ = "enrollments"

    enrollment_id = Column(Integer, primary_key=True)
    enrollment_date = Column(DateTime, default=datetime.utcnow())

    student_id = Column(Integer, ForeignKey('users.id'))
    course_id = Column(Integer, ForeignKey('courses.course_id'))

    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
