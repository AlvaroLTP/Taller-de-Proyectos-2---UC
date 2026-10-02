# Retrospectiva del sprint

**Nombre del Proyecto:** EcoLogística Lima — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

## ¿Qué aprendimos?

El Sprint 1 alcanzó aproximadamente un **70 % de avance**, permitiendo identificar aspectos positivos y oportunidades de mejora antes de completar el 30 % restante.

El principal aprendizaje fue que avanzar en el análisis y desarrollo de funcionalidades no es suficiente si la integración, las pruebas y las evidencias técnicas se dejan para la parte final del Sprint.

También se identificó que la Definition of Done debe aplicarse progresivamente y no solamente durante el cierre de la iteración.

La integración entre Jira, GitHub y la documentación debe acompañar al desarrollo para mantener una trazabilidad verificable.

Finalmente, el equipo identificó la importancia de limitar el trabajo simultáneo y priorizar la finalización de las Historias de Usuario iniciadas.

## ¿Qué estamos haciendo bien?

- Se alcanzó aproximadamente el 70 % del objetivo previsto para el Sprint 1.
- Existe una planificación clara de las funcionalidades principales.
- Se avanzó en las capacidades relacionadas con vehículos, pedidos y conductores.
- Los requisitos funcionales se encuentran asociados a Historias de Usuario.
- Se cuenta con criterios de aceptación y una Definition of Done.
- Existen documentos de arquitectura, base de datos, riesgos y presupuesto que sirven de soporte al desarrollo.
- Los impedimentos del Sprint están siendo identificados antes del inicio del Motor de Optimización.
- El equipo mantiene una orientación clara hacia el objetivo principal del proyecto.

## ¿Qué podemos hacer mejor?

### Personas

El equipo debe concentrar sus esfuerzos en completar el trabajo iniciado antes de asumir nuevas funcionalidades.

Se requiere mejorar la coordinación entre desarrollo y QA para que las pruebas se ejecuten de manera paralela al desarrollo.

También debe quedar claramente definido quién es responsable de implementar, revisar y validar cada Historia de Usuario.

### Relaciones

Debe fortalecerse la comunicación entre los responsables de Jira, documentación y GitHub.

Los cambios realizados en una Historia de Usuario deben reflejarse de manera consistente en las demás herramientas.

Es recomendable realizar revisiones internas breves para detectar bloqueos de integración antes del cierre del Sprint.

### Procesos

La principal oportunidad de mejora consiste en no dejar para el final del Sprint la integración de frontend, backend, pruebas y seguridad.

La Definition of Done debe verificarse progresivamente.

También se debe reducir el trabajo en progreso y evitar iniciar funcionalidades del Sprint 2 hasta completar las actividades críticas del Sprint 1.

Los impedimentos identificados deben revisarse periódicamente hasta su cierre.

### Herramientas

Se requiere consolidar la estructura de implementación del repositorio mediante una separación clara entre frontend y backend.

También debe incorporarse un `.gitignore` apropiado y utilizarse una nomenclatura uniforme para ramas y commits.

GitHub deberá utilizarse como evidencia técnica del trabajo registrado en Jira.

Asimismo, se debe mejorar la trazabilidad entre Historia de Usuario, commit, Pull Request y documentación correspondiente.

## Acciones a realizar

| ID | Acción | Relación con impedimento | Responsable | Prioridad | Resultado esperado |
|---|---|---|---|---|---|
| ACT-01 | Consolidar la estructura frontend/backend del repositorio. | IMP-001 | Equipo de Desarrollo | Alta | Arquitectura de carpetas preparada y código organizado. |
| ACT-02 | Completar US-008 y US-009. | IMP-002 | Equipo de Desarrollo | Alta | Gestión completa de información de conductores. |
| ACT-03 | Completar EN-002 y sus controles de seguridad. | IMP-003 | Desarrollo / QA | Alta | Autenticación, autorización y controles básicos verificados. |
| ACT-04 | Ejecutar y documentar pruebas de las funcionalidades desarrolladas. | IMP-004 | QA / Desarrollo | Alta | Evidencias de pruebas disponibles. |
| ACT-05 | Relacionar Jira con ramas, commits y Pull Requests. | IMP-005 | Equipo del Proyecto | Media | Mayor trazabilidad entre planificación e implementación. |
| ACT-06 | Evitar iniciar nuevas funcionalidades hasta completar las actividades críticas del Sprint 1. | IMP-006 | Líder del Proyecto | Alta | Reducción del trabajo pendiente y cierre del Sprint. |
| ACT-07 | Revisar la Definition of Done antes de cerrar cada Historia. | IMP-003 / IMP-004 | Equipo del Proyecto | Alta | Historias finalizadas con evidencia verificable. |
| ACT-08 | Actualizar los documentos una vez completado el Sprint. | Transversal | Responsable de Documentación | Media | Jira, GitHub y documentación sincronizados. |

## Conclusión de la retrospectiva

El Sprint 1 presenta un resultado positivo al alcanzar aproximadamente un **70 % de avance**, pero todavía requiere completar actividades de implementación, integración, pruebas y seguridad.

Los principales impedimentos se concentran en el cierre técnico del trabajo desarrollado y no en una modificación del alcance definido.

Por ello, la principal decisión resultante de esta retrospectiva consiste en utilizar el 30 % restante para **terminar, integrar, probar y documentar** las funcionalidades existentes antes de continuar con el siguiente Sprint.

Esta medida permitirá que el Sprint 1 finalice con mayor trazabilidad y con evidencias suficientes para demostrar el cumplimiento de los criterios establecidos.
