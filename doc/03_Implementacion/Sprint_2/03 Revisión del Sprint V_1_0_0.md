# Revisión del sprint — Sprint 2

**Nombre del Proyecto:** EcoLogística Lima — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

**Sprint:** 2 — Motor de Optimización y Despacho

**Inicio según Jira:** 2026-09-22. **Hito previsto H-04 del cronograma:** 2026-10-06. **Estado de la iteración:** cierre parcial con retraso breve reportado.

**Fecha de revisión documental y consulta de Jira:** 2026-10-06. **Versión:** 1.0.2.

[Volver al README principal](../../../README.md)

## Estado del Sprint

Se completaron **US-010 / KAN-25** y **US-011 / KAN-26**, que figuran **Finalizadas** en Jira al corte del 6 de octubre de 2026. El Sprint 2 presenta un **cierre parcial con retraso breve**, porque KAN-11, KAN-12, KAN-13 y KAN-21 aún aparecen por hacer. El hito H-04 prevé para el 6 de octubre un prototipo funcional del motor de optimización y rutas multi-vehículo; el cierre registrado todavía no acredita ese resultado completo.

## Historias de Usuario completadas en este Sprint

Se completaron el registro de preferencias de entrega y la gestión de preferencias por horarios y restricciones. La tabla separa las dos historias finalizadas de las cuatro que aún tienen cierre pendiente.

| Historia | Jira | Funcionalidad | Estado actual en Jira |
|---|---|---|---|
| US-010 | [KAN-25](https://continental-team-lz4401n3.atlassian.net/browse/KAN-25) | Registrar preferencias de entrega | Finalizada |
| US-011 | [KAN-26](https://continental-team-lz4401n3.atlassian.net/browse/KAN-26) | Gestionar preferencias según horarios y restricciones | Finalizada |
| US-012 | [KAN-11](https://continental-team-lz4401n3.atlassian.net/browse/KAN-11) | Generar rutas optimizadas | Tareas por hacer |
| US-013 | [KAN-12](https://continental-team-lz4401n3.atlassian.net/browse/KAN-12) | Considerar restricciones en la planificación de rutas | Tareas por hacer |
| US-014 | [KAN-13](https://continental-team-lz4401n3.atlassian.net/browse/KAN-13) | Controlar la generación de rutas con datos insuficientes | Tareas por hacer |
| US-016 | [KAN-21](https://continental-team-lz4401n3.atlassian.net/browse/KAN-21) | Considerar información actualizada de tráfico | Tareas por hacer |

**EN-001 — Optimizar rendimiento:** previsto en la planificación; pendiente de adjuntar resultados de medición y confirmar su cierre. No se identificó una incidencia independiente de este enabler en Jira.

## Demostración del trabajo completado

El trabajo finalizado de esta iteración se concentra en las preferencias de entrega:

| Historia completada | Funcionalidad terminada | Recorrido de presentación | Evidencia pendiente de adjuntar |
|---|---|---|---|
| US-010 / KAN-25 | Registro de preferencias de entrega. | Registrar una preferencia y consultar la información guardada. | Capturas del registro y resultado de validación. |
| US-011 / KAN-26 | Gestión de preferencias según horarios y restricciones. | Configurar una ventana de atención y restricciones de entrega. | Capturas y caso de aceptación asociado a horarios y restricciones. |

La generación de rutas, aplicación de restricciones en el motor, control de datos insuficientes y uso de tráfico actualizado no se presentan como historias finalizadas en esta revisión. Permanecen en la lista de cierre del Sprint 2.

El contenido describe el trabajo terminado y el recorrido para presentarlo al docente y a los interesados del caso. No se aportó acta o grabación de una sesión: faltan registrar fecha, participantes, observaciones y evidencia de aceptación. No se atribuyen demostraciones ni aprobaciones no documentadas.

## Pendientes

1. **US-012 / KAN-11:** revisar y cerrar la generación de rutas optimizadas y multi-vehículo con un caso reproducible.
2. **US-013 / KAN-12:** comprobar capacidad y ventanas horarias en el resultado generado.
3. **US-014 / KAN-13:** comprobar el rechazo de datos insuficientes sin generar una ruta inválida.
4. **US-016 / KAN-21:** identificar la fuente y actualización del tráfico; distinguir datos reales y simulados.
5. **EN-001:** adjuntar tamaño del caso, entorno y duración del cálculo frente al objetivo de menos de 45 segundos del stack documentado.
6. Publicar la versión completa del frontend y backend reportados como desarrollados y asociar sus commits a Jira.

Se propone recuperar el cierre en las próximas **dos sesiones de trabajo**: primero publicar y revisar KAN-11, KAN-12 y KAN-13; después revisar KAN-21 y rendimiento y consolidar evidencias. El líder verifica los resultados antes de cerrar las historias. Es una meta de recuperación, no una duración histórica del retraso inferida de Jira. La reoptimización US-015 se mantiene en el Sprint 4 según la planificación previa.

## Resultado de la revisión

Se registran **KAN-25 y KAN-26 finalizadas**. El Sprint 2 conserva cierre parcial y retraso breve de entrega respecto al hito previsto, con cuatro historias por revisar y cerrar. No se certifica el prototipo completo del motor solo por haber alcanzado la fecha del cronograma.

Las fechas de inicio proceden de la épica KAN-3 en Jira; el hito del 6 de octubre procede del cronograma del acta. KAN-25 y KAN-26 están finalizadas al corte. No se atribuyen fechas individuales anteriores de culminación no confirmadas ni se presenta todo el Sprint 2 como finalizado.

## Historial de versiones

| Versión | Fecha de edición | Cambio |
|---|---|---|
| 1.0.0 | 2026-10-06 | Organización inicial y trazabilidad Jira. |
| 1.0.1 | 2026-10-06 | Corrección del estado del Sprint 1 y seguimiento del Sprint 2. |
| 1.0.2 | 2026-10-06 | Alineación con las plantillas, hitos del cronograma y estados actuales de Jira; fechas funcionales separadas de la edición documental. |
