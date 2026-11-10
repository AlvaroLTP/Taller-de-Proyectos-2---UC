from pathlib import Path
from typing import Annotated

from pydantic import BeforeValidator, Field
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


def parse_origins(value):
    if isinstance(value, str):
        import json

        return (
            json.loads(value)
            if value.lstrip().startswith("[")
            else [x.strip() for x in value.split(",") if x.strip()]
        )
    return value


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env",
        case_sensitive=True,
        extra="ignore",
    )
    APP_NAME: str = "EcoLogistica Lima API"
    DEBUG: bool = Field(default=False, validation_alias="ECOLOGISTICA_DEBUG")
    DATABASE_URL: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    CORS_ORIGINS: Annotated[list[str], NoDecode, BeforeValidator(parse_origins)] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]


settings = Settings()
