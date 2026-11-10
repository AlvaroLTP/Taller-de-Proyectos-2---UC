# Estandares Ingeniería de software V_1_0_0

**Versión:** V_1_0_0  
**Fecha:** 2026-11-10  
**Ámbito:** React/Vite, FastAPI/SQLAlchemy y PostgreSQL/Supabase.

## Marco adaptado

ISO/IEC 25010 orienta adecuación funcional, eficiencia de desempeño, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad y portabilidad. Los principios de Green Software se aplican como reducción de trabajo innecesario, medición antes de optimizar y trazabilidad de supuestos. La sostenibilidad web se concreta en activos iniciales pequeños, carga diferida, transferencia consciente y experiencia accesible.

## Reglas preventivas

- **Frontend:** páginas no críticas se cargan de forma diferida; cada cambio registra tamaño de build; no se agregan imágenes pesadas sin formato/tamaño justificado.
- **Backend:** los listados de alto volumen deben tener límite máximo, desplazamiento y filtros validados; no se añaden índices sin perfil de consultas.
- **Datos:** métricas logísticas deben identificar método, fuente, período y si son estimadas; nunca declarar CO2e real sin datos propios.
- **Seguridad:** tokens solo en cabecera Authorization, secretos fuera de `VITE_*`, autorización en backend y RLS probado en entorno aislado antes de remoto.
- **Pruebas:** cambios ejecutan pruebas afectadas, typecheck/lint y cobertura backend; RLS/Lighthouse solo en entornos aislados configurados.
- **Accesibilidad:** controles operables por teclado, etiquetas accesibles, foco visible y contraste revisado con evidencia; no declarar WCAG sin auditoría.

## Matriz de estándares

| Estándar/principio | Práctica | Componente | Evidencia | Estado |
| --- | --- | --- | --- | --- |
| ISO 25010: desempeño | Presupuesto y medición de bundle | Frontend/Vite | Activo inicial 126,863 gzip | Implementado |
| Green Software: medir antes | Comparar mismo entorno/commit | Scripts de build | `measure:baseline` | Implementado |
| Sostenibilidad web | Carga diferida de páginas | `App.tsx` | Chunks por ruta | Implementado |
| ISO 25010: eficiencia | Límite, offset y filtros | API pedidos | Pruebas de paginación | Implementado |
| ISO 25010: seguridad | Alcance por rol y token | FastAPI/Supabase | Pruebas locales; RLS pendiente | Parcial |
| ISO 25010: fiabilidad | Validación y pruebas aisladas | Backend/frontend | 109 backend, 26 frontend | Implementado |
| Green Software: intensidad energética | Factor y kWh trazables | Vehículos/rutas | Campos locales y pruebas | Parcial |
| Accesibilidad | Auditoría automatizada y manual | UI | Sin Lighthouse/auditoría | Pendiente |

## Criterios de aceptación contra regresiones

1. Typecheck, lint y pruebas afectadas finalizan sin errores; el build es reproducible.
2. Ningún activo inicial aumenta sin una comparación registrada y justificación.
3. Todo listado nuevo de volumen potencial aplica límite máximo y autorización antes de devolver datos.
4. Filtros y paginación tienen pruebas de límites, permisos y resultados.
5. Cada métrica de emisiones/energía declara Estimada o Medida, además de fuente y método.
6. No se aplica migración Supabase ni se declara RLS validado sin prueba local aislada.
7. Todo cambio de UI conserva acceso por teclado y etiquetas; WCAG exige auditoría específica.
