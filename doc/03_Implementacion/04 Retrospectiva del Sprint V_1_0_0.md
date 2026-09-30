# Retrospectiva del sprint

**Nombre del Proyecto:** EcoLogística Lima — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

## ¿Qué aprendimos?

Durante el desarrollo del Sprint 1 se identificaron aprendizajes relacionados tanto con la organización del equipo como con la forma de gestionar y evidenciar el avance del proyecto.

- La planificación de Historias de Usuario debe estar acompañada desde el inicio por evidencia técnica en el repositorio.
- El estado de una Historia de Usuario en Jira debe corresponder con el estado real de su implementación, pruebas y documentación.
- La **Definition of Done** debe utilizarse durante todo el Sprint y no únicamente al momento de cerrar las Historias de Usuario.
- La trazabilidad entre Jira y GitHub es necesaria para demostrar qué cambios de código corresponden a cada Historia de Usuario.
- Es importante priorizar la finalización de las funcionalidades ya iniciadas antes de aumentar la cantidad de trabajo en progreso.
- Los elementos técnicos, como los Enablers, también necesitan seguimiento dentro de Jira para evitar que requisitos como seguridad, rendimiento o documentación queden únicamente definidos a nivel documental.
- La revisión temprana del repositorio permitió detectar que todavía no existe una estructura completa de implementación para frontend y backend, lo cual debe resolverse antes de incrementar la complejidad técnica del proyecto.
- La gestión de una iteración necesita evidencias de cierre, demostración y validación; no es suficiente con que una funcionalidad figure únicamente como "En curso".

## ¿Qué estamos haciendo bien?

Se identificaron los siguientes aspectos positivos durante la iteración:

- El proyecto cuenta con una planificación estructurada mediante Épicas e Historias de Usuario.
- Las Historias de Usuario del núcleo operativo se encuentran identificadas y distribuidas en Jira.
- Existe una separación clara entre gestión de vehículos, pedidos, conductores, optimización y visualización.
- Las Historias de Usuario poseen responsables y niveles de prioridad dentro de Jira.
- El Sprint 1 presenta una secuencia lógica, debido a que primero busca construir y validar la información necesaria antes de desarrollar el motor de optimización.
- Se ha definido previamente una **Definition of Done**, proporcionando criterios objetivos para determinar cuándo una funcionalidad puede considerarse terminada.
- El equipo mantiene documentación de planificación, riesgos, presupuesto, arquitectura y requisitos.
- Se están identificando los impedimentos antes de continuar con las siguientes funcionalidades, reduciendo el riesgo de acumular problemas técnicos.
- Existe una intención de mantener el desarrollo alineado con requisitos de seguridad, sostenibilidad y calidad.

## ¿Qué podemos hacer mejor?

### Personas

- Evitar mantener demasiadas Historias de Usuario simultáneamente en estado **En curso**. Actualmente existen varias funcionalidades abiertas al mismo tiempo, lo cual puede generar dispersión del esfuerzo del equipo.
- Definir con mayor claridad quién es responsable del cierre técnico, pruebas y validación de cada Historia de Usuario.
- Mejorar la distribución del trabajo para que las funcionalidades iniciadas puedan terminarse antes de comenzar nuevos elementos.
- Asegurar que los responsables conozcan los criterios de la Definition of Done antes de comenzar la implementación.
- Fortalecer la coordinación entre desarrollo y QA para que las pruebas no se concentren únicamente al final de la iteración.

### Relaciones

- Mejorar la comunicación entre los responsables de Jira y los responsables del repositorio GitHub.
- Acordar una única forma de identificar las Historias de Usuario entre documentación, Jira, ramas, commits y Pull Requests.
- Realizar revisiones breves y frecuentes del avance para detectar bloqueos antes de que afecten a varias funcionalidades.
- Comunicar inmediatamente cualquier cambio en el alcance o estado de una Historia de Usuario al resto del equipo.
- Mantener una relación directa entre el trabajo técnico realizado y el elemento correspondiente del backlog.

### Procesos

- Aplicar la Definition of Done de forma progresiva durante el desarrollo de cada Historia de Usuario.
- Reducir el trabajo en progreso y priorizar el cierre de las siete Historias de Usuario actualmente iniciadas.
- No considerar una Historia como terminada hasta contar con evidencia de implementación, pruebas, revisión y documentación.
- Incorporar una revisión formal del estado de Jira y GitHub al cierre de cada iteración.
- Registrar formalmente los impedimentos y hacer seguimiento a su resolución.
- Incorporar los Enablers dentro del mismo mecanismo de seguimiento utilizado para las Historias de Usuario.
- Mantener la documentación del proyecto sincronizada con las decisiones tomadas durante la implementación.
- Definir una estrategia clara para gestionar las iteraciones debido a que el tablero actual de Jira no dispone de soporte nativo para Sprints.

### Herramientas

- Crear una estructura organizada de código fuente dentro del repositorio, separando como mínimo frontend y backend.
- Incorporar un archivo `.gitignore` adecuado para evitar subir dependencias, archivos temporales, secretos y variables de entorno.
- Utilizar ramas relacionadas con los identificadores de Jira, por ejemplo:

  - `feature/KAN-5-registro-vehiculos`
  - `feature/KAN-8-registro-pedidos`
  - `feature/KAN-22-registro-conductores`

- Incluir el identificador de Jira en los mensajes de commit cuando corresponda.
- Utilizar Pull Requests para mantener evidencia de revisión de código.
- Relacionar Jira con commits y Pull Requests cuando la integración disponible lo permita.
- Actualizar el `README.md` del repositorio para facilitar la navegación hacia la documentación de implementación.
- Evaluar si el tablero Jira actual satisface la gestión futura de iteraciones o si se requiere adaptar la configuración para disponer de seguimiento formal de Sprints.

## Acciones a realizar

Como resultado de la retrospectiva se establece el siguiente plan de acción:

| ID | Acción | Responsable | Prioridad | Fecha objetivo | Evidencia esperada |
|---|---|---|---|---|---|
| ACT-01 | Crear la estructura inicial de código separando frontend y backend. | Equipo de Desarrollo | Alta | 2026-10-02 | Directorios de implementación visibles en GitHub. |
| ACT-02 | Incorporar y configurar correctamente el archivo `.gitignore`. | Equipo de Desarrollo | Alta | 2026-10-02 | Archivo `.gitignore` versionado y ausencia de dependencias o secretos en el repositorio. |
| ACT-03 | Registrar y mantener trazabilidad del EN-002 — Implementar controles de seguridad. | Líder del Proyecto / Equipo | Alta | 2026-10-02 | Enabler visible y trazable dentro de la gestión del proyecto. |
| ACT-04 | Priorizar la finalización de las Historias de Usuario que actualmente están en curso antes de iniciar nuevas funcionalidades. | Equipo del Proyecto | Alta | 2026-10-05 | Reducción de elementos en curso y aumento de elementos correctamente finalizados. |
| ACT-05 | Aplicar la Definition of Done individualmente antes de cerrar cada Historia de Usuario. | Desarrollo y QA | Alta | Desde el Sprint actual | Evidencia de criterios de aceptación, pruebas, revisión de código y documentación. |
| ACT-06 | Adoptar una nomenclatura de ramas y commits vinculada a los identificadores de Jira. | Equipo de Desarrollo | Media | 2026-10-03 | Ramas y commits asociados a claves como KAN-5, KAN-8 o KAN-22. |
| ACT-07 | Utilizar Pull Requests para las integraciones de funcionalidades y registrar las revisiones realizadas. | Equipo de Desarrollo | Alta | 2026-10-05 | Pull Requests vinculados al trabajo implementado. |
| ACT-08 | Actualizar el README principal y el README de implementación con enlaces hacia los documentos correspondientes. | Responsable de Documentación | Media | 2026-10-05 | Navegación funcional entre README y documentos del proyecto. |
| ACT-09 | Revisar la configuración actual de Jira para establecer un mecanismo formal de seguimiento de futuras iteraciones. | Líder del Proyecto | Media | Antes de iniciar la siguiente iteración | Decisión documentada sobre el mecanismo de gestión de Sprints. |
| ACT-10 | Realizar una revisión conjunta de Jira, GitHub y documentación antes de declarar cerrado el Sprint 1. | Equipo del Proyecto | Alta | Cierre del Sprint 1 | Estados de Jira, código y documentos consistentes entre sí. |

## Conclusión de la retrospectiva

La principal oportunidad de mejora identificada durante el Sprint 1 es fortalecer la transición entre la **planificación del trabajo y la evidencia real de implementación**.

El equipo dispone de una base documental y una organización funcional definida, pero debe mejorar el cierre efectivo de las Historias de Usuario, reducir el trabajo simultáneo y aumentar la trazabilidad entre Jira, GitHub, pruebas y documentación.

Para la siguiente iteración se priorizará finalizar correctamente el trabajo iniciado, aplicar de manera continua la Definition of Done y utilizar evidencias técnicas verificables para demostrar el avance del proyecto.