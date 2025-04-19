from sqlalchemy import Column,Integer,String,Boolean,ForeignKey
from sqlalchemy.orm import relationship
from app.repo.db.base import Base

class User(Base):
    __tablename__ = "users"
    id= Column(Integer,primary_key=True)
    firstName = Column(String,nullable=False)
    lastName = Column(String,nullable=False)
    email = Column(String,unique=True,nullable=False,index=True)
    hashPassword = Column(String,nullable=False)
    salt = Column(String,nullable=False)
    roles = relationship("Role",back_populates="users")
    roleId = Column(Integer,ForeignKey("roles.id"))

    
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer,primary_key=True)
    role = Column(String,nullable=False)
    users = relationship("User",back_populates="roles")