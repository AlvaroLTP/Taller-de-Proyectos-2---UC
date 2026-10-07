# EcoLogística Lima

Optimizador de Rutas Sostenibles para DistriRápido S.A.C. — Taller de Proyectos 2, Universidad Continental.

**Líder:** La Torre Párraga, Alvaro Andree.
**Equipo:** Caldas Alanya, Marvin Usias; Guevara Chamorro, Augusto Jose; La Torre Párraga, Alvaro Andree; Yanarico Ticona, Ivan Josue.

## Documentación

- [Inicio del proyecto](doc/01_Inicio/)
- [Planificación y artefactos de Jira](doc/02_Planficacion/02.%20Artefactos%20Jira%20V_1_0_0.md)
- [Tablero Jira](https://continental-team-lz4401n3.atlassian.net/jira/software/projects/KAN/boards/1)

### Sprint 1 — Gestión Core de Operaciones

- [Informe de estado](doc/03_Implementacion/Sprint_1/01%20Informe%20de%20estado%20del%20proyecto%20V_1_0_0.md)
- [Registro de impedimentos](doc/03_Implementacion/Sprint_1/02%20Registro%20de%20Impedimentos%20V_1_0_0.md)
- [Revisión del sprint](doc/03_Implementacion/Sprint_1/03%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md)
- [Retrospectiva](doc/03_Implementacion/Sprint_1/04%20Retrospectiva%20del%20Sprint%20V_1_0_0.md)

### Sprint 2 — Motor de Optimización y Despacho

- [Informe de estado](doc/03_Implementacion/Sprint_2/01%20Informe%20de%20estado%20del%20proyecto%20V_1_0_0.md)
- [Registro de impedimentos](doc/03_Implementacion/Sprint_2/02%20Registro%20de%20Impedimentos%20V_1_0_0.md)
- [Revisión del sprint](doc/03_Implementacion/Sprint_2/03%20Revisi%C3%B3n%20del%20Sprint%20V_1_0_0.md)
- [Retrospectiva](doc/03_Implementacion/Sprint_2/04%20Retrospectiva%20del%20Sprint%20V_1_0_0.md)

## Estado de la entrega al 2026-10-06

El Sprint 1 está completado al 6 de octubre de 2026: 100 % de su alcance funcional realizado según la actualización del líder. El frontend y backend están desarrollados, con publicación completa pendiente. Los estados abiertos del Sprint 1 en Jira deben sincronizarse con el cierre reportado. El Sprint 2 está en proceso de cierre, con un retraso breve de entrega informado por el líder: Jira muestra US-010 y US-011 finalizadas y cuatro historias pendientes de cierre. Se propone recuperar la entrega en dos sesiones de trabajo; ese plazo es una meta, no una duración medida del retraso.

El tablero KAN no admite sprints; la distribución académica se toma de la planificación previa. EN-002 (Sprint 1) y EN-001 (Sprint 2) están previstos en esa planificación, pero no se identificó su incidencia en Jira.

## Código fuente

- [Frontend del Sprint 1 ya presente](doc/Programa_Proyectos/Frontend/Programa_Sprint_1/project/)
- [Carpeta reservada para backend](doc/Programa_Proyectos/backend/): contiene únicamente un README vacío al corte; falta incorporar el código completo reportado por el equipo.

La documentación inicial propone React, FastAPI y PostgreSQL/PostGIS. El frontend publicado incluye React, TypeScript, Vite y una dependencia de Supabase. Al publicar la versión completa se debe confirmar el uso de Supabase y la arquitectura efectiva antes de cambiar los documentos iniciales; una dependencia instalada no demuestra por sí sola una sustitución del backend.

## Organización y consigna

Los entregables están en `doc/03_Implementacion/Sprint_1` y `Sprint_2`, siguiendo la carpeta existente y la organización solicitada por el equipo. Las consignas usan literalmente `docs/03 Implementación`; esa diferencia de ruta debe conciliarse con el docente antes de la entrega. Se mantienen los cuatro nombres oficiales por sprint y enlaces de ida y vuelta al README principal.

Cada documento incluye versión 1.0.0 e historial. El `.gitignore` raíz prepara futuras publicaciones para excluir dependencias, temporales y configuración privada; no elimina archivos que ya estén rastreados.
