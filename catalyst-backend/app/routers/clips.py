"""Endpoint antrean tugas clipper."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, SQLModel, select

from app.db.database import get_session
from app.models.clips import ClipStatus, ClipTask
from app.models.users import User, UserRole

router = APIRouter()


class ClipTaskQueueItem(SQLModel):
    id: int
    donation_id: int
    assigned_clipper_id: int
    start_timestamp: datetime
    end_timestamp: datetime
    status: ClipStatus
    ip_license_token: str


@router.get("/queue/{clipper_id}", response_model=list[ClipTaskQueueItem])
def get_clipper_queue(
    clipper_id: int,
    session: Session = Depends(get_session),
):
    """Mengambil seluruh clip task pending untuk clipper tertentu."""
    clipper = session.get(User, clipper_id)
    if clipper is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clipper tidak ditemukan.",
        )

    if clipper.role != UserRole.CLIPPER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User yang diminta bukan clipper.",
        )

    statement = (
        select(ClipTask)
        .where(ClipTask.assigned_clipper_id == clipper_id)
        .where(ClipTask.status == ClipStatus.PENDING)
        .order_by(ClipTask.start_timestamp)
    )
    return list(session.exec(statement))
