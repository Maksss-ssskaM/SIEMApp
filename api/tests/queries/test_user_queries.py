import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import password_hasher
from database.query_service.user import get_user_by_username, get_user_by_id, update_password
from fixtures.users import UserFactory


@pytest.mark.asyncio
async def test_get_user_by_username(sa_session: AsyncSession):
    user = UserFactory.build()
    sa_session.add(user)
    await sa_session.commit()

    fetched_user = await get_user_by_username(db=sa_session, username=user.username)

    assert fetched_user
    assert fetched_user.username == user.username


@pytest.mark.asyncio
async def test_get_user_by_id(sa_session: AsyncSession):
    user = UserFactory.build()
    sa_session.add(user)
    await sa_session.commit()

    fetched_user = await get_user_by_id(db=sa_session, user_id=user.user_id)

    assert fetched_user
    assert fetched_user.user_id == user.user_id


@pytest.mark.asyncio
async def test_update_password(sa_session: AsyncSession):
    user = UserFactory.build()
    user.password = password_hasher.hash("old_password")
    sa_session.add(user)
    await sa_session.flush()

    new_password = "new_secure_password"
    update_result = await update_password(db=sa_session, user_id=user.user_id, new_password=new_password)

    await sa_session.commit()

    assert update_result is True

    updated_user = await get_user_by_id(db=sa_session, user_id=user.user_id)
    assert password_hasher.verify(updated_user.password, "new_secure_password")
