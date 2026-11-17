# 🌱 EcoLogística Lima

### Optimizador de Rutas Sostenibles para DistriRápido S.A.C.

**Proyecto académico:** Taller de Proyectos 2 — Universidad Continental  
**Enfoque de trabajo:** Desarrollo iterativo mediante sprints, con documentación de gestión y evidencias técnicas.  
**Última actualización documental:** 17 de noviembre de 2026  
**Versión de este README:** 1.1.0

> **Propósito del repositorio:** centralizar el código fuente, la documentación del ciclo de vida del proyecto, los entregables de cada sprint y las evidencias de verificación de EcoLogística Lima.

## 📑 Índice general

1. [Descripción del proyecto](#-descripción-del-proyecto)
2. [Objetivos y alcance](#-objetivos-y-alcance)
3. [Funcionalidades y arquitectura](#-funcionalidades-y-arquitectura)
4. [Tecnologías utilizadas](#-tecnologías-utilizadas)
5. [Estructura del repositorio](#-estructura-del-repositorio)
6. [Documentación por fases](#-documentación-por-fases)
7. [Implementación: Sprints 1 al 4](#-implementación-sprints-1-al-4)
8. [Pruebas, calidad y seguridad](#-pruebas-calidad-y-seguridad)
9. [Ejecución del sistema](#-ejecución-del-sistema)
10. [Estado y trabajo pendiente](#-estado-y-trabajo-pendiente)
11. [Equipo del proyecto](#-equipo-del-proyecto)
12. [Control de versiones y enlaces](#-control-de-versiones-y-enlaces)

---

## 📌 Descripción del proyecto

**EcoLogística Lima** es una solución informática orientada a mejorar la planificación y gestión de operaciones de distribución para **DistriRápido S.A.C.** Su propuesta integra la administración de recursos logísticos y la generación de rutas bajo restricciones operativas, buscando apoyar decisiones más eficientes y sostenibles.

La aplicación organiza información sobre **vehículos, conductores, clientes, pedidos, rutas y entregas**. Además, contempla la estimación de distancias, tiempos y emisiones asociadas a las rutas. Estas estimaciones no equivalen a mediciones de tráfico o GPS en tiempo real.

[📁 Consultar la documentación de inicio](docs/01_Inicio/) · [📁 Consultar el código fuente](Programa_Proyectos_2/)

## 🎯 Objetivos y alcance

**Objetivo general:** desarrollar una herramienta de apoyo a la gestión logística capaz de organizar pedidos y recursos, proponer rutas factibles y facilitar el seguimiento operativo de su ejecución.

**Alcance funcional documentado:**

- Gestión de vehículos, conductores, clientes y pedidos.
- Planificación y asignación de rutas según restricciones de capacidad, disponibilidad y ventanas horarias.
- Operaciones de despacho, seguimiento de estados y confirmación de entregas.
- Reoptimización de rutas en preparación ante determinados cambios operativos, con restricciones y casos pendientes.
- Acceso diferenciado por perfiles y roles; autenticación mediante Supabase y reglas de operación implementadas en la API.
- Consultas de indicadores y estimaciones logísticas y ambientales.

El alcance exacto, los criterios de aceptación y las restricciones deben contrastarse con los documentos formales del proyecto:

- [Requisitos funcionales](docs/01_Inicio/06.%20Requisitos%20funcionales%20V_1_0_1.md)
- [Requisitos no funcionales](docs/01_Inicio/07.%20Requisitos%20no%20funcionales%20V_1_0_1.md)
- [Reglas de negocio](docs/01_Inicio/09.%20Reglas%20de%20negocio%20V_1_0_1.md)
- [Restricciones](docs/01_Inicio/13.%20Restricciones%20V_1_0_1.md)

## 🧩 Funcionalidades y arquitectura

La solución se organiza en tres componentes principales:

| Componente | Función | Acceso |
|---|---|---|
| **Frontend** | Interfaz de usuario y flujos operativos; consume los servicios del backend. | [Frontend](Programa_Proyectos_2/Frontend/) |
| **Backend** | API de negocio, validaciones, autorización, persistencia y planificación de rutas. | [Backend](Programa_Proyectos_2/Backend/) |
| **Supabase / PostgreSQL** | Autenticación, perfiles y almacenamiento de datos, sujeto a la configuración y migraciones correspondientes. | [Documentación técnica](Programa_Proyectos_2/README.md) |

**Flujo conceptual:** `Usuario → Frontend → API FastAPI → Base de datos` (con autenticación y validación de sesión mediante Supabase).

> La generación de rutas utiliza una heurística y estimaciones; no debe interpretarse como un optimizador que garantice siempre la mejor solución global, ni como un sistema de navegación GPS con tráfico en vivo.

Documentación complementaria: [Stack tecnológico](docs/01_Inicio/10.%20Stack%20tecnológico%20V_1_0_1.md), [Base de datos](docs/01_Inicio/11.%20Base%20de%20datos%20V_1_0_1.md) y [Modelo C4](docs/01_Inicio/12.%20Modelo%20C4%20V_1_0_1.md).

## 🛠️ Tecnologías utilizadas

| Área | Tecnología / herramienta | Aplicación en el proyecto |
|---|---|---|
| Interfaz web | React y TypeScript | Pantallas, formularios y operaciones del usuario |
| Backend | Python y FastAPI | API REST, reglas de negocio y validaciones |
| Datos | PostgreSQL y Supabase | Persistencia, autenticación y perfiles |
| Pruebas backend | pytest | Pruebas de comportamiento y regresión |
| Pruebas end-to-end | Playwright | Validaciones de flujos de navegador |
| Calidad de código | Ruff, ESLint, TypeScript | Comprobaciones estáticas |
| Gestión | Jira | Historias de usuario, tareas y seguimiento |
| Versionamiento | Git y GitHub | Control de cambios y publicación del repositorio |

Las versiones, dependencias y comandos vigentes deben consultarse en los archivos de configuración y el [README técnico de la aplicación](Programa_Proyectos_2/README.md).

## 🗂️ Estructura del repositorio

```text
Taller-de-Proyectos-2---UC/
├── README.md                          ← Este índice general
├── docs/
│   ├── 01_Inicio/                     ← Definición del proyecto y requisitos
│   ├── 02_Planficacion/              ← Planificación, Jira, riesgos y presupuesto
│   └── 03_Implementacion/
│       ├── Sprint_1/                 ← Gestión inicial de operaciones
│       ├── Sprint_2/                 ← Optimización y despacho
│       ├── Sprint_3/                 ← Revisión, retrospectiva y documentación de pruebas
│       ├── Sprint_4/                 ← Revisión, retrospectiva y resultados de pruebas
│       └── Reducción del Impacto Ambiental/
├── Programa_Proyectos_2/
│   ├── Frontend/
│   ├── Backend/
│   ├── scripts/
│   ├── openspec/
│   └── README.md                      ← Guía técnica de instalación y verificación
└── .github/                           ← Automatizaciones y configuración GitHub
```

## 📚 Documentación por fases

| Fase | Contenido | Navegación |
|---|---|---|
| **01 · Inicio** | Visión, acta, enfoque, requisitos, interesados, reglas, tecnología, datos y arquitectura. | [Ver documentación de inicio](docs/01_Inicio/) |
| **02 · Planificación** | Transformación a ágil, artefactos de Jira, matriz de riesgos y presupuesto. | [Ver planificación](docs/02_Planficacion/) |
| **03 · Implementación** | Entregables y evidencias organizados por sprint. | [Ver implementación](docs/03_Implementacion/) |
| **Impacto ambiental** | Material complementario sobre la reducción del impacto ambiental. | [Ver documentación ambiental](docs/03_Implementacion/Reducci%C3%B3n%20del%20Impacto%20Ambiental/) |

**Accesos rápidos a la planificación:** [Artefactos Jira](docs/02_Planficacion/02.%20Artefactos%20Jira%20V_1_0_0.md) · [Matriz de riesgos](docs/02_Planficacion/03.%20Matriz%20Evaluacion%20de%20Riesgos%20V_1_0_1.md) · [Presupuesto](docs/02_Planficacion/04.%20Presupuesto%20del%20proyecto%20V_1_0_1.md).

## 🚀 Implementación: Sprints 1 al 4

### Sprint 1 — Gestión Core de Operaciones

Documentación del primer incremento, enfocada en las bases operativas de la solución.

| Entregable | Abrir |
|---|---|
| Informe de estado del proyecto | [Documento](docs/03_Implementacion/Sprint_1/01%20Informe%20de%20estado%20del%20proyecto%20V_1_0_0.md) |
| Registro de impedimentos | [Documento](docs/03_Implementacion/Sprint_1/02%20Registro%20de%20Impedimentos%20V_1_0_0.md) |
| Revisión del sprint | [Documento](docs/03_Implementacion/Sprint_1/03%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) |
| Retrospectiva del sprint | [Documento](docs/03_Implementacion/Sprint_1/04%20Retrospectiva%20del%20Sprint%20V_1_0_0.md) |

[📁 Ver carpeta completa de Sprint 1](docs/03_Implementacion/Sprint_1/)

### Sprint 2 — Motor de Optimización y Despacho

Documentación del desarrollo y seguimiento de las funciones de planificación, optimización y despacho.

| Entregable | Abrir |
|---|---|
| Informe de estado del proyecto | [Documento](docs/03_Implementacion/Sprint_2/01%20Informe%20de%20estado%20del%20proyecto%20V_1_0_0.md) |
| Registro de impedimentos | [Documento](docs/03_Implementacion/Sprint_2/02%20Registro%20de%20Impedimentos%20V_1_0_0.md) |
| Revisión del sprint | [Documento](docs/03_Implementacion/Sprint_2/03%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) |
| Retrospectiva del sprint | [Documento](docs/03_Implementacion/Sprint_2/04%20Retrospectiva%20del%20Sprint%20V_1_0_0.md) |

[📁 Ver carpeta completa de Sprint 2](docs/03_Implementacion/Sprint_2/)

### Sprint 3 — Integración y documentación de pruebas

Este sprint reúne la revisión y retrospectiva, así como documentación técnica sobre diagnóstico, integración, pruebas, seguridad, accesibilidad y experiencia de usuario.

| Entregable | Abrir |
|---|---|
| Revisión del Sprint 3 | [Documento](docs/03_Implementacion/Sprint_3/03.1%20Revisi%C3%B3n%20del%20Sprint.md) |
| Retrospectiva del Sprint 3 | [Documento](docs/03_Implementacion/Sprint_3/03.2%20Retrospectiva%20del%20Sprint.md) |
| Diagnóstico técnico | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/01.%20Informe%20Diagnostico%20Tecnico.md) |
| Plan de trabajo | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/02.%20Plan%20de%20Trabajo.md) |
| Backend preparado y contratos de API | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/03.%20Backend%20Preparado%20y%20Contratos%20API.md) |
| Cliente API — Punto de control 1 | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/04.%20Punto%20de%20Control%201%20-%20Cliente%20API.md) |
| Pruebas de sistema | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/05.%20Pruebas%20de%20sistema.md) |
| Pruebas de extremo a extremo (E2E) | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/06.%20Pruebas%20de%20extremo%20a%20extremo%20%28E2E%29.md) |
| Análisis estático y seguridad | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/07.%20Analisis%20Estatico%20y%20Seguridad.md) |
| Ejecución de SonarQube | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/08.%20Ejecucion%20SonarQube.md) |
| Calidad, accesibilidad y rendimiento | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/09.%20Calidad%20Accesibilidad%20y%20Rendimiento.md) |
| Evaluación heurística y encuesta UX | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/10.%20Evaluaci%C3%B3n%20Heur%C3%ADstica%20y%20Encuesta%20UX.md) |
| Script de creación del formulario UX | [Código](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/10.1.%20Creaci%C3%B3n%20formulario%20UX%20EcoLogistica.gs) |
| Consolidación y entrega | [Documento](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/12.%20Consolidaci%C3%B3n%20y%20Entrega.md) |

[📁 Ver carpeta completa de Sprint 3](docs/03_Implementacion/Sprint_3/) · [📁 Ver toda la documentación de pruebas](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/)

> Nota documental: existe un `README.md` en la carpeta de Sprint 3, pero el archivo consultado estaba vacío. Por eso, este índice enlaza directamente a los documentos existentes.

### Sprint 4 — Verificación integral, revisión y retrospectiva

El Sprint 4 documenta el estado de las historias, las revisiones de implementación, las pruebas generales y los pendientes técnicos. Incluye evidencia sobre la reoptimización de rutas, integración frontend/backend, pruebas E2E y auditorías de dependencias.

| Entregable | Abrir |
|---|---|
| Revisión del Sprint 4 | [Documento](docs/03_Implementacion/Sprint_4/01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) |
| Retrospectiva del Sprint 4 | [Documento](docs/03_Implementacion/Sprint_4/02%20Retrospectiva%20del%20Sprint%20V_1_0_0.md) |
| Auditoría técnica del sistema (histórica) | [Documento](docs/03_Implementacion/Sprint_4/Resultados_Pruebas_Generales/AUDITORIA_SISTEMA.md) |
| Resultados generales de pruebas | [Resultados](docs/03_Implementacion/Sprint_4/Resultados_Pruebas_Generales/RESULTADOS_PRUEBAS.txt) |
| Revisión de backend | [Documento](docs/03_Implementacion/Sprint_4/Resultados_Pruebas_Generales/REVISION_BACKEND.md) |
| Revisión de frontend (16/11/2026) | [Documento](docs/03_Implementacion/Sprint_4/Resultados_Pruebas_Generales/REVISION_FRONTEND_2026-11-16.md) |
| Auditoría npm conservada | [JSON](docs/03_Implementacion/Sprint_4/Resultados_Pruebas_Generales/auditoria-npm.json) |
| Auditoría de dependencias Python | [JSON](docs/03_Implementacion/Sprint_4/Resultados_Pruebas_Generales/auditoria-python.json) |

[📁 Ver carpeta completa de Sprint 4](docs/03_Implementacion/Sprint_4/) · [📁 Ver evidencias de pruebas](docs/03_Implementacion/Sprint_4/Resultados_Pruebas_Generales/)

**Resumen de avance informado en la revisión del Sprint 4:** US-015 (reoptimización de rutas) al **80 %**; US-021, US-022, US-023 y US-024 al **50 %** cada una. Esos porcentajes son estados informados en el documento y **no equivalen a aceptación o cierre verificado en Jira**. Consultar la revisión para el detalle y las limitaciones.

## 🧪 Pruebas, calidad y seguridad

La documentación del proyecto incluye pruebas unitarias/de integración, verificación E2E, comprobaciones estáticas y auditorías de dependencias. Conviene diferenciar **resultados históricos**, **ejecuciones locales** y **validaciones remotas pendientes**.

| Aspecto | Evidencia documental | Fuente |
|---|---|---|
| Backend | Línea base local del 17/11/2026: 110 pruebas aprobadas, 75 % de cobertura informada. Otras revisiones conservan mediciones de fechas y condiciones diferentes. | [Revisión Sprint 4](docs/03_Implementacion/Sprint_4/01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) |
| Pruebas E2E | Ejecución local documentada el 17/11/2026: 21 de 21 casos aprobados entre Chromium, Firefox y WebKit. | [Revisión Sprint 4](docs/03_Implementacion/Sprint_4/01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) |
| Frontend | Comprobaciones de TypeScript, lint y compilación; observaciones registradas. | [Revisión frontend](docs/03_Implementacion/Sprint_4/Resultados_Pruebas_Generales/REVISION_FRONTEND_2026-11-16.md) |
| Dependencias | Una auditoría npm histórica conservada registró 0 vulnerabilidades; la revisión del 17/11/2026 informa 17 alertas altas, pendientes de evaluación. | [Revisión Sprint 4](docs/03_Implementacion/Sprint_4/01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) |
| Validación remota | Pendientes la comprobación de migraciones/RLS en PostgreSQL/Supabase y evidencia de ejecución remota de CI según el cierre documentado. | [Retrospectiva Sprint 4](docs/03_Implementacion/Sprint_4/02%20Retrospectiva%20del%20Sprint%20V_1_0_0.md) |

**Importante:** una prueba local satisfactoria no acredita por sí misma despliegue productivo, disponibilidad continua, seguridad integral ni aceptación formal de historias.

Recursos relacionados: [Pruebas del Sprint 3](docs/03_Implementacion/Sprint_3/Documentacion_Pruebas/) · [Resultados del Sprint 4](docs/03_Implementacion/Sprint_4/Resultados_Pruebas_Generales/) · [Workflows de GitHub](.github/workflows/).

## 💻 Ejecución del sistema

El código está en [`Programa_Proyectos_2/`](Programa_Proyectos_2/), donde se encuentran las aplicaciones, scripts de verificación y la documentación técnica detallada.

**Requisitos de referencia:** Python 3.11 o superior, Node.js 24 LTS y un proyecto Supabase de desarrollo correctamente configurado. Las dependencias y variables de entorno se describen en la guía técnica.

**Instalación, variables de entorno, arranque, migraciones y pruebas:** consultar el [README técnico de EcoLogística Lima](Programa_Proyectos_2/README.md).

| Recurso | Enlace |
|---|---|
| Código frontend | [Abrir Frontend](Programa_Proyectos_2/Frontend/) |
| Código backend | [Abrir Backend](Programa_Proyectos_2/Backend/) |
| Scripts de ejecución y verificación | [Abrir scripts](Programa_Proyectos_2/scripts/) |
| Configuración de GitHub Actions | [Abrir workflows](.github/workflows/) |
| Instrucciones técnicas completas | [README de la aplicación](Programa_Proyectos_2/README.md) |

> **Seguridad:** nunca subir contraseñas, claves privadas, tokens de sesión ni archivos `.env` reales al repositorio. Las claves públicas para el frontend y los secretos de la conexión SQL tienen funciones distintas.

## 📊 Estado y trabajo pendiente

**Corte de la documentación consultada: 17 de noviembre de 2026.** La información aquí resumida procede de los entregables versionados; no representa una verificación en tiempo real de Jira ni garantiza que el código desplegado coincida con esas evidencias.

- **Sprints 1 y 2:** existen informes de estado, impedimentos, revisión y retrospectiva.
- **Sprint 3:** existen documentos de revisión y retrospectiva, además de una carpeta detallada de pruebas y consolidación. El README interno consultado estaba vacío.
- **Sprint 4:** existen revisión, retrospectiva y seis archivos de evidencias técnicas; se reportan historias todavía en progreso.
- **Pendientes identificados en Sprint 4:** completar criterios de aceptación y trazabilidad en Jira; comprobar migraciones y políticas RLS en un entorno seguro; evaluar vulnerabilidades npm; conservar ejecuciones verificables de CI y completar la validación remota del monitoreo.

Para conocer el estado más detallado y evitar interpretar tareas abiertas como concluidas, consultar la [Revisión del Sprint 4](docs/03_Implementacion/Sprint_4/01%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md) y la [Retrospectiva del Sprint 4](docs/03_Implementacion/Sprint_4/02%20Retrospectiva%20del%20Sprint%20V_1_0_0.md).

## 👥 Equipo del proyecto

| Rol | Integrante |
|---|---|
| **Líder del proyecto** | La Torre Párraga, Alvaro Andree |
| Integrante | Caldas Alanya, Marvin Usias |
| Integrante | Guevara Chamorro, Augusto Jose |
| Integrante | Yanarico Ticona, Ivan Josue |

**Institución:** Universidad Continental  
**Asignatura:** Taller de Proyectos 2

## 📝 Control de versiones y enlaces

| Versión README | Fecha | Descripción |
|---|---|---|
| 1.0.0 | Anterior | Índice general inicial con Sprint 1, Sprint 2 y una referencia parcial al Sprint 4. |
| **1.1.0** | **17/11/2026** | Reorganización de la portada, incorporación completa de Sprint 3 y Sprint 4, enlaces a documentación, código, pruebas y resumen de pendientes. |

**Enlaces generales**

- [Repositorio principal](https://github.com/AlvaroLTP/Taller-de-Proyectos-2---UC)
- [Tablero Jira del proyecto](https://continental-team-lz4401n3.atlassian.net/jira/software/projects/KAN/boards/1) *(puede requerir acceso autorizado)*
- [Inicio del proyecto](docs/01_Inicio/)
- [Planificación](docs/02_Planficacion/)
- [Implementación](docs/03_Implementacion/)
- [Código fuente y guía técnica](Programa_Proyectos_2/)

---

<p align="center"><strong>EcoLogística Lima · Taller de Proyectos 2 · Universidad Continental</strong></p>
