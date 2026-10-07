# Revisión del sprint — Sprint 2

**Nombre del Proyecto:** EcoLogística Lima — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

**Sprint:** 2 — Motor de Optimización y Despacho
**Fecha de actualización / corte de Jira:** 2026-10-06
**Versión:** 1.0.0

[Volver al README principal](../../../README.md)

## Objetivo de la revisión

Generar rutas optimizadas considerando preferencias, horarios y restricciones operativas, y controlar la generación cuando los datos son insuficientes.

El equipo informa que el frontend y el backend están desarrollados y que falta subir su versión completa a GitHub. Ese reporte se conserva como avance técnico declarado. El repositorio contiene un frontend del Sprint 1 en doc/Programa_Proyectos/Frontend/Programa_Sprint_1/project; la carpeta doc/Programa_Proyectos/backend contiene únicamente un README vacío al momento de esta revisión. Por tanto, el código completo pendiente de publicación no ha sido verificado desde Git.

Jira utiliza el tablero **KAN board**, que no admite sprints. La asignación a Sprint 2 sigue el documento de planificación del proyecto, no un campo Sprint de Jira. La épica de referencia es [KAN-3](https://continental-team-lz4401n3.atlassian.net/browse/KAN-3), en estado **En curso**, con fecha de inicio registrada **2026-09-22**. Esa fecha es de la épica; no constituye una fecha de cierre confirmada del sprint.

## Historias de Usuario completadas en este Sprint

**Finalizadas en Jira:** US-010 / KAN-25 — Registrar preferencias de entrega; US-011 / KAN-26 — Gestionar preferencias según horarios y restricciones.

| Historia de planificación | Incidencia Jira | Funcionalidad | Estado consultado el 2026-10-06 |
|---|---|---|---|
| US-010 | [KAN-25](https://continental-team-lz4401n3.atlassian.net/browse/KAN-25) | Registrar preferencias de entrega | Finalizada |
| US-011 | [KAN-26](https://continental-team-lz4401n3.atlassian.net/browse/KAN-26) | Gestionar preferencias según horarios y restricciones | Finalizada |
| US-012 | [KAN-11](https://continental-team-lz4401n3.atlassian.net/browse/KAN-11) | Generar rutas optimizadas | Tareas por hacer |
| US-013 | [KAN-12](https://continental-team-lz4401n3.atlassian.net/browse/KAN-12) | Considerar restricciones en la planificación de rutas | Tareas por hacer |
| US-014 | [KAN-13](https://continental-team-lz4401n3.atlassian.net/browse/KAN-13) | Controlar la generación de rutas con datos insuficientes | Tareas por hacer |
| US-016 | [KAN-21](https://continental-team-lz4401n3.atlassian.net/browse/KAN-21) | Considerar información actualizada de tráfico | Tareas por hacer |

**Enabler previsto:** EN-001 — Optimizar rendimiento. No se encontró una incidencia equivalente en el listado del proyecto KAN; su implementación no se considera verificada por Jira.

**Resumen de cierre:** 2 de 6 historias finalizadas (33,3 %); 4 por hacer. Las historias aún abiertas requieren conciliación con el trabajo que el equipo reporta terminado; no se presentan como funcionalidades sin desarrollar por el solo estado del tablero.

## Demostración del trabajo completado

La revisión documental no permite confirmar una demostración ante el docente o representantes del caso DistriRápido S.A.C. La siguiente secuencia sirve como guion de presentación del trabajo reportado; sus resultados deberán adjuntarse al realizar o documentar la sesión.

| Bloque | Demostración prevista | Evidencia que debe incorporarse |
|---|---|---|
| Preferencias (US-010 y US-011) | Registrar preferencias y horarios de entrega y consultar su persistencia. | Capturas y casos de aceptación vinculados a KAN-25 y KAN-26. |
| Optimización (US-012 y US-013) | Generar una ruta con pedidos válidos y verificar capacidad y ventanas horarias. | Entradas, salida, restricciones verificadas y duración de ejecución. |
| Datos insuficientes (US-014) | Intentar generar una ruta sin vehículos disponibles o con un pedido incompleto. | Mensaje de rechazo y respuesta del servicio, sin generar una ruta inválida. |
| Tráfico (US-016) | Identificar la fuente y fecha de los datos de tráfico utilizados en el cálculo. | Registro de origen y actualización; si son simulados, indicarlo expresamente. |
| Rendimiento (EN-001) | Medir el cálculo sobre un conjunto de pedidos definido. | Tamaño del conjunto, entorno y tiempo medido, comparado con el objetivo documentado de menos de 45 segundos. |

**Responsable de consolidar la evidencia:** La Torre Párraga, Alvaro Andree, con apoyo de los responsables de cada historia en Jira. **Aceptación y observaciones del docente:** pendientes de registro; no se atribuyen comentarios ni aprobación a stakeholders sin un acta.

## Pendientes

1. Publicar la versión completa del frontend y backend desarrollados, con instrucciones de instalación, configuración y ejecución; excluir dependencias y credenciales mediante .gitignore.
2. Relacionar cada historia de este sprint con su commit y resultado de validación; conciliar con Jira las historias aún abiertas una vez revisada su evidencia.
3. Adjuntar resultados de los criterios de aceptación y del enabler del sprint. La ausencia de resultados en las fuentes consultadas es un pendiente de evidencia; no demuestra que el equipo no haya ejecutado pruebas.
4. Incorporar evidencia de la demostración: fecha, participantes, capturas o grabación y acuerdos. No se dispone de un acta que permita dar una demo por realizada o aceptada.

Entregar al siguiente sprint las rutas y sus resultados verificables para visualización y monitoreo. La reoptimización US-015 se conserva en el Sprint 4 según la planificación previa.

## Resultado de la revisión documental

El alcance está identificado y el equipo reporta la implementación del frontend y backend. La entrega del sprint queda pendiente de publicación completa, evidencia por historia y registro de aceptación. La revisión documental realizada el 2026-10-06 no equivale a una sesión de Sprint Review con stakeholders ni certifica resultados de ejecución.

## Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0.0 | 2026-10-06 | Creación del documento del Sprint 2 con alcance, estado de Jira y pendientes de entrega. |
