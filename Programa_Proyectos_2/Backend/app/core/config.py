from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    APP_NAME: str = 'EcoLogistica Lima API'
    DEBUG: bool = False
    API_V1_STR: str = '/api/v1'
    DATABASE_URL: str = ''
    CORS_ORIGINS: List[str] = ['http://localhost:5173', 'http://127.0.0.1:5173']
    PROJECT_NAME: str = 'EcoLogistica Lima API'

    class Config:
        env_file = '.env'
        case_sensitive = True

settings = Settings()

