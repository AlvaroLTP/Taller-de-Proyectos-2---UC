# Playwright: pruebas y monitoreo

Desde `Frontend`, con dependencias Python de `Backend/requirements-dev.txt` instaladas:

```powershell
npm ci
npx playwright install chromium
npm run test:e2e
```

Si ya tiene Google Chrome y no puede descargar Chromium:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:e2e
```

Playwright inicia Vite en `127.0.0.1:5174` y FastAPI en `127.0.0.1:8011`.
Estos puertos deben estar libres. `server.py` carga los endpoints reales,
usa SQLite en memoria y proporciona una identidad de prueba con la forma de
Supabase Auth. El backend comprueba el token y perfil mediante HTTP, igual que
en producción. No usa usuarios ni tablas del Supabase remoto. Esto verifica
la integración del navegador con FastAPI; no certifica PostgreSQL, RLS ni el
proveedor de identidad remoto.

Los casos cubren rechazo de acceso, CRUD persistido al recargar, carga de
pantallas, permisos del conductor, recuperación de errores y el recorrido
planificación → despacho → entrega. Para ese último recorrido se crean
cliente, pedido y vehículo mediante la API local antes de operar en la UI.
Las capturas de dashboard y monitoreo están adjuntas al reporte HTML.

`playwright-report/index.html` contiene el informe visual;
`test-results/results.json`, resultados para automatización. Las fallas
conservan capturas y trazas. `npx playwright show-report` abre el informe.

## Monitoreo del sistema configurado

Inicie previamente frontend y backend reales. En otra terminal:

```powershell
$env:MONITOR_FRONTEND_URL = 'http://localhost:5173'
$env:MONITOR_API_URL = 'http://127.0.0.1:8000'
npm run monitor
```

`MONITOR_API_URL` es la raíz de FastAPI, sin `/api/v1`. Se verifican `/health`,
`/health/ready`, tiempos de respuesta y que el navegador cargue el login sin
errores JavaScript. `MONITOR_MAX_API_MS` cambia el umbral de 15000 ms.
Para verificar también la carga autenticada, configure `MONITOR_EMAIL` y
`MONITOR_PASSWORD` de una cuenta existente. Sin ambas variables, esa prueba
figura como omitida; no se considera autenticación verificada.

El monitoreo no crea, edita ni elimina registros de negocio. Su informe
queda en `monitor-report/index.html` y `monitor-results/results.json`.

El workflow `monitor.yml` está preparado para ejecución manual y diaria a
las 13:00 UTC (08:00 Lima). Solo se activa al configurar las variables
GitHub `MONITOR_FRONTEND_URL` y `MONITOR_API_URL`, con URLs accesibles desde
GitHub Actions. Las credenciales opcionales van en secretos GitHub con los
mismos nombres. El workflow de CI ejecuta las E2E aisladas y conserva sus
artefactos durante 14 días.
