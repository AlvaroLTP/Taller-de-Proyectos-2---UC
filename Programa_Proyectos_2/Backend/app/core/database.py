from functools import lru_cache
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy.engine import make_url
from sqlalchemy.exc import ArgumentError, IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import settings


def database_url(value):
    if not value:
        raise HTTPException(503, "Base de datos no configurada")
    try:
        url = make_url(value)
    except ArgumentError:
        raise HTTPException(503, "DATABASE_URL no tiene un formato válido") from None
    if url.host and (url.host.upper() == "HOST" or "YOUR_PROJECT" in url.host.upper()):
        raise HTTPException(
            503,
            "Complete DATABASE_URL con la conexión PostgreSQL real; todavía contiene valores de ejemplo",
        )
    if url.drivername in ("postgres", "postgresql"):
        url = url.set(drivername="postgresql+asyncpg")
    if url.drivername != "postgresql+asyncpg":
        raise HTTPException(503, "DATABASE_URL debe usar PostgreSQL con asyncpg")
    if "sslmode" in url.query:
        sslmode = url.query["sslmode"]
        url = url.difference_update_query(["sslmode"])
        if "ssl" not in url.query:
            url = url.update_query_dict({"ssl": sslmode})
    # Supabase's Prisma connection strings contain a flag asyncpg does not accept.
    url = url.difference_update_query(["pgbouncer"])
    return url


def create_database_engine(value):
    url = database_url(value)
    options = {"pool_pre_ping": True, "connect_args": {"timeout": 10}}
    if url.host and url.host.endswith(".pooler.supabase.com") and url.port == 6543:
        options["poolclass"] = NullPool
        options["connect_args"].update(
            {
                "statement_cache_size": 0,
                "prepared_statement_cache_size": 0,
                "prepared_statement_name_func": lambda: f"__eco_{uuid4().hex}__",
            }
        )
    return create_async_engine(url, **options)


@lru_cache
def session_factory():
    engine = create_database_engine(settings.DATABASE_URL)
    return async_sessionmaker(engine, expire_on_commit=False)


async def get_db():
    async with session_factory()() as session:
        try:
            yield session
        except IntegrityError:
            await session.rollback()
            raise HTTPException(
                409, "La operación incumple una restricción de datos"
            ) from None
        except (SQLAlchemyError, OSError, TimeoutError):
            await session.rollback()
            raise HTTPException(
                503,
                "No se pudo conectar con PostgreSQL. Revise DATABASE_URL y la disponibilidad de la base de datos",
            ) from None
        except Exception:
            await session.rollback()
            raise
