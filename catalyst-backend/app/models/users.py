"""Model user untuk Catalyst POC."""

from enum import Enum

from sqlmodel import Field, SQLModel


class UserRole(str, Enum):
    """Role user yang diizinkan di sistem."""

    UMKM = "UMKM"
    STREAMER = "Streamer"
    CLIPPER = "Clipper"


class User(SQLModel, table=True):
    """Representasi user sederhana untuk POC."""

    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    name: str
    role: UserRole
    is_verified: bool = Field(default=False)
