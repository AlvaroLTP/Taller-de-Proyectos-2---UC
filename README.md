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

El **Sprint 1 culminó el 22 de septiembre de 2026**, según el cierre funcional reportado por el equipo para el hito H-03 del cronograma. Actualmente las nueve historias y la épica KAN-2 figuran finalizadas en Jira. La fecha de revisión de los documentos no reemplaza la fecha funcional reportada de cierre.

En el **Sprint 2**, KAN-25 y KAN-26 están finalizadas. KAN-11, KAN-12, KAN-13 y KAN-21 siguen por hacer. El hito H-04 prevé un prototipo funcional del motor y rutas multi-vehículo para el 6 de octubre; el sprint mantiene cierre parcial y retraso breve reportado, con un plan propuesto de recuperación en dos sesiones de trabajo.

El frontend y backend están desarrollados según el equipo; falta publicar la versión completa. El tablero KAN no admite sprints, por lo que la distribución académica se toma de la planificación previa. EN-002 y EN-001 se conservan en los respectivos alcances; no se identificaron incidencias independientes de esos enablers en Jira.

## Código fuente

- [Frontend del Sprint 1 ya presente](doc/Programa_Proyectos/Frontend/Programa_Sprint_1/project/)
- [Carpeta reservada para backend](doc/Programa_Proyectos/backend/): contiene únicamente un README vacío al corte; falta incorporar el código completo reportado por el equipo.

La documentación inicial propone React, FastAPI y PostgreSQL/PostGIS. El frontend publicado incluye React, TypeScript, Vite y una dependencia de Supabase. Al publicar la versión completa se debe confirmar el uso de Supabase y la arquitectura efectiva antes de cambiar los documentos iniciales; una dependencia instalada no demuestra por sí sola una sustitución del backend.

## Organización y consigna

Los entregables están en `doc/03_Implementacion/Sprint_1` y `Sprint_2`, siguiendo la carpeta existente y la organización solicitada por el equipo. Las consignas usan literalmente `docs/03 Implementación`; esa diferencia de ruta debe conciliarse con el docente antes de la entrega. Se mantienen los cuatro nombres oficiales por sprint y enlaces de ida y vuelta al README principal.

Se conservan los nombres oficiales V_1_0_0 de las plantillas; cada documento registra la revisión 1.0.2 y su historial de versiones. El `.gitignore` raíz prepara futuras publicaciones para excluir dependencias, temporales y configuración privada; no elimina archivos que ya estén rastreados.
