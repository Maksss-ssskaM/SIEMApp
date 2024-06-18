import asyncio
from unittest.mock import MagicMock

from httpx import AsyncClient
from sqlalchemy import inspect, delete
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from core.security import password_hasher, create_access_token
from database.db_settings import DATABASE_URL
from database.models import Incident, Event
from dependencies.db import get_db
from fixtures.users import UserFactory
from fixtures.incidents import IncidentFactory
from fixtures.events import EventFactory

import pytest_asyncio

from main import app


@pytest_asyncio.fixture()
async def sa_session():
    engine = create_async_engine(DATABASE_URL)
    connection = await engine.connect()
    trans = await connection.begin()

    Session = sessionmaker(connection, expire_on_commit=False, class_=AsyncSession)
    session = Session()
    deletion = session.delete

    async def mock_delete(instance):
        insp = inspect(instance)
        if not insp.persistent:
            session.expunge(instance)
        else:
            await deletion(instance)

        return await asyncio.sleep(0)

    session.commit = MagicMock(side_effect=session.flush)
    session.delete = MagicMock(side_effect=mock_delete)

    try:
        yield session
    finally:
        await session.close()
        await trans.rollback()
        await connection.close()
        await engine.dispose()


@pytest_asyncio.fixture(autouse=True)
async def clear_incidents(sa_session: AsyncSession):
    await sa_session.execute(delete(Event))
    await sa_session.execute(delete(Incident))
    await sa_session.commit()


@pytest_asyncio.fixture(autouse=True)
def setup_factories(sa_session: AsyncSession) -> None:
    UserFactory.session = sa_session
    IncidentFactory.session = sa_session
    EventFactory.session = sa_session


@pytest_asyncio.fixture()
async def http_client(sa_session: AsyncSession):
    app.dependency_overrides[get_db] = lambda: sa_session
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest_asyncio.fixture()
async def auth_http_client(sa_session: AsyncSession):
    user = UserFactory.build(username="test")
    user.password = password_hasher.hash("test1234")
    sa_session.add(user)
    await sa_session.commit()

    access_token = create_access_token(data={"sub": user.user_id})

    app.dependency_overrides[get_db] = lambda: sa_session
    async with AsyncClient(app=app, base_url="http://test") as client:
        client.headers["Authorization"] = f"Bearer {access_token}"
        yield client
