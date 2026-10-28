import asyncio
import os
from collections.abc import Iterator
from urllib.parse import urlsplit

import pytest
from sqlalchemy.ext.asyncio import create_async_engine


DEFAULT_TEST_DATABASE_URL = (
    'postgresql+asyncpg://ecologistica_test@127.0.0.1:55432/ecologistica_test'
)
TEST_DATABASE_URL = os.getenv('TEST_DATABASE_URL', DEFAULT_TEST_DATABASE_URL)


def _assert_isolated_database(url: str) -> None:
    parsed = urlsplit(url)
    database_name = parsed.path.lstrip('/')
    if parsed.hostname not in {'127.0.0.1', 'localhost'} or not database_name.endswith('_test'):
        raise RuntimeError(
            'Tests require a local database whose name ends in _test; '
            'refusing to modify a non-isolated database.'
        )


_assert_isolated_database(TEST_DATABASE_URL)
# app.core.database reads this variable while test modules are imported.
os.environ['DATABASE_URL'] = TEST_DATABASE_URL


@pytest.fixture(scope='session', autouse=True)
def isolated_database_schema() -> Iterator[None]:
    from app.models import client, driver, notification, order, parameter, route, vehicle  # noqa: F401
    from app.models.base import Base

    engine = create_async_engine(TEST_DATABASE_URL)

    async def reset_schema() -> None:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)
            await connection.run_sync(Base.metadata.create_all)

    async def dispose() -> None:
        await engine.dispose()

    asyncio.run(reset_schema())
    yield
    asyncio.run(dispose())
