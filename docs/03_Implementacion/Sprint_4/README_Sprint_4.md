# Sprint 4 — Implementación | EcoLogística Lima

> **Proyecto:** EcoLogística Lima  
> **Fase:** 03 — Implementación  
> **Iteración:** Sprint 4  
> **Líder del proyecto:** La Torre Párraga, Alvaro Andree  
> **Versión del índice:** 1.0.0  
> **Fecha de actualización:** 17 de noviembre de 2026

## Descripción general

Esta carpeta centraliza la documentación de revisión, retrospectiva y evidencias técnicas del **Sprint 4** de EcoLogística Lima. El objetivo de esta iteración es consolidar la integración de la interfaz web y la API, fortalecer las validaciones y la seguridad, y documentar las pruebas y los aspectos pendientes de aceptación.

Este README funciona como **índice navegable** para localizar los entregables, consultar los resultados de prueba y acceder a las fases y sprints relacionados. Los enlaces internos son relativos a esta carpeta y se pueden abrir directamente desde GitHub.

## Índice de contenidos

1. [Descripción general](#descripción-general)
2. [Documentación principal del Sprint 4](#documentación-principal-del-sprint-4)
3. [Evidencias y resultados de pruebas](#evidencias-y-resultados-de-pruebas)
4. [Resumen técnico y funcional](#resumen-técnico-y-funcional)
5. [Resultados de verificación](#resultados-de-verificación)
6. [Estado de historias de usuario](#estado-de-historias-de-usuario)
7. [Riesgos y actividades pendientes](#riesgos-y-actividades-pendientes)
8. [Estructura de la carpeta](#estructura-de-la-carpeta)
9. [Navegación entre sprints y fases](#navegación-entre-sprints-y-fases)
10. [Equipo del proyecto](#equipo-del-proyecto)
11. [Control documental](#control-documental)

## Documentación principal del Sprint 4

| N.º | Entregable | Descripción | Versión | Acceso |
|:--:|---|---|:--:|---|
| 01 | **Revisión del Sprint** | Estado de historias, demostración técnica documentada, métricas de prueba, limitaciones y pendientes de aceptación. | 1.0.0 | [Ver revisión](01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) |
| 02 | **Retrospectiva del Sprint** | Aprendizajes, fortalezas, oportunidades de mejora y acciones aún no formalizadas del equipo. | 1.0.0 | [Ver retrospectiva](02%20Retrospectiva%20del%20Sprint%20V_1_0_0.md) |

> **Nota:** La existencia de los documentos no equivale a la aceptación formal de las historias ni a la celebración acreditada de una reunión con stakeholders. Consultar los límites de evidencia en la revisión y retrospectiva.

## Evidencias y resultados de pruebas

La subcarpeta [**Resultados_Pruebas_Generales**](Resultados_Pruebas_Generales/) reúne los archivos técnicos usados para justificar la evaluación del Sprint 4.

| Archivo | Contenido o propósito | Enlace |
|---|---|---|
| `AUDITORIA_SISTEMA.md` | Auditoría histórica de seguridad, integración y calidad del sistema; consultar junto con las revisiones posteriores. | [Abrir](Resultados_Pruebas_Generales/AUDITORIA_SISTEMA.md) |
| `RESULTADOS_PRUEBAS.txt` | Registro histórico de resultados de pruebas y salidas de verificación. | [Abrir](Resultados_Pruebas_Generales/RESULTADOS_PRUEBAS.txt) |
| `REVISION_BACKEND.md` | Evaluación de FastAPI, reoptimización, persistencia, seguridad, migraciones y pruebas del backend. | [Abrir](Resultados_Pruebas_Generales/REVISION_BACKEND.md) |
| `REVISION_FRONTEND_2026-11-16.md` | Integración frontend–API, autenticación, flujos E2E, monitoreo y limitaciones del entorno. | [Abrir](Resultados_Pruebas_Generales/REVISION_FRONTEND_2026-11-16.md) |
| `auditoria-npm.json` | Instantánea histórica de auditoría de dependencias JavaScript. | [Abrir](Resultados_Pruebas_Generales/auditoria-npm.json) |
| `auditoria-python.json` | Instantánea histórica de auditoría de dependencias Python. | [Abrir](Resultados_Pruebas_Generales/auditoria-python.json) |

**Importante:** Estos archivos corresponden a distintas fechas y ejecuciones. No se deben sumar los casos de prueba ni mezclar sus coberturas o resultados de vulnerabilidades para inferir una única ejecución consolidada.

## Resumen técnico y funcional

Durante el Sprint 4 se documentaron los siguientes avances de implementación y verificación:

- **Integración de componentes:** operaciones del frontend centralizadas hacia **FastAPI**; **Supabase** se mantiene para autenticación y perfil de usuario.
- **Gestión de rutas:** implementación parcial del flujo de reoptimización mediante `POST /api/v1/routes/{id}/reoptimize`, con restricciones de estado, permisos y conservación de la planificación anterior en casos inviables.
- **Calidad y validación:** pruebas automatizadas de backend y pruebas end-to-end con **Playwright** para flujos operativos y restricciones por rol.
- **Seguridad:** revisión de autorizaciones, dependencias y migraciones; la validación remota de RLS y ciertas migraciones continúa pendiente.
- **Monitoreo:** comprobaciones puntuales de servicios; no constituyen evidencia de disponibilidad sostenida ni de un SLA en producción.

Para el sustento completo de cada punto, revisar [Revisión del Sprint](01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) y las [evidencias técnicas](Resultados_Pruebas_Generales/).

## Resultados de verificación

| Área | Resultado documentado | Alcance / precaución |
|---|---|---|
| Backend, línea base local del 17/11/2026 | **110 pruebas aprobadas; 75 % de cobertura**. | Ejecución local; no prueba permisos RLS en PostgreSQL remoto. |
| E2E, ejecución local del 17/11/2026 | **21/21 pruebas aprobadas** en Chromium, Firefox y WebKit; 0 fallos. | Siete pruebas por navegador; entorno local con servicios de prueba. |
| Frontend | Comprobaciones TypeScript, ESLint y compilación aprobadas. | Se registran dos advertencias Fast Refresh, sin errores de ESLint. |
| Rendimiento local | Comprobaciones de `GET /health` por debajo del umbral local de 500 ms. | No permite afirmar tiempos de respuesta para toda la API ni desempeño en producción. |
| Monitoreo histórico | **2 pruebas aprobadas y 1 omitida** por falta de credenciales. | No constituye medición de uptime ni validación de sesión real. |
| Auditoría npm del 17/11/2026 | **17 vulnerabilidades altas** y ninguna crítica. | El archivo JSON archivado registra una auditoría histórica con cero hallazgos: son evaluaciones de momentos distintos. |
| CI/CD | Workflow configurado para ejecutar verificaciones. | La revisión no acredita una ejecución remota satisfactoria en GitHub Actions. |

**Fuentes:** [Revisión del Sprint](01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md), [Retrospectiva](02%20Retrospectiva%20del%20Sprint%20V_1_0_0.md), [Revisión backend](Resultados_Pruebas_Generales/REVISION_BACKEND.md) y [Revisión frontend](Resultados_Pruebas_Generales/REVISION_FRONTEND_2026-11-16.md).

## Estado de historias de usuario

La revisión del Sprint 4 **no acredita historias formalmente aceptadas en Jira**. Los porcentajes siguientes son estados informados, no actas de aceptación:

| Historia | Avance informado | Estado de aceptación |
|---|:--:|---|
| `US-015` — Reoptimizar rutas ante cambios operativos | **80 %** | En progreso; falta comprobar todos los criterios y aceptación. |
| `US-021` | **50 %** | En progreso; definición y criterios no localizados en las fuentes revisadas. |
| `US-022` | **50 %** | En progreso; definición y criterios no localizados en las fuentes revisadas. |
| `US-023` | **50 %** | En progreso; definición y criterios no localizados en las fuentes revisadas. |
| `US-024` | **50 %** | En progreso; definición y criterios no localizados en las fuentes revisadas. |

Consultar el [detalle de historias y evidencias](01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md#historias-de-usuario-completadas-en-este-sprint).

## Riesgos y actividades pendientes

1. Completar y validar los criterios de aceptación de `US-015`, y verificar el estado de `US-021` a `US-024` en Jira.
2. Conservar evidencia de demostración, retroalimentación y aceptación del incremento si estas actividades se realizan.
3. Ejecutar y registrar **GitHub Actions** en un runner remoto para respaldar los controles de CI/CD.
4. Evaluar y corregir de forma controlada las **17 alertas altas de npm** informadas el 17/11/2026; repetir las verificaciones tras los cambios.
5. Validar migraciones, restricciones y políticas **RLS** sobre un entorno PostgreSQL/Supabase desechable antes de despliegues.
6. Repetir las pruebas de sesión con cuenta real autorizada y los controles de rendimiento en el entorno objetivo.
7. Formalizar acciones de retrospectiva con responsables, métricas y plazos cuando existan acuerdos de equipo.

El detalle de riesgos técnicos se encuentra en la [Revisión del Sprint](01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md#pendientes) y en la [Retrospectiva](02%20Retrospectiva%20del%20Sprint%20V_1_0_0.md#acciones-a-realizar).

## Estructura de la carpeta

```text
Sprint_4/
├── README.md
├── 01 Revisión del Sprint V_1_0_0.md
├── 02 Retrospectiva del Sprint V_1_0_0.md
└── Resultados_Pruebas_Generales/
    ├── AUDITORIA_SISTEMA.md
    ├── RESULTADOS_PRUEBAS.txt
    ├── REVISION_BACKEND.md
    ├── REVISION_FRONTEND_2026-11-16.md
    ├── auditoria-npm.json
    └── auditoria-python.json
```

## Navegación entre sprints y fases

### Sprints de implementación

| Etapa | Acceso |
|---|---|
| Sprint 1 | [Ir a Sprint 1](../Sprint_1/) |
| Sprint 2 | [Ir a Sprint 2](../Sprint_2/) |
| Sprint 3 | [Ir a Sprint 3](../Sprint_3/) |
| **Sprint 4 (actual)** | [Volver al inicio de este README](#sprint-4--implementación--ecologística-lima) |
| Índice de implementación | [Ir a 03_Implementacion](../) |

### Otras fases y código fuente

| Recurso | Acceso |
|---|---|
| Inicio del proyecto | [01_Inicio](../../01_Inicio/) |
| Planificación | [02_Planficacion](../../02_Planficacion/) |
| Código fuente del sistema | [Programa_Proyectos_2](../../../Programa_Proyectos_2/) |
| Página principal del repositorio | [README principal](../../../README.md) |

## Equipo del proyecto

**Líder del proyecto:** La Torre Párraga, Alvaro Andree.

**Integrantes:** Caldas Alanya, Marvin Usias; Guevara Chamorro, Augusto Jose; La Torre Párraga, Alvaro Andree; Yanarico Ticona, Ivan Josue.

## Control documental

| Campo | Valor |
|---|---|
| Documento | Índice y guía de navegación del Sprint 4 |
| Archivo | `docs/03_Implementacion/Sprint_4/README.md` |
| Versión | 1.0.0 |
| Fecha | 17/11/2026 |
| Estado | Índice documental basado en evidencias del repositorio; aceptación formal pendiente de verificación |
| Propósito | Centralizar entregables, evidencias técnicas, resultados y enlaces de navegación |

---

[**Volver al índice**](#índice-de-contenidos) · [**Ir a implementación**](../) · [**Ir al repositorio principal**](../../../README.md)
