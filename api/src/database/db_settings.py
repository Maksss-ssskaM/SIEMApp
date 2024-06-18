from asyncio import current_task

from sqlalchemy.ext.asyncio import create_async_engine, async_scoped_session, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from core.config import load_config

config = load_config()

DATABASE_URL = f'postgresql+asyncpg://' \
               f'{config.db.db_user}:' \
               f'{config.db.db_pass}@' \
               f'{config.db.db_host}:' \
               f'{config.db.db_port}/' \
               f'{config.db.db_name}'

engine = create_async_engine(DATABASE_URL)

SessionLocal = async_scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession),
    scopefunc=current_task
)

Base = declarative_base()
