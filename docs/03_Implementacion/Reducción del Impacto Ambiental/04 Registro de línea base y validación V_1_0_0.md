# Registro de línea base y validación

**Versión:** 1.0.0  
**Fecha y hora local:** 2026-11-10, 14:47 (America/Lima)  
**Alcance:** ejecución local y aislada; sin llamadas a Supabase remoto.

## Identificación del estado

| Campo | Valor | Clasificación |
| --- | --- | --- |
| Commit base | `e00711ebcb9d02127b864d58ff63bd61433f7bb9` | Observada |
| Rama | `actualizacion-sprint-3` | Observada |
| Árbol de trabajo | Contiene cambios locales sin commit de métricas logísticas y carga diferida | Observada |
| Node.js / npm | v24.15.0 / 11.12.1 | Observada |
| Python / pip | 3.12.10 / 25.0.1 | Observada |
| Datos de prueba backend | SQLite en memoria, proveedor de identidad simulado y fixture de flota propuesta | Observada |
| Datos externos/remotos | No usados | Observada |

## Comandos ejecutados

```powershell
# Frontend
npm ci
npm run check
npm run measure:baseline

# Backend
.venv\Scripts\python.exe -m pytest -q --cov=app --cov-report=term-missing
.venv\Scripts\python.exe -m ruff check app tests
.venv\Scripts\python.exe -m pip check
```

## Resultados

| Validación | Resultado | Clasificación |
| --- | --- | --- |
| `npm ci` | Instaló 342 paquetes; reportó 9 vulnerabilidades moderadas y dependencias deprecadas | Medida |
| Frontend | 26/26 pruebas aprobadas; typecheck y build correctos; 2 advertencias Fast Refresh | Medida |
| Bundle inicial | 444,576 bytes; 126,863 bytes gzip | Medida |
| Backend | 109/109 pruebas aprobadas; cobertura total 78%; 2 advertencias de deprecación | Medida |
| Ruff | Sin hallazgos | Medida |
| `pip check` | Sin requisitos rotos | Medida |
| Pruebas de API | Cubiertas de manera aislada por FastAPI TestClient y SQLite; no se ejecutó una API de red | Medida / límite observado |
| Lighthouse | No ejecutado: no se encontró ejecutable Lighthouse | No verificable |
| RLS / migración Supabase | No ejecutado: Supabase CLI ausente y Docker Desktop no disponible | No verificable |

## Límites de interpretación

El tamaño gzip es una medición de build local y no sustituye transferencia real, Web Vitals, latencia API, consumo energético ni emisiones. Los parámetros de flota son escenarios de prueba clasificados como Propuesta/Estimada; no representan datos reales de DistriRápido.
