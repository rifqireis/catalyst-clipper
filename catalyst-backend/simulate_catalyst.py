"""Skrip simulasi end-to-end untuk Catalyst POC."""

from __future__ import annotations

import json

import requests

BASE_URL = "http://127.0.0.1:8000"
CLIPPER_ID = 1


def pretty_print(label: str, payload: object) -> None:
    """Mencetak payload JSON dengan format rapi ke terminal."""
    print(f"\n{label}")
    print(json.dumps(payload, indent=2, ensure_ascii=False))


def main() -> None:
    """Menjalankan simulasi donasi lalu menarik antrean clipper."""
    donation_payload = {
        "donor_name": "Donatur Demo",
        "amount": 50000,
        "message": "Keren banget produk UMKM nya!",
    }

    donation_response = requests.post(
        f"{BASE_URL}/api/donations",
        json=donation_payload,
        timeout=10,
    )
    donation_response.raise_for_status()
    pretty_print("POST /api/donations", donation_response.json())

    queue_response = requests.get(
        f"{BASE_URL}/api/clips/queue/{CLIPPER_ID}",
        timeout=10,
    )
    queue_response.raise_for_status()
    pretty_print(f"GET /api/clips/queue/{CLIPPER_ID}", queue_response.json())


if __name__ == "__main__":
    main()