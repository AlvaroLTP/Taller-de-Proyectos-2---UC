# Retrospectiva del sprint — Sprint 2

**Nombre del Proyecto:** EcoLogística Lima — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

**Sprint:** 2 — Motor de Optimización y Despacho

**Inicio:** 2026-09-22. **Hito de entrega previsto:** 2026-10-06.

**Versión:** 1.0.3. **Fecha de actualización documental:** 2026-10-06.

[Volver al README principal](../../../README.md)

## ¿Qué aprendimos?

Las preferencias de entrega y las restricciones configuradas no equivalen a un motor de optimización terminado: el cálculo debe demostrar que las respeta. Una salida de ruta requiere entradas, restricciones y resultado reproducibles, y los datos simulados de tráfico deben identificarse.

## ¿Qué estamos haciendo bien?

Se finalizaron KAN-25 y KAN-26 y se dispone del núcleo operativo del Sprint 1 completado. El alcance restante está identificado por claves Jira, lo que permite priorizar el cierre del motor y revisar las evidencias sin ampliar el alcance.

## ¿Qué podemos hacer mejor?

### Personas

Distribuir publicación y revisión entre los cuatro integrantes según sus horarios de clases y evaluaciones. El responsable de una historia prepara el resultado y otro compañero revisa su ejecución; el líder consolida la entrega. Así se evita que una sola persona acumule todo el trabajo de cierre.

### Relaciones

Dejar un mensaje breve al finalizar cada sesión con la clave Jira, el enlace al cambio y el siguiente paso. Registrar decisiones de configuración por escrito para que un compañero pueda continuar cuando los horarios no coincidan. Reservar una revisión conjunta corta para dudas que no puedan resolverse de forma asíncrona.

### Procesos

Cerrar el hito H-04 mediante resultados verificables de generación de rutas, restricciones y datos insuficientes. Distinguir código desarrollado de historia finalizada y publicar cambios durante la sesión de trabajo para que el tablero no quede separado del avance técnico.

### Herramientas

Usar las claves KAN en commits y enlazar evidencias en Jira. Mantener frontend y backend separados, el archivo .gitignore en la raíz y los documentos organizados por sprint. Los enlaces del README deben actualizarse junto con cada reorganización y los resultados de pruebas deben incluir el entorno utilizado.

### Acciones a realizar

| ID | Acción | Responsable | Momento objetivo | Estado | Evidencia de cierre |
|---|---|---|---|---|---|
| S2-ACT-01 | Publicar la versión completa y enlazar los cambios con Jira. | Equipo de desarrollo | Primera sesión de recuperación | Pendiente | Commit e instrucciones de ejecución |
| S2-ACT-02 | Revisar generación, restricciones y datos insuficientes: KAN-11, KAN-12 y KAN-13. | Augusto Guevara y Marvin Caldas, responsables en Jira | Primera sesión de recuperación | Pendiente de cierre | Entradas, rutas, validaciones y estados coherentes |
| S2-ACT-03 | Revisar tráfico de KAN-21 y adjuntar medición de EN-001. | Augusto Guevara, con apoyo del equipo | Segunda sesión de recuperación | Pendiente | Fuente de tráfico, entorno y tiempo de cálculo |
| S2-ACT-04 | Consolidar resultados y evidencia de presentación. | Alvaro La Torre y equipo | Final de la segunda sesión y revisión académica | Pendiente | Resultados, capturas y observaciones registradas |

## Historial de versiones

| Versión | Fecha de edición | Cambio |
|---|---|---|
| 1.0.0 | 2026-10-06 | Organización inicial de entregables. |
| 1.0.1 | 2026-10-06 | Corrección del estado del Sprint 1 y seguimiento del Sprint 2. |
| 1.0.2 | 2026-10-06 | Actualización de fechas, avance e historias de usuario. |
| 1.0.3 | 2026-10-06 | Adecuación del contenido a la plantilla del entregable. |
