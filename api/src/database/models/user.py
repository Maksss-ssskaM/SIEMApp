from datetime import datetime
from sqlalchemy import Column, BIGINT, VARCHAR, DateTime, String

from database.db_settings import Base


class User(Base):
    __tablename__ = 'users'
    user_id = Column(BIGINT, unique=True, primary_key=True)
    username = Column(String(255))
    created_at = Column(DateTime, default=datetime.now())
    password = Column(String(255), unique=True, nullable=True)
