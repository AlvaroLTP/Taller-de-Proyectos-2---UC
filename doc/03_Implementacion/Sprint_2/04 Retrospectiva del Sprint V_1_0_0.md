# Retrospectiva del sprint — Sprint 2

**Nombre del Proyecto:** EcoLogística Lima — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

**Sprint:** 2 — Motor de Optimización y Despacho
**Fecha de actualización / corte de Jira:** 2026-10-06
**Versión:** 1.0.1

[Volver al README principal](../../../README.md)

## Contexto

Esta retrospectiva recoge conclusiones de la revisión de Jira, Git y el avance reportado por el equipo. Las acciones son propuestas para discutir en la reunión del equipo; no se inventa una reunión, votación ni acuerdos ya ejecutados. Desarrollo reportado: frontend y backend terminados; entrega completa en Git pendiente. Cierre en Jira: 2 de 6 historias finalizadas (33,3 %); 4 por hacer.

## ¿Qué aprendimos?

Una ruta generada necesita evidencia de que respeta capacidad y horarios; mostrar una salida no demuestra por sí solo que el resultado es válido. Los datos simulados de tráfico deben diferenciarse de una fuente actualizada.

## ¿Qué estamos haciendo bien?

El alcance se encuentra desglosado en historias identificables, el equipo cuenta con Jira y un repositorio común, y ha informado el avance técnico y la publicación pendiente. Las historias finalizadas consultadas son: US-010 / KAN-25 — Registrar preferencias de entrega; US-011 / KAN-26 — Gestionar preferencias según horarios y restricciones. Esto permite priorizar la entrega y revisar evidencias sin ampliar el alcance de la iteración.

## ¿Qué podemos hacer mejor?

### Personas

Planificar bloques de trabajo según los horarios de clases y evaluaciones de los cuatro integrantes. Proponer que cada responsable de Jira prepare la evidencia de sus historias y otro compañero revise la ejecución; el líder consolida la entrega, evitando concentrar todas las revisiones en una sola persona. Esta distribución es una mejora propuesta, no un bloqueo personal confirmado.

### Relaciones

Mantener un mensaje breve al terminar cada sesión: historia atendida, enlace al cambio y siguiente paso. Si no se coincide en horarios, dejar decisiones por escrito y reservar una revisión conjunta corta para dudas de integración. El aviso de “terminado” debe indicar si el código está local, publicado o aceptado.

### Procesos

Las preferencias de entrega están finalizadas en Jira, pero las historias del motor aún aparecen por hacer. El cierre debe reconciliar ese registro con el código que el equipo informa terminado, usando casos reproducibles por historia.

Incluir publicación, validaciones y evidencia de demo en la lista de cierre. No es necesario volver a implementar lo que ya está terminado; corresponde entregar la versión correcta y comprobar su trazabilidad.

### Herramientas

Usar el identificador KAN de la historia en commits y enlazarlo en Jira. El tablero actual no admite sprints, por lo que se mantiene explícito el mapeo académico en la documentación. La organización de carpetas distingue las dos iteraciones y el .gitignore raíz excluye dependencias, temporales y variables de entorno de futuras publicaciones.

### Acciones a realizar

| ID | Acción propuesta | Relación | Responsable propuesto | Momento objetivo | Evidencia de cierre |
|---|---|---|---|---|---|
| S2-ACT-01 | Repartir publicación y revisión en bloques compatibles con los horarios académicos. | Organización del equipo | Alvaro La Torre y los cuatro integrantes | Antes de consolidar la entrega | Responsables y bloques acordados por escrito |
| S2-ACT-02 | Subir la versión completa y documentar instalación y configuración. | S2-IMP-01 | Equipo de desarrollo | Antes de la entrega académica | Commit con ambos componentes y ejecución reproducible |
| S2-ACT-03 | Revisar cada historia con su caso de aceptación y conciliar Jira. | S2-IMP-02 | Responsable de cada historia y compañero revisor | Después de la publicación | Enlace al commit, resultado y estado coherente |
| S2-ACT-04 | Registrar la demo, observaciones y decisiones del docente. | Evidencia de revisión | Líder y equipo | En la próxima revisión académica | Acta y capturas o grabación |

## Verificación en la siguiente revisión

Comprobar si ambos componentes están publicados, si cada historia tiene evidencia asociada y si Jira refleja lo validado. Revisar las acciones abiertas en una reunión breve; registrar fechas reales solo cuando se ejecuten. Entregar al siguiente sprint las rutas y sus resultados verificables para visualización y monitoreo. La reoptimización US-015 se conserva en el Sprint 4 según la planificación previa.

## Avance y retraso breve del Sprint 2

El Sprint 1 está completado al 2026-10-06 según el líder. El Sprint 2 permanece **en proceso de cierre, con un retraso breve de entrega reportado por el líder**. Jira confirma US-010/KAN-25 y US-011/KAN-26 finalizadas; US-012/KAN-11, US-013/KAN-12, US-014/KAN-13 y US-016/KAN-21 siguen por hacer. No se declaran estas cuatro historias cerradas mientras el tablero y sus evidencias no se concilien.

El equipo informa el frontend y backend desarrollados. El pendiente inmediato es publicar la versión completa y revisar el cierre de generación de rutas, restricciones, datos insuficientes y tráfico. Las mediciones de EN-001 también deben adjuntarse. El 33,3 % expresa dos de seis historias cerradas en Jira, no el porcentaje del código desarrollado ni la duración del retraso.

**Plan de recuperación propuesto:** consolidar publicación y revisión de evidencias durante las próximas dos sesiones de trabajo del equipo, compatibles con clases y evaluaciones. Priorizar KAN-11, KAN-12 y KAN-13, y después KAN-21 y la medición de rendimiento. El líder revisa el resultado al final de la segunda sesión y acuerda el cierre. Las dos sesiones son una meta de recuperación; no una duración histórica del retraso calculada desde Jira.

## Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0.0 | 2026-10-06 | Creación del documento del Sprint 2 con alcance, estado de Jira y pendientes de entrega. |
| 1.0.1 | 2026-10-06 | Sprint 1 completado y Sprint 2 con retraso breve de entrega reportado; plan de recuperación y estados Jira conservados. |
