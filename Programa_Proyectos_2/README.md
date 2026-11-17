# EcoLogística Lima

Optimizador de Rutas Sostenibles para DistriRápido S.A.C. — Taller de Proyectos 2, Universidad Continental.

**Líder:** La Torre Párraga, Alvaro Andree.
**Equipo:** Caldas Alanya, Marvin Usias; Guevara Chamorro, Augusto Jose; La Torre Párraga, Alvaro Andree; Yanarico Ticona, Ivan Josue.

## Documentación

- [Inicio del proyecto](doc/01_Inicio/)
- [Planificación y artefactos de Jira](doc/02_Planficacion/02.%20Artefactos%20Jira%20V_1_0_0.md)
- [Tablero Jira](https://continental-team-lz4401n3.atlassian.net/jira/software/projects/KAN/boards/1)

### Sprint 1 — Gestión Core de Operaciones

- [Informe de estado](doc/03_Implementacion/Sprint_1/01%20Informe%20de%20estado%20del%20proyecto%20V_1_0_0.md)
- [Registro de impedimentos](doc/03_Implementacion/Sprint_1/02%20Registro%20de%20Impedimentos%20V_1_0_0.md)
- [Revisión del sprint](doc/03_Implementacion/Sprint_1/03%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md)
- [Retrospectiva](doc/03_Implementacion/Sprint_1/04%20Retrospectiva%20del%20Sprint%20V_1_0_0.md)

### Sprint 2 — Motor de Optimización y Despacho

- [Informe de estado](doc/03_Implementacion/Sprint_2/01%20Informe%20de%20estado%20del%20proyecto%20V_1_0_0.md)
- [Registro de impedimentos](doc/03_Implementacion/Sprint_2/02%20Registro%20de%20Impedimentos%20V_1_0_0.md)
- [Revisión del sprint](doc/03_Implementacion/Sprint_2/03%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md)
- [Retrospectiva](doc/03_Implementacion/Sprint_2/04%20Retrospectiva%20del%20Sprint%20V_1_0_0.md)

# Descripción Inicial

Aplicación React/TypeScript y API FastAPI para gestionar vehículos, conductores, clientes, pedidos y rutas.
Supabase gestiona la autenticación y PostgreSQL. El frontend envía las operaciones a FastAPI con el token de sesión.

## Ejecutar en desarrollo

Requisitos: Python 3.11+, Node.js 24 LTS y un proyecto Supabase de desarrollo.

Desde la raíz, preparar el backend:

```powershell
python -m venv Backend/.venv
Backend/.venv/Scripts/python.exe -m pip install -r Backend/requirements-dev.txt
if (-not (Test-Path Backend/.env)) { Copy-Item Backend/.env.example Backend/.env }
```

Completar `Backend/.env`: conexión PostgreSQL con el controlador `postgresql+asyncpg`, URL de Supabase, clave pública y orígenes del frontend. Para conexiones que requieren TLS, usar `?ssl=require`. Codificar caracteres especiales de la contraseña en la URL. La conexión SQL es exclusivamente del servidor y debe permitir las operaciones de las tablas operativas; el backend aplica la autorización por usuario. No colocar su contraseña ni claves `service_role` en variables `VITE_*`.

Configurar el frontend:

```powershell
cd Frontend
npm ci
# Si ya existe .env, agregar VITE_API_URL sin sobrescribir las otras variables.
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Completar la URL y clave pública de **ese mismo proyecto Supabase**. `VITE_API_URL=http://localhost:8000/api/v1` apunta al backend local.

En dos terminales:

```powershell
cd Backend
.venv/Scripts/python.exe -m uvicorn app.main:app --reload
```

```powershell
cd Frontend
npm run dev
```

La API documenta los contratos en `http://localhost:8000/docs`. `/health` comprueba el proceso y `/health/ready` la conexión SQL. Una configuración ausente devuelve 503 en las operaciones dependientes del servicio.

En Windows también puede iniciarse desde la raíz con `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-backend.ps1`. Para dejarlo en segundo plano, agregar `-Background`. Después de editar `Backend/.env`, recargar el proceso iniciado por ese script con `-Background -Restart`. El script comprueba `/health` antes de confirmar el arranque; los registros quedan en `.tmp/backend.stderr.log`.

Si aparece `ERR_CONNECTION_REFUSED`, comprobar primero `http://localhost:8000/health`. Un proceso Uvicorn de recarga que retiene el puerto sin aceptar conexiones debe cerrarse desde su terminal antes de iniciar otro. Si `/health` funciona pero `/health/ready` devuelve 503, revisar la conexión SQL: `USER`, `PASSWORD` y `HOST` son marcadores del ejemplo y deben reemplazarse por los datos reales del proyecto. También se aceptan las cadenas PostgreSQL habituales de Supabase; el backend adapta el controlador a asyncpg y convierte `sslmode` a `ssl`.

Si la URL contiene `pgbouncer=true`, el backend elimina esa opción de Prisma antes de invocar asyncpg. En el pooler de transacciones Supabase del puerto 6543 usa `NullPool`, desactiva las cachés de sentencias y genera nombres únicos de sentencias. Esta configuración sigue las indicaciones de [Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres) y [SQLAlchemy](https://docs.sqlalchemy.org/en/20/dialects/postgresql.html#prepared-statement-name-with-pgbouncer).

## Base de datos y cuentas

Las migraciones canónicas están en `Frontend/supabase/migrations`. Para una base nueva, aplicarlas por orden de nombre. En una base existente con las tres migraciones originales aplicadas, ejecutar únicamente:

1. `20261026150000_secure_api_access.sql`: revoca escrituras directas y limita lecturas por rol y asignación.
2. `20261026151000_data_constraints.sql`: agrega restricciones, referencias e índices únicos.

**Estas migraciones están preparadas, pero no se aplicaron a una base remota durante esta revisión.** Revisar primero `docs/AUDITORIA_SISTEMA.md` y ejecutar las pruebas SQL en desarrollo. Antes de la segunda migración, comprobar códigos, placas, DNI, licencias y asignaciones duplicadas: los índices únicos fallarán si existen duplicados. Los `CHECK` y claves foráneas nuevos usan `NOT VALID` para permitir corregir datos históricos y luego ejecutar `VALIDATE CONSTRAINT` sobre cada restricción nueva.

La migración histórica de perfiles ya no crea cuentas con contraseñas compartidas. En proyectos donde ya se ejecutó la versión anterior, deshabilitar o cambiar las contraseñas de las cuentas de demostración antes de exponer el sistema. Crear usuarios en Supabase Auth y sus perfiles mediante una cuenta administrativa. `profiles.id` debe coincidir con `auth.users.id`; el rol `driver` requiere un `driver_id` válido. Los roles admitidos son `admin`, `operator` y `driver`.

`Backend/alembic` conserva el esqueleto original y no sustituye estas migraciones Supabase, que también configuran `auth`, permisos y RLS.

## Permisos

| Operación | Admin / operador | Conductor |
|---|---|---|
| Gestionar vehículos, conductores, clientes y pedidos | Sí | No |
| Planificar, asignar vehículos y cambiar parámetros | Sí | No |
| Consultar datos logísticos | Todos | Sus asignaciones y clientes asociados |
| Cambiar estado de entregas/rutas | Transiciones válidas | Solo sus asignaciones |
| Cancelar pedidos / eliminar rutas sin iniciar | Sí | No |
| Modificar roles/perfiles desde la aplicación | No | No |
| Escribir directamente por REST de Supabase | No | No |

Las notificaciones actuales son compartidas entre operaciones. Los conductores reciben una lista vacía. Los parámetros operativos se pueden consultar con una sesión válida.

## Planificación y límites

La generación valida identificadores, fecha del pedido, disponibilidad, asignaciones compatibles, capacidad de peso/volumen, límite de entregas, ventanas horarias, turno, duración y distancia máxima. No vuelve a planificar pedidos asignados. Si el algoritmo no encuentra un plan factible, devuelve errores y no guarda rutas parciales. Generación y asignación de pedidos se guardan en una transacción; los recursos se bloquean durante la planificación.

El algoritmo es una heurística determinista: puede rechazar un conjunto aunque exista otra distribución factible. Calcula distancias geográficas entre entregas; no incluye viaje desde/hacia un almacén ni carreteras, tráfico o GPS. La primera parada tiene distancia inicial cero. Las emisiones y duraciones son estimaciones, no mediciones.

Las entregas con atención especial reservan 20 minutos; las demás, 10. `no_lunch_hours` excluye 12:00–14:00. La hora preferida es informativa; las ventanas de entrega y preferencia son restricciones. Los textos libres y la coordinación telefónica bloquean la planificación automática y requieren revisión manual; aún no existe un flujo de aprobación de esas condiciones.

## Verificaciones

Ejecutar todas las verificaciones locales en Windows, sin servicios externos:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check.ps1
```

O por separado:

```powershell
cd Backend
.venv/Scripts/python.exe -m pytest -q --cov=app --cov-report=term-missing
.venv/Scripts/python.exe -m ruff check app tests
.venv/Scripts/python.exe -m pip_audit
```

```powershell
cd Frontend
npm run check
npm audit
```

Las pruebas Python usan SQLite en memoria con claves foráneas activas y un proveedor de identidad simulado. Las pruebas unitarias de autenticación verifican las respuestas del emisor con HTTP simulado. No necesitan credenciales ni modifican datos remotos.

Las pruebas de RLS son independientes: requieren Docker y Supabase CLI. Desde `Frontend`, inicializar la configuración local con `supabase init` si todavía no existe, iniciar `supabase start` y ejecutar `supabase test db supabase/tests/security.test.sql` contra una instancia local desechable. No ejecutar `db reset` ni pruebas contra una base compartida. La prueba crea datos de ensayo dentro de una transacción y los revierte. Hay 15 comprobaciones SQL preparadas; no se ejecutaron en esta revisión porque Docker no estaba disponible.

Se incluye `.github/workflows/checks.yml` para pruebas y auditorías al subir el proyecto a GitHub; ese workflow todavía no se ha ejecutado en GitHub.

Ver resultados, evidencias y trabajo pendiente en [la auditoría](docs/AUDITORIA_SISTEMA.md).
