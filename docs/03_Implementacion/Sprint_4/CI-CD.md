# CI/CD del Sprint 4

Los tres workflows están en `.github/workflows/` de la raíz.

| Workflow | Verificaciones |
| --- | --- |
| `ci.yml` | En React instala desde el lockfile, valida las dependencias, ejecuta ESLint y TypeScript y genera `dist`. En FastAPI verifica dependencias, ejecuta Ruff, compila el bytecode e importa la aplicación. |
| `tests.yml` | Ejecuta Vitest, Pytest y Chromium headless con Playwright. Los informes se descargan desde la ejecución de GitHub Actions. Playwright levanta el frontend compilado y FastAPI localmente, y simula el rechazo de credenciales de Supabase. |
| `deploy-production.yml` | En cada push a `main`, ejecuta CI y pruebas del mismo commit. Si pasan, despliega ese SHA primero en el backend y luego en el frontend. Espera la confirmación de Render para cada servicio. |

## Configuración de producción

Se eligió Render como destino para el sitio estático de React y el servicio web de FastAPI. Vincular los dos servicios al repositorio y a `main`, y deshabilitar el despliegue automático de Render para que GitHub Actions controle cuándo se publica un commit.

- **Backend.** Directorio raíz `Programa_Proyectos_2/Backend`. Python 3.11. Build `pip install -r requirements.txt`. Inicio `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Configurar la conexión PostgreSQL, Supabase y los orígenes del sitio según `Backend/.env.example`. Comprobación de salud en `/health` y de conexión SQL en `/health/ready`.
- **Frontend.** Directorio raíz `Programa_Proyectos_2/Frontend`. Node.js 24. Build `npm ci && npm run build`. Publicar `dist` y redirigir las rutas de la SPA a `/index.html` con una regla de reescritura. Configurar `VITE_API_URL` con la URL HTTPS del backend seguida de `/api/v1` y usar la URL y clave pública de Supabase.
- **GitHub.** Crear el entorno `production`. Añadir el secreto `RENDER_API_KEY` y las variables `RENDER_BACKEND_ID` y `RENDER_FRONTEND_ID` con los ID de los servicios. Guardar la clave únicamente en GitHub Secrets.

El despliegue requiere que los servicios y el entorno estén configurados. El repositorio conserva la configuración del workflow y el historial de sus ejecuciones. [Deploys de Render](https://render.com/docs/deploys) · [API de despliegue por commit](https://api-docs.render.com/reference/create-deploy).
