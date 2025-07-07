from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.repo.db.base import Base
from datetime import datetime


# class Course(Base):
#     __tablename__ = "courses"

#     course_id = Column(Integer, primary_key=True)
#     course_name = Column(String, nullable=False)
#     course_description = Column(String, nullable=False)
#     course_image = Column(String, nullable=True) 
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     course_status = Column(String, nullable=True, default='Draft') 
#     teacher_id = Column(Integer, ForeignKey('users.id'))

#     teacher = relationship("User", back_populates="courses")
#     course_content = relationship('CourseContent', back_populates='courses', cascade='all,delete-orphan')
#     enrollments = relationship("Enrollment", back_populates="courses", cascade='all,delete-orphan')
#     course_feedback = relationship("CourseFeedback", back_populates="courses", cascade='all,delete-orphan')
#     chatid = relationship("ChatId", back_populates="courses", cascade='all,delete-orphan')

class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True)
    course_name = Column(String, nullable=False)
    course_description = Column(String, nullable=False)
    course_image = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    course_status = Column(String, nullable=True, default='Draft')
    teacher_id = Column(Integer, ForeignKey('users.id'))

    teacher = relationship("User", back_populates="courses")
    course_content = relationship('CourseContent', back_populates='courses', cascade='all,delete-orphan')
    enrollments = relationship("Enrollment", back_populates="courses", cascade='all,delete-orphan')
    course_feedback = relationship("CourseFeedback", back_populates="courses", cascade='all,delete-orphan')
    chat_ids = relationship("ChatID", back_populates="courses", cascade='all,delete-orphan')