from fastapi import HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.security import password_hasher
from database.models import User


async def get_user_by_username(db: AsyncSession, username: str) -> User:
    query = select(User).where(User.username == username).limit(1)
    result = await db.execute(query)

    return result.scalar()


async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
    query = select(User).where(User.user_id == user_id).limit(1)
    result = await db.execute(query)

    return result.scalar()


async def update_password(db: AsyncSession, user_id: int, new_password: str):
    hashed_new_pass = password_hasher.hash(new_password)

    try:
        query = update(User).where(User.user_id == user_id).values(password=hashed_new_pass)
        await db.execute(query)
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Ошибка при обновлении пароля") from e
