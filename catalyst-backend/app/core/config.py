"""Pengaturan aplikasi dari file .env."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings utama aplikasi Catalyst POC."""

    DATABASE_URL: str = "mysql+pymysql://root:password@127.0.0.1:3306/catalyst_db"
    DATABASE_FALLBACK_URL: str = "sqlite:///./catalyst_poc.db"
    ENABLE_DATABASE_FALLBACK: bool = True
    APP_NAME: str = "Catalyst Backend"
    DEBUG: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
