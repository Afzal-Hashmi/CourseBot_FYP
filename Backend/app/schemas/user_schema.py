# use pydantic schemas for validation and serialization
from pydantic import BaseModel,EmailStr
from app.schemas.role_schema import Role

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    secret: str|None=None
    hashPassword: str|None=None
    salt: str|None=None
    roleId: Role|None=None
    class Config:
        orm_mode = True

class Userschema(BaseModel):
    id: int
    firstName: str
    lastName: str
    email: EmailStr
    role: Role

    class Config:
        orm_mode = True