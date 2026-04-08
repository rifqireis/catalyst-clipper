"""Fungsi bisnis untuk penentuan tugas clipper."""

from datetime import datetime, timedelta
from uuid import uuid4


def calculate_clip_timestamps(event_time: datetime) -> tuple[datetime, datetime]:
    """Menghasilkan jendela clip dari satu menit sebelum hingga dua menit sesudah event."""
    start_timestamp = event_time - timedelta(minutes=1)
    end_timestamp = event_time + timedelta(minutes=2)
    return start_timestamp, end_timestamp


def generate_ip_license() -> str:
    """Menghasilkan token UUID v4 sebagai simulasi lisensi IP digital."""
    return str(uuid4())
