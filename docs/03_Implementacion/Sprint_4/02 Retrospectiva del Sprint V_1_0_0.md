# Retrospectiva del sprint

**Nombre del Proyecto:** EcoLogística Lima

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

## ¿Qué aprendimos?

La evidencia técnica del Sprint 4 muestra que la integración de frontend, FastAPI y pruebas de navegador requiere distinguir entre una prueba aislada y una validación en servicios remotos. Las pruebas E2E usan FastAPI real con SQLite desechable y un proveedor de identidad simulado; por ello, no sustituyen las verificaciones de PostgreSQL, RLS ni Supabase remoto.

También se confirma que el monitoreo puntual no demuestra disponibilidad sostenida. La evidencia disponible informa dos comprobaciones de monitor aprobadas y una omitida por falta de credenciales de una cuenta real, sin historial de uptime ni métricas de Web Vitals.

## ¿Qué estamos haciendo bien?

- Se centralizaron las operaciones del frontend hacia FastAPI y se mantuvo Supabase para autenticación y perfil.
- La reoptimización cuenta con validaciones de factibilidad y regresiones documentadas sobre permisos, rutas iniciadas, preservación de identidad y rollback ante inviabilidad.
- Se incorporaron pruebas E2E que cubren un flujo transversal de planificación, despacho y confirmación de entrega, además de un caso de recuperación ante un error HTTP 503 simulado.
- Las dependencias, los resultados de pruebas y las limitaciones conocidas se registraron en evidencias versionadas del Sprint 4.

## ¿Qué podemos hacer mejor?

### Personas

No existe evidencia de una retrospectiva celebrada ni de observaciones individuales del equipo. Por ese motivo, no se atribuyen causas, desempeños, compromisos o responsabilidades personales.

### Relaciones

No se dispone de retroalimentación registrada de participantes, stakeholders o usuarios sobre el Sprint 4. La revisión posterior debe diferenciar claramente la retroalimentación de usuarios de los resultados técnicos de pruebas automatizadas.

### Procesos

El cierre de historias requiere enlazar criterios de aceptación, evidencia técnica y estado en Jira. US-015 tiene evidencia de avance técnico, pero se informa al 80 % y no debe marcarse como cerrada. Las historias US-021 a US-024 se informan al 50 %, sin definición ni criterios localizables en las fuentes revisadas.

La trazabilidad de CI debe completarse con ejecuciones verificables. Los workflows están configurados, pero no existe una ejecución pública registrada que demuestre su funcionamiento.

### Herramientas

Playwright aporta cobertura E2E y de monitoreo. La ejecución local del 17-11-2026 configuró Chromium, Firefox y WebKit; produjo reportes HTML y JSON en rutas ignoradas, preparados para su publicación como artefactos cuando el workflow se ejecute en GitHub Actions. Esto no sustituye una ejecución remota verificable ni un historial de disponibilidad.

Los resultados declarados permiten una lectura cuantitativa acotada: la ejecución histórica informó seis pruebas E2E aprobadas, sin fallos ni reintentos, en 63,3 s; la ejecución local del 17-11-2026 aprobó 21 de 21 casos (100 % sobre los 21 ejecutados), distribuidos en siete casos por Chromium, Firefox y WebKit, sin fallos, omisiones ni reintentos. Esta última ejecución midió cinco solicitudes locales a `GET /health` por navegador: los máximos fueron 8,53 ms, 9,45 ms y 8,67 ms, por debajo del criterio local de 500 ms. También registró TTFB, duración de navegación, FCP y LCP; el alcance se limita a Vite y FastAPI locales, por lo que no demuestra un SLA ni el rendimiento de todos los endpoints. La línea base sin E2E del mismo día aprobó 110 pruebas backend en 5,78 s, con 75 % de cobertura, y aprobó typecheck, lint y build del frontend; ESLint mantuvo dos advertencias Fast Refresh sin errores y el bundle inicial quedó en 456,84 kB (133,80 kB gzip). En el monitor histórico, dos pruebas fueron aprobadas y una omitida, equivalente a 66,7 % de las tres pruebas planificadas ejecutadas y aprobadas. Este porcentaje no mide disponibilidad del sistema. Las fuentes también difieren entre 99, 107 y 110 pruebas Python aprobadas y entre 77 %, 78 %, 76 % y 75 % de cobertura, porque corresponden a ejecuciones distintas; no deben consolidarse como un único resultado final. El detalle histórico está en [Resultados de pruebas](Resultados_Pruebas_Generales/RESULTADOS_PRUEBAS.txt), [auditoría del sistema](Resultados_Pruebas_Generales/AUDITORIA_SISTEMA.md), [revisión backend](Resultados_Pruebas_Generales/REVISION_BACKEND.md) y [revisión frontend](Resultados_Pruebas_Generales/REVISION_FRONTEND_2026-11-16.md). La implementación y el alcance de la medición reciente se encuentran en la [configuración Playwright](../../../Programa_Proyectos_2/Frontend/playwright.config.ts), la [prueba de rendimiento](../../../Programa_Proyectos_2/Frontend/e2e/performance.spec.ts) y el [script de verificación](../../../Programa_Proyectos_2/scripts/check.ps1).

La auditoría npm conservada informa cero vulnerabilidades conocidas y 367 dependencias registradas; su detalle está en [auditoria-npm.json](Resultados_Pruebas_Generales/auditoria-npm.json). La ejecución actual de `npm audit` del 17-11-2026 reportó 17 vulnerabilidades altas, sin vulnerabilidades críticas, moderadas ni bajas. Tres dependencias directas participan en el árbol afectado (`vite`, `tailwindcss` y `typescript-eslint`) y 14 son transitivas. La corrección disponible no se aplicó de forma automática porque una de las propuestas altera Vite a `6.2.7`; antes de cualquier cambio se debe revisar la compatibilidad y repetir `npm ci`, `scripts/check.ps1` y las pruebas E2E. Ambos resultados dependen de la base de avisos vigente en su fecha y no sustituyen una evaluación de seguridad integral.

El workflow `checks.yml` ya se activa en `push` y `pull_request`, valida rutas críticas y enlaces locales, ejecuta las verificaciones y conserva reportes E2E aun cuando la suite falle. No obstante, la consulta pública del 17-11-2026 registró cero ejecuciones de GitHub Actions; la configuración todavía no es evidencia de una ejecución remota satisfactoria.

Las pruebas locales de Python usan SQLite; las verificaciones pendientes de RLS, concurrencia y comportamiento específico de PostgreSQL deben ejecutarse en un entorno desechable antes de una liberación.

### Acciones a realizar

No se documentaron acuerdos de retrospectiva, responsables asignados ni fechas de seguimiento. Por tanto, no se registran acciones SMART como compromisos aprobados.

Para registrar una acción SMART de forma válida en una reunión posterior se requiere documentar la acción específica, el responsable aceptado, la métrica de resultado, el plazo de seguimiento y la evidencia que permitirá comprobar su cumplimiento.
