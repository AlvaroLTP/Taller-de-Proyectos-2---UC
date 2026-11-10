import pytest
from fastapi import HTTPException
from sqlalchemy.pool import NullPool

from app.core import database
from app.core.database import database_url


def test_standard_supabase_url_uses_asyncpg_and_converts_sslmode():
    url = database_url(
        "postgresql://postgres:test@db.example.invalid:5432/postgres?sslmode=require"
    )
    assert url.drivername == "postgresql+asyncpg"
    assert url.password == "test"
    assert url.query == {"ssl": "require"}


@pytest.mark.parametrize(
    "value",
    [
        "",
        "not-a-url",
        "postgresql+asyncpg://USER:PASSWORD@HOST:5432/postgres",
        "sqlite:///db.sqlite",
    ],
)
def test_invalid_database_configuration_is_a_clear_503(value):
    with pytest.raises(HTTPException) as error:
        database_url(value)
    assert error.value.status_code == 503
    assert "PASSWORD" not in error.value.detail


def test_encoded_password_and_explicit_ssl_are_preserved():
    url = database_url(
        "postgresql+asyncpg://postgres:p%40ss%23word@db.example.invalid/postgres?ssl=require"
    )
    assert url.password == "p@ss#word"
    assert url.query["ssl"] == "require"


def test_prisma_pooler_flag_is_not_forwarded_to_asyncpg():
    url = database_url(
        "postgresql://postgres:test@aws-0-example.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
    )
    assert url.query == {"ssl": "require"}


def test_transaction_pooler_avoids_statement_cache_and_name_collisions(monkeypatch):
    captured = {}

    def engine(url, **options):
        captured.update(options)
        return "test-engine"

    monkeypatch.setattr(database, "create_async_engine", engine)
    database.create_database_engine(
        "postgresql://postgres:test@aws-0-example.pooler.supabase.com:6543/postgres?pgbouncer=true"
    )
    assert captured["poolclass"] is NullPool
    args = captured["connect_args"]
    assert args["statement_cache_size"] == args["prepared_statement_cache_size"] == 0
    assert (
        args["prepared_statement_name_func"]() != args["prepared_statement_name_func"]()
    )
