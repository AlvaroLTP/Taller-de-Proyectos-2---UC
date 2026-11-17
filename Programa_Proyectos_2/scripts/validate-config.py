"""Check project alignment without displaying credentials or contacting services."""

import sys
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "Backend"))

from dotenv import dotenv_values


def main():
    frontend = dotenv_values(ROOT / "Frontend/.env")
    backend = dotenv_values(ROOT / "Backend/.env")
    frontend_url = (frontend.get("VITE_SUPABASE_URL") or "").rstrip("/")
    backend_url = (backend.get("SUPABASE_URL") or "").rstrip("/")
    checks = {
        "Frontend y backend usan el mismo proyecto Supabase": bool(frontend_url)
        and frontend_url == backend_url,
        "Clave publica del frontend presente": bool(frontend.get("VITE_SUPABASE_ANON_KEY")),
        "Clave publica del backend presente": bool(backend.get("SUPABASE_ANON_KEY")),
        "Conexion SQL configurada": bool(backend.get("DATABASE_URL")),
        "URL de API del frontend configurada": urlsplit(frontend.get("VITE_API_URL") or "").scheme
        in ("http", "https"),
    }
    for description, valid in checks.items():
        print(f"{'OK' if valid else 'ERROR'}: {description}")
    return 0 if all(checks.values()) else 1


if __name__ == "__main__":
    raise SystemExit(main())
