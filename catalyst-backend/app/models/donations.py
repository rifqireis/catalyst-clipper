"""Model donasi untuk Catalyst POC."""

from datetime import datetime

from sqlmodel import Field, SQLModel


class Donation(SQLModel, table=True):
    """Menyimpan event donasi masuk."""

    __tablename__ = "donations"

    id: int | None = Field(default=None, primary_key=True)
    donor_name: str
    amount: int
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
