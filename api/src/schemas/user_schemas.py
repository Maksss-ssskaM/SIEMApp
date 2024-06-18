from datetime import datetime

from pydantic import BaseModel


class UserDataResponse(BaseModel):
    user_id: int
    username: str
    created_at: datetime


class PasswordChangeSchema(BaseModel):
    old_password: str
    new_password: str
