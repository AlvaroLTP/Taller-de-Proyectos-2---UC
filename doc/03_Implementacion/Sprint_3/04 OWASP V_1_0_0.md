# Reporte de Seguridad OWASP Top 10 (2025)

**Nombre del Proyecto:** EcoLogística Lima — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

**Sprint:** 3 — Visualización, Monitoreo, Sostenibilidad y Calidad

**Versión:** 1.0.0. **Actualización documental:** 2026-10-26.

[Volver al README principal](../../../README.md) · [Índice del Sprint 3](./README.md)

**Herramienta de Escaneo:** SonarQube / SonarCloud; pendiente de ejecución.

## 1. Matriz de Cumplimiento OWASP Top 10 2025

La consigna enumera categorías de 2021 bajo el título 2025. Se conserva el HTML original y se emplea la clasificación oficial [OWASP Top 10:2025](https://top10.owasp.org/2025/).

| Categoría OWASP 2025 | Estado en proyecto | Hallazgos de SonarQube |
|---|---|---|
| A01:2025 — Broken Access Control | Bajo revisión | Análisis pendiente |
| A02:2025 — Security Misconfiguration | Bajo revisión | Análisis pendiente |
| A03:2025 — Software Supply Chain Failures | Bajo revisión | Análisis pendiente |
| A04:2025 — Cryptographic Failures | Bajo revisión | Análisis pendiente |
| A05:2025 — Injection | Bajo revisión | Análisis pendiente |
| A06:2025 — Insecure Design | Bajo revisión | Análisis pendiente |
| A07:2025 — Authentication Failures | Bajo revisión | Análisis pendiente |
| A08:2025 — Software or Data Integrity Failures | Bajo revisión | Análisis pendiente |
| A09:2025 — Security Logging and Alerting Failures | Bajo revisión | Análisis pendiente |
| A10:2025 — Mishandling of Exceptional Conditions | Bajo revisión | Análisis pendiente |

### Correspondencia con la plantilla

| Categoría recibida | Correspondencia 2025 |
|---|---|
| A01 Broken Access Control | A01 |
| A02 Cryptographic Failures | A04 |
| A03 Injection | A05 |
| A04 Insecure Design | A06 |
| A05 Security Misconfiguration | A02 |
| A06 Vulnerable and Outdated Components | Revisar dentro de A03 |
| A07 Identification and Authentication Failures | A07 Authentication Failures |
| A08 Software and Data Integrity Failures | A08 |
| A09 Security Logging and Monitoring Failures | A09 Security Logging and Alerting Failures |
| A10 SSRF | Revisar dentro de A01; no sustituye A10:2025 |

## 2. Detalles de Security Hotspots y Vulnerabilidades Críticas

No se aportaron resultados de escaneo; no se declaran hallazgos concretos ni mitigaciones aplicadas.

| Registro | Archivo, línea y regla | Mitigación | Verificación |
|---|---|---|---|
| Pendiente del escaneo | Sin identificar | Por definir | Reanálisis y revisión manual |

Registrar commit, severidad, categoría, responsable y evidencia por hallazgo. Un análisis estático sin alertas no demuestra ausencia de riesgo en todas las categorías; complementar con pruebas de autorización, configuración, dependencias y ejecución.


## Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0.0 | 2026-10-26 | Creación conforme a consigna y estados de Jira. |
