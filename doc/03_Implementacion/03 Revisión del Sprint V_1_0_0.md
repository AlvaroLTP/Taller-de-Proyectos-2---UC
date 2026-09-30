# Revisión del sprint

**Nombre del Proyecto:** EcoLogística Lima — Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Líder del Proyecto:** La Torre Párraga, Alvaro Andree

## Historias de Usuario completadas en este Sprint

El Sprint 1, denominado **Gestión Core de Operaciones**, tiene como objetivo disponer de información básica y validada de vehículos, pedidos y conductores para utilizarla posteriormente en el proceso de generación de rutas optimizadas.

Al momento de realizar la presente Sprint Review, **ninguna Historia de Usuario del Sprint 1 se encuentra registrada en estado Done / Finalizado en Jira**.

El estado observado de las Historias de Usuario planificadas es el siguiente:

| Historia | Jira | Descripción | Estado |
|---|---|---|---|
| US-001 | KAN-5 | Registrar vehículos de la flota | En curso |
| US-002 | KAN-6 | Gestionar parámetros operativos y ambientales del vehículo | En curso |
| US-003 | KAN-7 | Validar información de los vehículos registrados | En curso |
| US-004 | KAN-8 | Registrar pedidos | En curso |
| US-005 | KAN-9 | Registrar direcciones de entrega no convencionales | En curso |
| US-006 | KAN-10 | Validar información de los pedidos | En curso |
| US-007 | KAN-22 | Registrar conductores | En curso |
| US-008 | KAN-23 | Gestionar disponibilidad de conductores | Tareas por hacer |
| US-009 | KAN-24 | Validar información de conductores | Tareas por hacer |

### Resumen del estado del Sprint

- **Historias finalizadas:** 0
- **Historias en curso:** 7
- **Historias por iniciar:** 2
- **Total de Historias de Usuario planificadas:** 9

También se encuentra planificado el Enabler:

- **EN-002 — Implementar controles de seguridad**

Este elemento forma parte de la planificación documental del Sprint 1; sin embargo, todavía debe mantenerse su trazabilidad correspondiente dentro de Jira.

## Demostración del trabajo completado

Debido a que ninguna de las Historias de Usuario planificadas se encuentra actualmente en estado **Done**, no corresponde considerar realizada una demostración formal de funcionalidades completamente terminadas ante los stakeholders.

No obstante, durante la revisión se identificó avance registrado en Jira sobre las siguientes capacidades:

### Gestión de vehículos

Se encuentran en desarrollo las funcionalidades relacionadas con:

- Registro de vehículos de la flota.
- Gestión de parámetros operativos y ambientales.
- Validación de la información registrada de los vehículos.

Estas funcionalidades proporcionarán información como capacidad de carga, consumo de combustible y factores ambientales necesarios para la posterior optimización de rutas.

### Gestión de pedidos

Se encuentra trabajo en curso relacionado con:

- Registro de pedidos.
- Registro de direcciones de entrega no convencionales.
- Validación de información de los pedidos.

Estas funcionalidades son relevantes debido a que las ubicaciones, coordenadas, pesos y demás restricciones de los pedidos constituyen datos de entrada para el futuro motor de optimización.

### Gestión de conductores

La funcionalidad correspondiente al registro de conductores se encuentra en desarrollo.

Las funcionalidades de gestión de disponibilidad y validación de la información de conductores todavía se mantienen en estado **Tareas por hacer**.

### Resultado de la revisión

El equipo presenta avance en los componentes fundamentales de gestión de datos del sistema; sin embargo, estos elementos todavía deben completar sus criterios de aceptación y cumplir la **Definition of Done** antes de considerarse incrementos terminados.

La demostración formal deberá realizarse cuando las funcionalidades hayan sido completadas y exista evidencia suficiente de:

- cumplimiento de los criterios de aceptación;
- pruebas unitarias y de integración;
- revisión de código;
- controles de seguridad aplicables;
- documentación actualizada;
- despliegue en el ambiente de pruebas correspondiente.

## Pendientes

Como resultado de la Sprint Review se mantienen los siguientes elementos pendientes:

1. Completar **US-001 — Registrar vehículos de la flota**.
2. Completar **US-002 — Gestionar parámetros operativos y ambientales del vehículo**.
3. Completar **US-003 — Validar información de los vehículos registrados**.
4. Completar **US-004 — Registrar pedidos**.
5. Completar **US-005 — Registrar direcciones de entrega no convencionales**.
6. Completar **US-006 — Validar información de los pedidos**.
7. Completar **US-007 — Registrar conductores**.
8. Iniciar y completar **US-008 — Gestionar disponibilidad de conductores**.
9. Iniciar y completar **US-009 — Validar información de conductores**.
10. Mantener la trazabilidad del **EN-002 — Implementar controles de seguridad**.
11. Verificar los criterios de aceptación de cada Historia de Usuario.
12. Aplicar la **Definition of Done** antes de declarar cualquier elemento como finalizado.
13. Incorporar al repositorio el código fuente correspondiente a las funcionalidades desarrolladas.
14. Mantener trazabilidad entre los identificadores de Jira, commits y Pull Requests.
15. Registrar evidencia de pruebas realizadas.
16. Preparar la demostración formal para los stakeholders una vez exista un incremento funcional terminado.

## Conclusión de la Sprint Review

El Sprint 1 presenta un **avance parcial**, principalmente en las funcionalidades de vehículos, pedidos y registro de conductores.

Sin embargo, debido a que actualmente no existen Historias de Usuario en estado **Done**, el objetivo del Sprint aún no puede considerarse completamente alcanzado.

Se recomienda priorizar la finalización de las siete Historias de Usuario actualmente en curso antes de incrementar el trabajo pendiente, verificando para cada una el cumplimiento de sus criterios de aceptación y de la Definition of Done.

Una vez completadas, estas funcionalidades constituirán la base operativa necesaria para continuar con el desarrollo del **Motor de Optimización y Despacho**.