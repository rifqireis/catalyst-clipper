"""Fungsi NLP sederhana berbasis pencarian string."""

UMKM_KEYWORDS = ("umkm", "produk", "beli", "promo")


def extract_keywords(message: str) -> list[str]:
    """Mengembalikan daftar keyword UMKM yang ditemukan di pesan."""
    normalized_message = message.lower()
    return [keyword for keyword in UMKM_KEYWORDS if keyword in normalized_message]
