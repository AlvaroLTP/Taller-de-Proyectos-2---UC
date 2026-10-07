# Informe de estado del proyecto — Sprint 1

**Nombre del Proyecto:** EcoLogística Lima — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

**Sprint:** 1 — Gestión Core de Operaciones
**Fecha de actualización / corte de Jira:** 2026-10-06
**Versión:** 1.0.0

[Volver al README principal](../../../README.md)

## Objetivo y estado general

Contar con información básica y validada de vehículos, pedidos y conductores como entrada para la planificación de rutas.

El equipo informa que el frontend y el backend están desarrollados y que falta subir su versión completa a GitHub. Ese reporte se conserva como avance técnico declarado. El repositorio contiene un frontend del Sprint 1 en doc/Programa_Proyectos/Frontend/Programa_Sprint_1/project; la carpeta doc/Programa_Proyectos/backend contiene únicamente un README vacío al momento de esta revisión. Por tanto, el código completo pendiente de publicación no ha sido verificado desde Git.

Jira utiliza el tablero **KAN board**, que no admite sprints. La asignación a Sprint 1 sigue el documento de planificación del proyecto, no un campo Sprint de Jira. La épica de referencia es [KAN-2](https://continental-team-lz4401n3.atlassian.net/browse/KAN-2), en estado **En curso**, con fecha de inicio registrada **2026-08-31**. Esa fecha es de la épica; no constituye una fecha de cierre confirmada del sprint.

| Indicador | Resultado |
|---|---|
| Desarrollo frontend/backend | Terminado según reporte del equipo; versión completa pendiente de publicación |
| Cierre de historias en Jira | 1 de 9 historias finalizada (11,1 %); 7 en curso y 1 por hacer |
| Cierre documental del sprint | Pendiente de conciliar Jira, publicación y evidencias |

La proporción de historias finalizadas se calcula por conteo simple y excluye el enabler sin incidencia identificada. No representa el porcentaje de código desarrollado ni un avance ponderado por esfuerzo. Se retira el 70 % de los informes anteriores porque no estaba respaldado por una medición trazable. No se calcula desviación de cronograma sin fecha de cierre confirmada.

## Historias de Usuario completadas en este Sprint

Según Jira: **US-009 / KAN-24 — Validar información de conductores.** El estado Finalizada es evidencia de gestión; no sustituye resultados de pruebas o aceptación adjuntos.

### Alcance y trazabilidad

| Historia de planificación | Incidencia Jira | Funcionalidad | Estado consultado el 2026-10-06 |
|---|---|---|---|
| US-001 | [KAN-5](https://continental-team-lz4401n3.atlassian.net/browse/KAN-5) | Registrar vehículos de la flota | En curso |
| US-002 | [KAN-6](https://continental-team-lz4401n3.atlassian.net/browse/KAN-6) | Gestionar parámetros operativos y ambientales del vehículo | En curso |
| US-003 | [KAN-7](https://continental-team-lz4401n3.atlassian.net/browse/KAN-7) | Validar información de los vehículos registrados | En curso |
| US-004 | [KAN-8](https://continental-team-lz4401n3.atlassian.net/browse/KAN-8) | Registrar pedidos | En curso |
| US-005 | [KAN-9](https://continental-team-lz4401n3.atlassian.net/browse/KAN-9) | Registrar direcciones de entrega no convencionales | En curso |
| US-006 | [KAN-10](https://continental-team-lz4401n3.atlassian.net/browse/KAN-10) | Validar información de los pedidos | En curso |
| US-007 | [KAN-22](https://continental-team-lz4401n3.atlassian.net/browse/KAN-22) | Registrar conductores | En curso |
| US-008 | [KAN-23](https://continental-team-lz4401n3.atlassian.net/browse/KAN-23) | Gestionar disponibilidad de conductores | Tareas por hacer |
| US-009 | [KAN-24](https://continental-team-lz4401n3.atlassian.net/browse/KAN-24) | Validar información de conductores | Finalizada |

**Enabler previsto:** EN-002 — Implementar controles de seguridad. No se encontró una incidencia equivalente en el listado del proyecto KAN; su implementación no se considera verificada por Jira.

## Demostración del trabajo completado

La revisión documental no permite confirmar una demostración ante el docente o representantes del caso DistriRápido S.A.C. La siguiente secuencia sirve como guion de presentación del trabajo reportado; sus resultados deberán adjuntarse al realizar o documentar la sesión.

| Bloque | Demostración prevista | Evidencia que debe incorporarse |
|---|---|---|
| Vehículos (US-001 a US-003) | Registrar un vehículo, consultar capacidad y consumo, y rechazar datos inválidos. | Capturas del formulario y resultado; respuesta del backend y caso inválido. |
| Pedidos (US-004 a US-006) | Registrar un pedido con ubicación y dirección de referencia; comprobar campos obligatorios. | Capturas del pedido persistido y validaciones. |
| Conductores (US-007 a US-009) | Registrar un conductor, cambiar disponibilidad y comprobar validación de información. | Capturas del registro y de la disponibilidad; caso válido e inválido de KAN-24. |
| Seguridad (EN-002) | Comprobar acceso autorizado y rechazo de una operación sin permisos. | Resultado reproducible del control de acceso. |

**Responsable de consolidar la evidencia:** La Torre Párraga, Alvaro Andree, con apoyo de los responsables de cada historia en Jira. **Aceptación y observaciones del docente:** pendientes de registro; no se atribuyen comentarios ni aprobación a stakeholders sin un acta.

## Pendientes

1. Publicar la versión completa del frontend y backend desarrollados, con instrucciones de instalación, configuración y ejecución; excluir dependencias y credenciales mediante .gitignore.
2. Relacionar cada historia de este sprint con su commit y resultado de validación; conciliar con Jira las historias aún abiertas una vez revisada su evidencia.
3. Adjuntar resultados de los criterios de aceptación y del enabler del sprint. La ausencia de resultados en las fuentes consultadas es un pendiente de evidencia; no demuestra que el equipo no haya ejecutado pruebas.
4. Incorporar evidencia de la demostración: fecha, participantes, capturas o grabación y acuerdos. No se dispone de un acta que permita dar una demo por realizada o aceptada.

Alimentar el Sprint 2 con vehículos, pedidos y conductores válidos, conservando evidencia del cierre del núcleo operativo.

## Seguimiento de la entrega

| Actividad | Responsable propuesto | Momento objetivo | Criterio de cierre |
|---|---|---|---|
| Publicar código completo | Equipo de desarrollo; coordinación de Alvaro La Torre | Antes de la entrega académica del sprint | Commit accesible con frontend/backend e instrucciones |
| Conciliar estados y evidencias | Responsable de cada historia en Jira | Después de revisar la publicación | Historia enlazada con resultado y estado coherente |
| Documentar demo y aceptación | Líder y equipo | Durante la revisión con el docente | Acta, participantes y observaciones registradas |

Las fechas de entrega de los sprints no se encuentran confirmadas en las fuentes consultadas; los momentos anteriores son compromisos propuestos y no fechas históricas.

## Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0.0 | 2026-10-06 | Reorganización del documento del Sprint 1 y conciliación del avance con Jira y el reporte del equipo. |
