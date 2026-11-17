> Documento histórico: la descarga de Bolt reemplazó el frontend. Consulte [la revisión del 16/11/2026](REVISION_FRONTEND_2026-11-16.md) y [el backend actualizado](REVISION_BACKEND.md) para el estado y las limitaciones actuales.

# Revisión técnica y de seguridad

Fecha: 26 de octubre de 2026. Alcance: código local del frontend, API, modelos, migraciones y pruebas. La revisión inicial fue local. Tras configurar la conexión, se verificó PostgreSQL remoto mediante lecturas y validación de registros; no se modificaron datos ni se aplicaron migraciones remotas. No se mostraron credenciales ni registros privados.

## Hallazgos y cambios

| Hallazgo inicial | Riesgo / efecto | Cambio |
|---|---|---|
| Frontend conectado directamente a Supabase; API independiente | Reglas de negocio eludibles y dos implementaciones incompatibles | Operaciones centralizadas en FastAPI; Supabase queda para autenticación y perfil |
| API sin autenticación ni autorización | Lectura, modificación y eliminación sin sesión | Token validado por el emisor, perfil verificado y autorización por rol |
| RLS con acceso total para cualquier autenticado | Un conductor podía operar sobre datos ajenos por REST | Migración con lecturas por asignación y revocación de escrituras directas; pendiente de aplicar |
| Login confiaba en perfil sin validar rol/asignación | Roles inválidos podían entrar en navegación administrativa | Perfil validado; sesiones no autorizadas descartadas; rutas del frontend limitadas explícitamente |
| Datos persistían en memoria tras salir y podían llegar respuestas antiguas | Exposición de datos entre sesiones | Limpieza al salir/cambiar cuenta y descarte de respuestas pendientes; pruebas de regresión |
| Generación aleatoria en frontend y servicios vacíos en API | Rutas sin restricciones verificables y escrituras parciales | Heurística determinista en backend, restricciones verificadas y persistencia transaccional |
| Horarios incoherentes aceptados y parámetros sin límites | Planes imposibles y divisiones por cero | Validaciones de horarios, fechas, estados, rangos y números finitos |
| Actualizaciones parciales requerían todos los campos y aplicaban valores por defecto | Datos anteriores sobrescritos accidentalmente | Actualización de campos presentes y validación del resultado completo |
| Cambios de estado arbitrarios | Entregas completadas sin despacho y rutas finalizadas con entregas pendientes | Transiciones limitadas; incidencias con motivo; sincronización de pedidos y paradas |
| Borrados de clientes propagados a pedidos | Pérdida de historial | Referencia restrictiva; conflictos 409 sin detalles SQL; bloqueo de borrados de pedidos procesados |
| Asignación de vehículo en varias escrituras independientes | Relaciones inconsistentes | Asignación transaccional y bloqueo de recursos con rutas activas |
| Código de frontend con propiedad duplicada y errores de lint | Comprobación TypeScript fallaba | Corrección del componente, eliminación de imports sin uso y DTO tipados |
| Contraseñas compartidas creadas por migración | Acceso predecible a cuentas de demostración | Retirado el aprovisionamiento automático para instalaciones nuevas; cuentas antiguas requieren cambio/deshabilitación |
| Dependencias con avisos de seguridad | Vulnerabilidades conocidas en herramientas y dependencias | Actualización de FastAPI, configuración, Vite y dependencias; lockfile npm actualizado |
| Pantalla de empresa mostraba guardado sin persistir | Confirmación falsa de cambios | Guardado deshabilitado y estado pendiente visible |

## Evidencia de pruebas

Resultado actualizado tras corregir el arranque local y la conexión al pooler: **107 pruebas Python y 26 pruebas de frontend aprobadas**, comprobación TypeScript y compilación de producción correctas. Cobertura total Python: **78 %**. Ruff pasó y ESLint terminó sin errores, con dos avisos sobre Fast Refresh. La compilación advierte sobre un paquete JavaScript mayor de 500 kB; las pruebas Python muestran un aviso de compatibilidad futura de TestClient/httpx. Estos avisos no impidieron las verificaciones. El archivo `RESULTADOS_PRUEBAS.txt` conserva la ejecución anterior de 99 y 25 pruebas.

Se agregaron pruebas de autenticación, autorización, acceso a recursos ajenos, manipulación de asignaciones, inyección SQL tratada como texto, CORS, validación de entradas, restricciones de capacidad/horario, persistencia y estados. El flujo integrado probado crea recursos, genera una ruta, despacha, entrega y finaliza; también elimina una ruta pendiente y vuelve a planificar sus pedidos.

Las pruebas de frontend cubren envío del token, rechazo sin sesión, errores HTTP, payloads de actualización, perfiles inválidos, restauración de sesiones, descarte de datos tras logout, planificación por API, estados y agregación de emisiones.

Los resultados finales se registran en `docs/RESULTADOS_PRUEBAS.txt`. La cobertura usa todo `app`, incluyendo repositorios heredados que todavía no utiliza la API. No equivale a cobertura de todos los caminos posibles ni a una certificación de seguridad.

Las auditorías de dependencias pasaron sin vulnerabilidades conocidas al finalizar la revisión. Este resultado depende de las bases de avisos consultadas en esa fecha. El resultado inicial de Python afectaba herramientas de desarrollo (`pip`, `pytest`, `setuptools`); también se actualizaron.

La evidencia de dependencias está en `docs/auditoria-python.json` y `docs/auditoria-npm.json`. Las 15 pruebas SQL de RLS están preparadas y pendientes de ejecución; no se incluyen en el total aprobado.

## Aplicación y comprobaciones pendientes

1. Configurar `Backend/.env` y `VITE_API_URL`, apuntando a la misma instancia Supabase que el frontend.
2. Aplicar primero la migración de acceso. Las restricciones de RLS solo estarán activas en la base después de ejecutarla.
3. Corregir duplicados antes de aplicar la migración de restricciones de datos. Los índices únicos no pueden crearse sobre duplicados. Validar después los `CHECK` y claves foráneas nuevos sobre datos históricos.
4. Deshabilitar o cambiar las contraseñas de las cuentas de demostración si existían previamente. La edición de la migración histórica no cambia cuentas ya creadas.
5. Ejecutar las 15 comprobaciones pgTAP sobre Supabase local y las pruebas de concurrencia sobre PostgreSQL antes de desplegar. SQLite no comprueba semántica de RLS, tipos PostgreSQL ni bloqueos `FOR UPDATE`.
6. Hacer una prueba de extremo a extremo con cuentas reales de administrador, operador y dos conductores. Las pruebas actuales simulan al emisor; no verifican la configuración de un proyecto remoto.

No hubo una instancia PostgreSQL/Supabase local disponible. Docker estaba instalado pero su motor no estaba iniciado. Por ello, las migraciones y la suite pgTAP están preparadas y revisadas, pero no se informa que hayan pasado.

La verificación posterior de conexión al proyecto remoto pasó: `/health/ready` devolvió 200 con `db: true`, todas las tablas requeridas estaban presentes y los registros revisados cumplieron sus esquemas de respuesta. La consulta de políticas encontró **0 políticas `scoped_read_*`**, por lo que la migración de seguridad continúa pendiente de aplicación. La conexión usa el pooler de transacciones del puerto 6543; se corrigió el parámetro de Prisma incompatible con asyncpg y se configuró la gestión de sentencias para ese modo.

## Funciones que siguen pendientes

- Persistencia de datos de empresa y preferencias de alertas de la pantalla Configuración.
- Mapas por carretera, almacén de salida/regreso, tráfico real y seguimiento GPS. El proveedor de tráfico continúa declarando `available=false`.
- Interpretación o aprobación verificable de restricciones libres y coordinación telefónica.
- Un optimizador de rutas completo. La heurística actual busca un plan factible y puede rechazar casos que otro algoritmo resolvería.
- Configuración de despliegue, TLS, copias de seguridad, límites de peticiones y trazabilidad operativa según el entorno elegido.
- Migraciones Alembic: la carpeta original es un esqueleto; las migraciones operativas siguen en Supabase.

Los parámetros de almuerzo y tiempo por entrega son supuestos explícitos documentados en el README; deben ajustarse a la operación real cuando se definan esos requisitos.

## Referencias técnicas

- [Supabase: seguridad por filas](https://supabase.com/docs/guides/database/postgres/row-level-security).
- [Supabase: validación de usuario con getUser](https://supabase.com/docs/reference/javascript/auth-getuser).
- [Supabase: pruebas de base de datos](https://supabase.com/docs/guides/database/testing).
- [pgTAP: documentación de comprobaciones SQL](https://pgtap.org/documentation.html).
