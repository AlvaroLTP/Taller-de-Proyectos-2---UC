# Integración del frontend de Bolt — 16 de noviembre de 2026

## Problemas encontrados y correcciones

- El frontend escribía directamente en las tablas Supabase. Se sustituyeron las operaciones por llamadas autenticadas a FastAPI; Supabase mantiene la autenticación y la lectura del perfil propio.
- `MainLayout.tsx` y la generación de rutas estaban incompletos. Se reconstruyó la navegación por rol y se conectó la planificación al optimizador y a las transacciones del backend.
- Las actualizaciones parciales podían borrar asignaciones al enviar valores nulos. El adaptador omite los campos ausentes y reserva las asignaciones y transiciones a sus endpoints específicos.
- Se corrigieron bloqueos potenciales del callback de autenticación, cargas duplicadas y respuestas atrasadas después del cierre de sesión. Se limpian los datos al salir y se recargan los recursos relacionados después de modificar rutas o entregas.
- Los formularios tienen etiquetas asociadas a los controles y los modales se identifican como diálogos para accesibilidad y pruebas de navegador.
- La configuración de empresa y preferencias antes anunciaba un guardado ficticio. Ahora se conserva por usuario en el navegador, con su alcance indicado en pantalla. No existe configuración de empresa compartida en el servidor.
- Se corrigió la denominación de indicadores: la proporción de pedidos entregados no mide puntualidad. El tiempo estimado medio usa el número de entregas.

## Configuración de Supabase

Se detectaron dos proyectos distintos. La URL de autenticación del backend coincide con el proyecto de su conexión PostgreSQL; la URL y la clave pública del frontend corresponden a otro proyecto. No basta con que las direcciones sean válidas: API, usuarios, perfiles y tablas deben pertenecer al mismo proyecto.

El usuario eligió conservar el proyecto del backend. Se alinearon la URL y la clave pública del frontend con ese proyecto; `scripts/validate-config.py` verifica la coincidencia sin revelar credenciales. No se deben copiar contraseñas SQL ni claves privilegiadas a variables `VITE_*`. Se agregó `VITE_API_URL` al entorno local y un ejemplo reproducible.

Una comprobación SQL de solo lectura confirmó que la base configurada en el backend responde y contiene las ocho tablas operativas esperadas. Esto no equivale a validar todos los datos históricos ni las políticas RLS.

## Alcance de las pruebas

Las pruebas Python aíslan la base en SQLite. Playwright usa la interfaz real y FastAPI real contra una base SQLite desechable; el proveedor de identidad se representa con un servicio HTTP local compatible con Supabase. La ruta de verificación de tokens del backend se conserva. Estas pruebas no demuestran el funcionamiento del proveedor Supabase remoto.

El monitoreo remoto es de solo lectura y se ejecuta por separado con las direcciones y, opcionalmente, credenciales de una cuenta de pruebas. Las trazas y capturas pueden contener datos visibles de esa cuenta y se deben conservar en un lugar privado.

Los resultados efectivos y comandos quedan registrados al finalizar la verificación. Las migraciones SQL preparadas localmente no se aplican automáticamente a la base compartida.

### Resultados verificados

- Backend: 110 pruebas aprobadas; cobertura informada del 76 %. Ruff aprobado.
- E2E con Playwright y Chrome instalado, sobre las dependencias finales: **6 pruebas aprobadas**, sin fallos ni reintentos, en 63,3 segundos. Incluyen credenciales incorrectas, CRUD de vehículos y persistencia tras recargar, navegación de las pantallas de operaciones, límites del conductor y rechazo de escrituras por API, fallo/reintento de API y planificación → despacho → cambio de sesión → confirmación de entrega persistida.
- Frontend: TypeScript, ESLint y compilación de producción aprobados. ESLint conserva dos advertencias de Fast Refresh, sin errores.
- Dependencias: Vite 7.3.8 y dependencias fijadas actualizadas; `npm audit` informó **0 vulnerabilidades**. Node mínimo 22.12; README y CI usan Node 24. El override de `minimatch` se limita al árbol de TypeScript-eslint para corregir la dependencia vulnerable pendiente de actualizar en su versión publicada.
- Configuración local: URL Supabase del frontend y backend alineadas; comprobación sin revelar credenciales aprobada.
- Monitoreo real con Playwright y Google Chrome: 2 pruebas aprobadas y 1 omitida por ausencia de credenciales de una cuenta real. La ejecución final completó el monitoreo en 5,7 segundos, con ambos endpoints dentro del umbral de 15 segundos. Son observaciones puntuales, no un SLA.
- La prueba de inicio de sesión omitida sigue siendo necesaria para acreditar autenticación y lectura operativa con Supabase remoto.

Las capturas del panel y del monitoreo se revisaron visualmente. Se corrigieron tarjetas con texto solapado y se incluyeron capturas en el reporte HTML de E2E.

### Ejecución y monitoreo

Desde `Frontend`:

```powershell
npm run check
npm run test:e2e
# Si la descarga de Chromium falla y Google Chrome ya está instalado:
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:e2e

# Monitorear un despliegue o los servidores locales ya iniciados:
$env:MONITOR_FRONTEND_URL = 'http://localhost:5173'
$env:MONITOR_API_URL = 'http://localhost:8000'
npm run monitor
```

`MONITOR_API_URL` es la raíz del servidor, sin `/api/v1`. El monitor comprueba `/health`, `/health/ready`, el tiempo de respuesta y la pantalla de acceso. Para verificar además el inicio de sesión y la carga de datos, configurar `MONITOR_EMAIL` y `MONITOR_PASSWORD` mediante el entorno o un almacén de secretos; nunca escribir las credenciales en el repositorio. Si no están configuradas, esa comprobación se registra como omitida.

Los reportes quedan en `Frontend/playwright-report/index.html` y `Frontend/monitor-report/index.html`. Los resultados estructurados están en `test-results/results.json` y `monitor-results/results.json`. Las capturas y trazas de fallos se adjuntan al reporte.

`scripts/check.ps1 -E2E` incluye la suite de navegador en la verificación local. El workflow `checks.yml` agrega E2E con Chromium. `monitor.yml` prepara ejecución manual y diaria a las 08:00 de Lima (13:00 UTC), condicionada a las variables de GitHub `MONITOR_FRONTEND_URL` y `MONITOR_API_URL`; la cuenta opcional usa secretos con los mismos nombres indicados arriba. No se publicó ni activó un workflow remoto durante esta revisión.

## Límites funcionales que siguen vigentes

- Los mapas son esquemas de paradas; no hay GPS ni tráfico en vivo. Las proyecciones de ahorro, combustible y compensación son escenarios estimados, no ahorros medidos ni inversiones ejecutadas.
- La reoptimización se permite antes de iniciar la ruta. Una ruta iniciada requiere conservar el historial y la ubicación actual, datos que el modelo todavía no representa.
- La migración de rutas simuladas descargada con Bolt debe revisarse antes de aplicarse: contiene identificadores y fechas fijos y modifica pedidos históricos. Consultar también la revisión del backend.
- SQLite no sustituye la validación de concurrencia, migraciones y permisos de PostgreSQL/Supabase.
