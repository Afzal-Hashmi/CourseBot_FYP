from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.repo.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    firstName = Column(String, nullable=False)
    lastName = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashPassword = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    roleId = Column(Integer, ForeignKey("roles.id"))

    roles = relationship("Role", back_populates="users")
    courses = relationship("Course", back_populates="teacher", cascade='all,delete-orphan')
    enrollments = relationship("Enrollment", back_populates="student", cascade='all,delete-orphan')
    course_feedback = relationship("CourseFeedback", back_populates="student")
