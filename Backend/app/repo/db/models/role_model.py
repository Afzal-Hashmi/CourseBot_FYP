from sqlalchemy import Column, Integer, Enum
from sqlalchemy.orm import relationship
from app.repo.db.base import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    role = Column(Enum('teacher', 'student',name='roles_Enum'), nullable=False)
    users = relationship("User", back_populates="roles")
