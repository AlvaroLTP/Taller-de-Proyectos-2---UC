# Revisión del backend — 16 de noviembre de 2026

## Conexión verificada sin modificar datos

Se compararon las variables con un lector dotenv y se comprobó el identificador de proyecto sin registrar URLs, claves ni contraseñas:

- La URL de Supabase del frontend y la del backend corresponden a proyectos diferentes.
- La clave pública JWT del frontend corresponde a su propia URL.
- La conexión PostgreSQL del backend corresponde al proyecto de autenticación del backend.
- La clave del backend tiene formato publicable `sb_publishable_`; este formato no debe rechazarse por no ser JWT.
- Una consulta remota de solo lectura `SELECT 1` terminó correctamente. Existen `vehicles`, `drivers`, `clients`, `orders`, `routes`, `parameters`, `notifications` y `profiles` en esa base.

Las variables no se modificaron durante esa comprobación. Posteriormente, el usuario eligió el proyecto del backend y se alinearon la URL y la clave pública del frontend con él. La presencia de tablas no acredita que todos sus datos, restricciones o políticas estén actualizados.

## Cambios del backend

Se agregó `POST /api/v1/routes/{id}/reoptimize`, con cuerpo `{ "reason": "..." }`, para administradores y operadores. Reutiliza las restricciones del planificador y actualiza, en una sola transacción, las métricas, paradas y secuencia de los pedidos de la misma ruta. Conserva el identificador, código y estado de preparación. La respuesta usa los campos del nuevo `ReoptimizationResult` del frontend.

Solo se permite en rutas pendientes o en preparación, con pedidos planificados y recursos disponibles. Las rutas iniciadas o terminadas devuelven 409: el planificador actual no conoce posiciones GPS ni horarios efectivos necesarios para reordenar una ruta en ejecución. Un plan inviable conserva el plan anterior. Los valores de ahorro son diferencias reales de estimaciones, pueden ser cero o negativos y no deben presentarse como ahorro garantizado.

La generación y reoptimización ahora incluyen el nombre real del cliente en cada parada; antes el planificador guardaba una cadena vacía.

## Migraciones recuperadas y pendientes de aplicación

Los archivos `20261026150000_secure_api_access.sql` y `20261026151000_data_constraints.sql`, citados por el README pero ausentes de la descarga, se reconstruyeron localmente. **No se ejecutaron contra una base remota.** Deben revisarse y probarse en una copia desechable antes de aplicarse.

La migración de seguridad adopta el acceso operacional exclusivamente por FastAPI: revoca acceso de `anon` y `authenticated` a las tablas operativas, elimina sus políticas anteriores y conserva únicamente lectura del propio perfil. La conexión SQL del servidor debe usar un rol confiable propietario de las tablas o con BYPASSRLS. Esta política sustituye las lecturas directas por rol que describía el README anterior.

La migración de restricciones agrega índices únicos, referencias y comprobaciones. Los índices fallarán si existen duplicados. Los CHECK y claves foráneas son NOT VALID: protegen operaciones nuevas, pero los datos históricos deben corregirse antes de validar cada restricción.

## Riesgos de los archivos descargados

`20261116144843_20261116000001_generate_simulated_routes.sql.sql` es un seed de demostración, no una migración estructural. Contiene identificadores y fechas fijos, paradas y estados simulados, y modifica los pedidos por código sin garantizar que sus UUID coincidan con las paradas. No establece `delivery_order`; su UPDATE final establece `delivered_at` para todos los pedidos entregados sin fecha, incluidos pedidos ajenos al seed. No debe ejecutarse sobre datos reales. Se preservó el archivo histórico para no alterar el seguimiento de migraciones ya aplicadas.

`20261025220706_create_profiles_and_auth_users.sql` conserva la creación histórica de cuentas con una contraseña compartida de demostración. No se cambiaron cuentas remotas. Antes de exponer el sistema, retirar esas cuentas o cambiar sus credenciales desde Supabase Auth. En una instalación nueva se deben crear las cuentas mediante el flujo administrativo y evitar ejecutar ese bloque de demostración.

## Verificación ejecutada

`Backend/.venv/Scripts/python.exe -m pytest -q --cov=app --cov-report=term-missing`: **110 pruebas aprobadas**, cobertura agregada informada **76 %**. Se añadieron tres regresiones de reoptimización (persistencia de identidad/secuencia, permisos y rutas iniciadas, rollback ante inviabilidad) y una comprobación del nombre del cliente en paradas generadas.

`ruff check app tests --select F401,F811,I`: aprobado. Queda una advertencia de deprecación del TestClient de Starlette sobre httpx; no produjo fallos.

No se ejecutaron pruebas SQL de RLS ni migraciones sobre el proyecto remoto. Las pruebas Python usan SQLite aislado y una identidad simulada; no sustituyen una prueba de permisos PostgreSQL ni una sesión real con el proyecto elegido.
