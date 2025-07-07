from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.repo.db.base import Base
from datetime import datetime


class ChatID(Base):
    __tablename__ = "chat_ids"

    id = Column(Integer, primary_key=True)
    chat_id = Column(String, nullable=False, unique=True)  # Added unique constraint
    chat_title = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)  # Added index
    course_id = Column(Integer, ForeignKey('courses.course_id'), index=True)  # Added index
    courses = relationship('Course', back_populates='chat_ids')
    userChat = relationship("User", back_populates="chat_ids")