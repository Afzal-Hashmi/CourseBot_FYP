from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
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
    courses = relationship("Course", back_populates="enrollments")

    __table_args__ = (
        UniqueConstraint('student_id', 'course_id', name='uq_student_course'),
    )