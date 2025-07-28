from pydantic import BaseModel, EmailStr, Field
from app.schemas.roleSchema import Role


class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=50)
    hashPassword: str | None = None
    salt: str | None = None
    roleId: Role | None = None
    profilePicture: str | None = None

    class Config:
        from_attributes = True


class UserSignupSchema(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=50)

    class Config:
        from_attributes = True

class UserSchema(BaseModel):
    id: int
    firstName: str
    lastName: str
    email: EmailStr
    roles: Role

    class Config:
        orm_mode = True


class UserLoginSchema(BaseModel):
    username: EmailStr
    password: str = Field(min_length=8, max_length=50)

class UserPasswordResetSchema(BaseModel):
    currentPassword: str
    newPassword: str