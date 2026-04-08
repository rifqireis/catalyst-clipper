"""Endpoint donasi untuk Catalyst POC."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, SQLModel

from app.db.database import get_session
from app.models.clips import ClipStatus, ClipTask
from app.models.donations import Donation
from app.models.users import User, UserRole
from app.services.clip_logic import calculate_clip_timestamps, generate_ip_license
from app.services.nlp_engine import extract_keywords

router = APIRouter()

DEFAULT_CLIPPER_ID = 1


class DonationCreatePayload(SQLModel):
    donor_name: str
    amount: int
    message: str


class ClipTaskRead(SQLModel):
    id: int
    donation_id: int
    assigned_clipper_id: int
    start_timestamp: datetime
    end_timestamp: datetime
    status: ClipStatus
    ip_license_token: str


class DonationWorkflowResponse(SQLModel):
    id: int
    donor_name: str
    amount: int
    message: str
    timestamp: datetime
    detected_keywords: list[str]
    clip_task_created: bool
    clip_task: ClipTaskRead | None = None


@router.post("", response_model=DonationWorkflowResponse, status_code=status.HTTP_201_CREATED)
def create_donation(
    payload: DonationCreatePayload,
    session: Session = Depends(get_session),
):
    """Menyimpan donasi dan membuat clip task jika keyword UMKM terdeteksi."""
    donation = Donation(**payload.model_dump())
    session.add(donation)
    session.flush()

    detected_keywords = extract_keywords(donation.message)
    clip_task: ClipTask | None = None

    if detected_keywords:
        clipper = session.get(User, DEFAULT_CLIPPER_ID)
        if clipper is None or clipper.role != UserRole.CLIPPER:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Clipper default untuk POC belum tersedia.",
            )

        start_timestamp, end_timestamp = calculate_clip_timestamps(donation.timestamp)
        clip_task = ClipTask(
            donation_id=donation.id,
            assigned_clipper_id=DEFAULT_CLIPPER_ID,
            start_timestamp=start_timestamp,
            end_timestamp=end_timestamp,
            status=ClipStatus.PENDING,
            ip_license_token=generate_ip_license(),
        )
        session.add(clip_task)

    session.commit()
    session.refresh(donation)

    if clip_task is not None:
        session.refresh(clip_task)

    return DonationWorkflowResponse(
        **donation.model_dump(),
        detected_keywords=detected_keywords,
        clip_task_created=clip_task is not None,
        clip_task=clip_task,
    )
