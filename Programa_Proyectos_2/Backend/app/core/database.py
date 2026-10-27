from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool
import os

class Base(DeclarativeBase):
    pass

DATABASE_URL = os.getenv('DATABASE_URL', '')

engine_options = {'poolclass': NullPool} if os.getenv('TEST_DATABASE_URL') else {}
engine = create_async_engine(DATABASE_URL, echo=False, future=True, **engine_options)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

