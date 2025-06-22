from pydantic import BaseModel
from typing import Optional

class FeedbackBase(BaseModel):
    # course_id: int
    rating: int
    feedback: Optional[str] = None
    anonymous: bool
    user_id: Optional[int] = None


class FeedbackResponse(FeedbackBase):
    id: int
    user_id: Optional[int]

    class Config:
        orm_mode = True