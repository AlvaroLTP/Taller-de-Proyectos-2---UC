# Optimización de listados

**Fecha:** 2026-11-10  
**Clasificación:** Observada y Medida en pruebas locales.

El endpoint `GET /api/v1/orders/` acepta `limit` (1–200), `offset`, `status` y `delivery_date`. Mantiene el alcance de autorización existente, aplica los filtros antes del límite y devuelve `X-Total-Count`. El cliente incorpora `orderService.getPage()` para consumir páginas explícitas.

No se cambió la carga global existente a una página limitada: hacerlo sin una interfaz de paginación podría ocultar pedidos. No se añadieron índices, caché, compresión ni afirmaciones de rendimiento sin perfil SQL/HTTP.

## Evidencia

- Pruebas de pedidos: 2 aprobadas, incluida paginación, filtro y conteo.
- Ruff: sin hallazgos.
- Frontend: typecheck correcto y 26/26 pruebas aprobadas.
