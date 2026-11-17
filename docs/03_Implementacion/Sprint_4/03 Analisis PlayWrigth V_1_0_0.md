# Análisis de pruebas con Playwright

**Proyecto:** EcoLogística Lima  
**Sprint:** 4  
**Alcance de la evidencia:** ejecución local del 17-11-2026 y configuración versionada de Playwright.

## Objetivo y alcance

Este documento analiza las pruebas E2E implementadas con Playwright para el frontend React/Vite y su integración local con FastAPI. Evalúa flujos funcionales críticos, manejo de errores, control de acceso y métricas puntuales de rendimiento. No acredita el funcionamiento de Supabase remoto, PostgreSQL, RLS, un despliegue productivo, un SLA ni disponibilidad sostenida.

La ejecución local usa Vite en `127.0.0.1:5174`, FastAPI en `127.0.0.1:8011`, SQLite desechable y un servicio HTTP local compatible con el flujo de identidad. Esta combinación permite validar la interfaz y la API real del backend en un entorno aislado, pero no sustituye las verificaciones con los servicios remotos.

## Configuración verificada

| Elemento | Configuración |
|---|---|
| Archivo de configuración | [playwright.config.ts](../../../Programa_Proyectos_2/Frontend/playwright.config.ts) |
| Directorio de pruebas | `Programa_Proyectos_2/Frontend/e2e` |
| Navegadores | Chromium, Firefox y WebKit |
| URL base | `http://127.0.0.1:5174` |
| Timeout global | 90 000 ms |
| Timeout de expectativas | 15 000 ms |
| Workers | 1, para evitar interferencia entre datos de prueba |
| Reintentos | 0 localmente; 1 en CI |
| Reporteros | Consola, HTML y JSON (`test-results/results.json`) |
| Diagnóstico ante fallo | Trace retenido y captura de pantalla solo ante fallo |

La configuración inicia FastAPI y Vite antes de la suite. En CI, el workflow instala Chromium, Firefox y WebKit, ejecuta `npm run test:e2e` y conserva `playwright-report` y `test-results` aun si la suite falla mediante `if: always()`; ver [checks.yml](../../../.github/workflows/checks.yml).

## Cobertura funcional

La suite tiene seis pruebas de sistema en [system.spec.ts](../../../Programa_Proyectos_2/Frontend/e2e/system.spec.ts) y una prueba de rendimiento en [performance.spec.ts](../../../Programa_Proyectos_2/Frontend/e2e/performance.spec.ts). Cada una se ejecuta en los tres navegadores configurados.

| Caso | Validación principal | Evidencia esperada |
|---|---|---|
| Credenciales inválidas | Rechazo de inicio de sesión y ausencia de navegación autenticada | Mensaje de error visible |
| CRUD de vehículos | Alta, edición, persistencia tras recarga y eliminación mediante FastAPI | Operaciones completadas sin errores de página |
| Navegación operativa | Carga de 14 pantallas de operaciones | Encabezado y navegación visibles, sin error JavaScript ni botón de reintento |
| Rol conductor | Restricción de navegación y rechazo de escritura en API | Pantallas limitadas y código HTTP 403 |
| Error temporal de API | Recuperación de un error HTTP 503 simulado | Mensaje de error y reintento exitoso |
| Planificación y entrega | Creación de datos aislados, planificación, despacho, cambio de sesión y confirmación de entrega | Ruta válida, pedido entregado y ruta finalizada |
| Rendimiento local | Disponibilidad de `/health`, navegación inicial y Web Vitals disponibles | HTTP correcto, métricas adjuntas al resultado JSON |

Los datos de planificación se aíslan por navegador y reintento. El flujo finaliza la ruta creada para no dejar un vehículo o conductor bloqueado para la siguiente ejecución.

## Resultados cuantitativos

La ejecución local del 17-11-2026 finalizó 21 de 21 pruebas: siete casos en cada navegador. No registró fallos, omisiones ni reintentos.

| Navegador | Ejecutadas | Aprobadas | Fallidas | Omitidas | Reintentos | Éxito |
|---|---:|---:|---:|---:|---:|---:|
| Chromium | 7 | 7 | 0 | 0 | 0 | 100 % |
| Firefox | 7 | 7 | 0 | 0 | 0 | 100 % |
| WebKit | 7 | 7 | 0 | 0 | 0 | 100 % |
| **Total** | **21** | **21** | **0** | **0** | **0** | **100 %** |

La duración total observada fue aproximadamente 3,2 minutos. El porcentaje se calcula como `21 aprobadas / 21 ejecutadas × 100`; no incluye pruebas no ejecutadas fuera de esta suite ni ejecuciones históricas distintas.

## Rendimiento local

La prueba toma cinco muestras consecutivas de `GET /health` por navegador y exige que el máximo observado sea menor que 500 ms. El umbral es exclusivo de este endpoint, estas cinco muestras y el entorno local descrito; no se aplica automáticamente a todos los endpoints ni a producción.

| Métrica | Chromium | Firefox | WebKit |
|---|---:|---:|---:|
| Muestras API `GET /health` | 5 | 5 | 5 |
| Máximo API observado | 8,53 ms | 9,45 ms | 8,67 ms |
| Criterio API local | < 500 ms | < 500 ms | < 500 ms |
| TTFB | 34 ms | 11 ms | 16 ms |
| Duración de navegación | 1828,4 ms | 2284 ms | 1190 ms |
| FCP | 1900 ms | 2310 ms | 1378 ms |
| LCP | 1900 ms | 2310 ms | 1378 ms |

Las quince muestras de API estuvieron bajo el criterio local. FCP y LCP se toman de la API Performance cuando el navegador las expone; la prueba registra `null` si LCP no está disponible, en lugar de asignar un valor artificial.

## Artefactos y CI

La ejecución produce:

- `Programa_Proyectos_2/Frontend/playwright-report/`: reporte HTML.
- `Programa_Proyectos_2/Frontend/test-results/results.json`: resultado estructurado y adjuntos, incluida la medición de rendimiento.
- Capturas de pantallas seleccionadas y trazas/capturas de fallos según la configuración.

Estas rutas están ignoradas por Git para no versionar resultados generados. El workflow [checks.yml](../../../.github/workflows/checks.yml) las publica como el artefacto `playwright-report` durante una ejecución remota, incluso si E2E falla. La existencia de la configuración no equivale a una ejecución CI aprobada: este documento no declara resultados remotos sin una ejecución y artefactos verificables en GitHub Actions.

## Limitaciones y acciones pendientes

- Ejecutar el workflow en GitHub Actions y conservar el enlace de la ejecución y sus artefactos antes de afirmar verificación remota.
- Ejecutar pruebas de autenticación real, PostgreSQL, RLS y Supabase con cuentas y entorno de prueba autorizados.
- Repetir las métricas en el entorno objetivo antes de usar los valores para decisiones de despliegue o un SLA.
- Recopilar varias ejecuciones comparables si se requiere analizar estabilidad, flakiness o tendencia de rendimiento.

Los resultados históricos de pruebas y su alcance complementario están en [Resultados_Pruebas_Generales](Resultados_Pruebas_Generales/). La revisión general del Sprint y la retrospectiva contienen la trazabilidad de historias, resultados de backend, CI y limitaciones: [Revisión del Sprint](01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) y [Retrospectiva del Sprint](02%20Retrospectiva%20del%20Sprint%20V_1_0_0.md).
