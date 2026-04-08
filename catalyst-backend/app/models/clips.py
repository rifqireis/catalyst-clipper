"""Model clip task untuk Catalyst POC."""

from datetime import datetime
from enum import Enum

from sqlalchemy import Column, String
from sqlmodel import Field, SQLModel


class ClipStatus(str, Enum):
    """Status tugas clipper yang tersedia di POC."""

    PENDING = "pending"
    COMPLETED = "completed"


class ClipTask(SQLModel, table=True):
    """Tugas potong video yang dikirim ke clipper."""

    __tablename__ = "clip_tasks"

    id: int | None = Field(default=None, primary_key=True)
    donation_id: int = Field(foreign_key="donations.id", index=True)
    assigned_clipper_id: int = Field(foreign_key="users.id", index=True)
    start_timestamp: datetime
    end_timestamp: datetime
    status: ClipStatus = Field(default=ClipStatus.PENDING)
    ip_license_token: str = Field(
        sa_column=Column(String(36), unique=True, nullable=False, index=True)
    )
