from pydantic import BaseModel


class Role(BaseModel):
    id: int
    role: str

    class Config:
        orm_mode = True
