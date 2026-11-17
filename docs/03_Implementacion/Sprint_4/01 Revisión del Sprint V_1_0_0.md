# Revisión del sprint

**Nombre del Proyecto:** EcoLogística Lima

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

## Historias de Usuario completadas en este Sprint

No se cuenta con evidencia verificable de una historia de usuario cerrada formalmente en Jira para el Sprint 4. Por ello, no se declara ninguna historia como completada ni se atribuye un commit como aceptación formal de una historia.

El estado de avance informado para este cierre es el siguiente:

| Historia | Estado informado | Evidencia disponible | Situación de aceptación |
|---|---:|---|---|
| US-015 — Re-optimizar rutas ante cambios operativos | 80 % | La planificación la asigna al Sprint 4; el código incorpora la reoptimización y pruebas de regresión. | En progreso; no hay confirmación verificable de aceptación completa. |
| US-021 | 50 % | No se encontró en las fuentes locales una definición, criterios de aceptación ni enlace Jira accesible para este código. | En progreso. |
| US-022 | 50 % | No se encontró en las fuentes locales una definición, criterios de aceptación ni enlace Jira accesible para este código. | En progreso. |
| US-023 | 50 % | No se encontró en las fuentes locales una definición, criterios de aceptación ni enlace Jira accesible para este código. | En progreso. |
| US-024 | 50 % | No se encontró en las fuentes locales una definición, criterios de aceptación ni enlace Jira accesible para este código. | En progreso. |

US-015 tiene como objetivo permitir que un gestor de rutas actualice una planificación ante cambios operativos y obtenga una nueva propuesta de distribución. Sus criterios documentados incluyen partir de una planificación identificable, registrar cambios, identificar elementos afectados, preservar la planificación anterior ante una solución inviable y evitar replanificar pedidos completados. La evidencia revisada acredita una implementación parcial: el endpoint `POST /api/v1/routes/{id}/reoptimize` opera sobre rutas pendientes o en preparación, conserva el plan anterior cuando la propuesta es inviable y cuenta con regresiones sobre identidad, secuencia, permisos y rutas iniciadas. No acredita por sí sola el cumplimiento integral de los criterios ni su aceptación en Jira.

## Demostración del trabajo completado

La evidencia técnica verificable está asociada al commit [`4d5494a`](https://github.com/AlvaroLTP/Taller-de-Proyectos-2---UC/commit/4d5494a4db99831a083e8ed8de3771bdff3b7920), que incorpora reoptimización de rutas, pruebas E2E aisladas y monitoreo, y al commit [`bfd4fa6`](https://github.com/AlvaroLTP/Taller-de-Proyectos-2---UC/commit/bfd4fa6a70118326beb87dc9d0460950d9a1a42e), que incorpora las evidencias de pruebas del Sprint 4.

Las fuentes conservadas en `Resultados_Pruebas_Generales` informan una ejecución histórica de 110 pruebas backend aprobadas con cobertura agregada de 76 %, seis pruebas E2E aprobadas sin fallos ni reintentos y un monitoreo puntual con dos pruebas aprobadas y una omitida por falta de credenciales de una cuenta real. La línea base local posterior del 17-11-2026 aprobó también 110 pruebas backend, con 75 % de cobertura y dos advertencias de deprecación. Las E2E incluyen autenticación inválida, CRUD de vehículos mediante FastAPI, navegación de operaciones, restricciones por rol, reintento ante un error de API y planificación, despacho y confirmación de entrega.

### Resultados estadísticos de pruebas

| Área | Resultado informado | Alcance y lectura | Fuente |
|---|---|---|---|
| Backend, registro histórico | 99 pruebas aprobadas; cobertura total 77 %; 1 advertencia | Ejecución anterior conservada como salida de consola; no representa la ejecución posterior descrita por las revisiones. | [RESULTADOS_PRUEBAS.txt](Resultados_Pruebas_Generales/RESULTADOS_PRUEBAS.txt) |
| Backend, revisiones posteriores | 107 pruebas Python y 26 pruebas frontend, cobertura Python 78 %; otra revisión informa 110 pruebas Python y cobertura 76 % | Las cifras pertenecen a ejecuciones declaradas distintas. No se suman ni se presenta una única cobertura final sin un reporte reproducible único. | [AUDITORIA_SISTEMA.md](Resultados_Pruebas_Generales/AUDITORIA_SISTEMA.md) y [REVISION_BACKEND.md](Resultados_Pruebas_Generales/REVISION_BACKEND.md) |
| Línea base local, 17-11-2026 | 110 pruebas backend aprobadas en 5,78 s; 75 % de cobertura sobre 1222 sentencias; 2 advertencias de deprecación. TypeScript, ESLint y compilación aprobaron; ESLint mostró 2 advertencias Fast Refresh y 0 errores. | Ejecutado con `scripts/check.ps1`, Python 3.12.10 y Vite 7.3.8. La compilación generó un bundle inicial de 456,84 kB (133,80 kB gzip). Es una ejecución local; no sustituye una ejecución CI ni se combina con las coberturas históricas. | [Script de verificación](../../../Programa_Proyectos_2/scripts/check.ps1) |
| E2E con Playwright | 6 aprobadas, 0 fallidas y 0 reintentos; duración 63,3 s | Ejecución local con Chrome, Vite, FastAPI y SQLite desechable; no demuestra el proveedor Supabase remoto. | [REVISION_FRONTEND_2026-11-16.md](Resultados_Pruebas_Generales/REVISION_FRONTEND_2026-11-16.md) |
| E2E con Playwright, ejecución local del 17-11-2026 | 21 aprobadas de 21 ejecutadas; 0 fallidas, 0 omitidas y 0 reintentos; 100 % de éxito sobre 21 casos | Siete casos se ejecutaron en cada uno de Chromium, Firefox y WebKit. Incluye el flujo de planificación, despacho y entrega, y la prueba de rendimiento. El reporte HTML y el JSON se generan en rutas ignoradas y el workflow los publicará como artefactos cuando se ejecute en GitHub Actions. | [Configuración Playwright](../../../Programa_Proyectos_2/Frontend/playwright.config.ts), [suite de sistema](../../../Programa_Proyectos_2/Frontend/e2e/system.spec.ts) y [suite de rendimiento](../../../Programa_Proyectos_2/Frontend/e2e/performance.spec.ts) |
| Rendimiento local, ejecución del 17-11-2026 | API `GET /health`: máximo de cinco muestras por navegador: Chromium 8,53 ms, Firefox 9,45 ms y WebKit 8,67 ms; todos bajo 500 ms. TTFB: 34 ms, 11 ms y 16 ms, respectivamente. | Duración de navegación: 1828,4 ms, 2284 ms y 1190 ms. FCP/LCP cuando estuvieron disponibles: Chromium 1900/1900 ms, Firefox 2310/2310 ms y WebKit 1378/1378 ms. Se midió únicamente con Vite en `127.0.0.1:5174` y FastAPI en `127.0.0.1:8011`; no acredita el rendimiento remoto, un SLA ni todos los endpoints. | [Prueba de rendimiento](../../../Programa_Proyectos_2/Frontend/e2e/performance.spec.ts) |
| Monitoreo puntual | 2 aprobadas y 1 omitida; 66,7 % de las tres pruebas planificadas se ejecutó y aprobó; 5,7 s de duración total | La prueba omitida requería credenciales. Los dos endpoints quedaron bajo 15 s, no bajo 500 ms. Es una observación puntual, no evidencia de uptime ni SLA. | [REVISION_FRONTEND_2026-11-16.md](Resultados_Pruebas_Generales/REVISION_FRONTEND_2026-11-16.md) |
| Calidad frontend | TypeScript, ESLint y compilación aprobados; 2 advertencias de Fast Refresh | No se registraron errores de ESLint en la ejecución descrita; las advertencias no se cuentan como pruebas fallidas. | [REVISION_FRONTEND_2026-11-16.md](Resultados_Pruebas_Generales/REVISION_FRONTEND_2026-11-16.md) |
| Dependencias npm | La auditoría histórica informa 0 vulnerabilidades conocidas entre 367 dependencias; `npm audit` del 17-11-2026 informó 17 vulnerabilidades altas, 0 críticas, 0 moderadas y 0 bajas. | Las 17 alertas afectan la cadena de herramientas: tres dependencias directas (`vite`, `tailwindcss` y `typescript-eslint`) y 14 transitivas. La salida ofrece corrección automática para parte del árbol, pero también propone `vite@6.2.7`; no se aplicó ninguna actualización automática porque requiere revisar compatibilidad y repetir la línea base. | [Auditoría histórica](Resultados_Pruebas_Generales/auditoria-npm.json) y [package-lock.json](../../../Programa_Proyectos_2/Frontend/package-lock.json) |
| CI/CD | `checks.yml` se activa en `push` y `pull_request`; valida rutas críticas y enlaces locales, ejecuta backend, frontend y E2E, e intenta publicar reportes E2E aun con fallos. La consulta pública del 17-11-2026 devolvió 0 ejecuciones de GitHub Actions. | La configuración es revisable, pero no acredita que un runner remoto haya instalado dependencias, ejecutado los jobs ni publicado artefactos. No se declara CI aprobado hasta contar con una ejecución verificable. | [Workflow de checks](../../../.github/workflows/checks.yml) |

Las fuentes históricas no incluyen TTFB, FCP, LCP ni tiempos de respuesta de API comparables con un umbral de 500 ms. La ejecución local del 17-11-2026 sí aporta esas mediciones bajo el alcance descrito en la tabla; no se extrapolan a producción ni a disponibilidad sostenida.

No se encontró registro de una demostración del Sprint 4 con fecha, entorno, participantes o retroalimentación. En consecuencia, esta revisión describe evidencia técnica y no afirma que se haya realizado una demostración o una aceptación por stakeholders.

La Definition of Done formal del Sprint 4 no está disponible en las fuentes revisadas. La evidencia técnica demuestra pruebas locales y de navegador declaradas, pero no sustituye el cierre en Jira, la aceptación de los criterios de usuario, una ejecución verificable de GitHub Actions ni una demostración registrada.

## Pendientes

- Completar y validar los criterios de aceptación pendientes de US-015 antes de cerrar la historia.
- Definir o vincular las historias US-021, US-022, US-023 y US-024 con sus criterios de aceptación, tareas y estado verificable en Jira.
- Ejecutar y conservar evidencia verificable de los workflows de GitHub Actions; las configuraciones existen, pero no hay ejecuciones públicas verificables al momento de esta revisión.
- Revisar las 17 vulnerabilidades altas de npm por compatibilidad de `vite`, `tailwindcss` y `typescript-eslint`; actualizar únicamente dependencias aprobadas y repetir `npm ci`, `scripts/check.ps1` y la suite E2E antes de declarar una corrección.
- Ejecutar la prueba de sesión real del monitor con una cuenta de prueba autorizada; la evidencia actual la reporta como omitida por ausencia de credenciales.
- Repetir las mediciones de Web Vitals y API en el entorno objetivo si se requiere evaluar rendimiento fuera del entorno local; la medición actual se limita a `GET /health` y a servicios locales.
- Revisar las migraciones y pruebas de RLS en un entorno PostgreSQL/Supabase desechable antes de cualquier despliegue.
