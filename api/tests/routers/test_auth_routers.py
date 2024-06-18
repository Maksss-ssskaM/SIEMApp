import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import password_hasher
from fixtures.users import UserFactory


@pytest.mark.asyncio
async def test_login(http_client, sa_session: AsyncSession):
    user = UserFactory.build()
    user.password = password_hasher.hash("test1234")
    sa_session.add(user)
    await sa_session.commit()

    login_data = {"username": user.username, "password": "test1234"}
    response = await http_client.post("/auth", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_refresh_token(http_client, sa_session: AsyncSession):
    user = UserFactory.build()
    user.password = password_hasher.hash("test1234")
    sa_session.add(user)
    await sa_session.commit()

    login_data = {"username": user.username, "password": "test1234"}
    response = await http_client.post("/auth", json=login_data)
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    refresh_data = {"refresh_token": tokens["refresh_token"]}
    refresh_response = await http_client.post("/auth/refresh", json=refresh_data)
    assert refresh_response.status_code == 200

    refreshed_token = refresh_response.json()
    assert "access_token" in refreshed_token
    