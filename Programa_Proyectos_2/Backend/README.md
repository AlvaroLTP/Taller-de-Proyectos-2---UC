# Backend EcoLogística

API FastAPI con autenticación Supabase, autorización por rol, planificación transaccional y pruebas aisladas.
Las instrucciones completas están en [el README principal](../README.md).

```powershell
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements-dev.txt
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
# Completar las variables y aplicar las migraciones Supabase descritas en ../README.md.
.venv/Scripts/python.exe -m uvicorn app.main:app --reload
```

Pruebas sin acceso a servicios externos:

```powershell
.venv/Scripts/python.exe -m pytest -q --cov=app --cov-report=term-missing
```

`GET /health` comprueba que la API responde. `GET /health/ready` comprueba la conexión SQL y devuelve 503 si no está disponible.
Todos los endpoints `/api/v1/` requieren `Authorization: Bearer <access_token>`.
