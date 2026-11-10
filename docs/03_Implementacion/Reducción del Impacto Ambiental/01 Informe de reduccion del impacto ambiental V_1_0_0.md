# Informe de reduccion del impacto ambiental V_1_0_0

**Versión:** V_1_0_0  
**Fecha:** 2026-11-10  
**Clasificación de evidencia:** Observada, Medida, Estimada, Propuesta o No verificable.

## Resumen ejecutivo

Este informe evalúa oportunidades de reducción del impacto ambiental de EcoLogística Lima desde dos dimensiones: eficiencia digital del software y eficiencia logística modelada. La evidencia digital procede de builds y pruebas locales reproducibles. La evidencia logística procede de una simulación técnica con pedidos sintéticos, capacidades publicadas de vehículos comerciales y restricciones coherentes con reparto urbano; por ello sus resultados son **estimaciones académicas**, no resultados operativos ni reducciones reales de DistriRápido.

La mejora medida es la reducción de 16.9% gzip en el activo JavaScript inicial mediante carga diferida por ruta. La simulación muestra factibilidad bajo una demanda sintética de 5,700 kg, pero no permite concluir cuál escenario genera menos CO2e porque no se midieron combustible, energía ni distancia vial real.

## Propósito y alcance

Este informe documenta la eficiencia digital y logística de EcoLogística Lima sin atribuir al proyecto resultados de referencias externas. Cubre el código local de `Programa_Proyectos_2/`: React + TypeScript + Vite; FastAPI + SQLAlchemy; PostgreSQL/Supabase. No cubre operación remota, telemetría de flota, consumo energético real ni emisiones verificadas.

La arquitectura observada es frontend React autenticado con Supabase, cliente HTTP hacia FastAPI y persistencia SQL a través del backend. Las migraciones Supabase están versionadas localmente; no se aplicaron durante esta evaluación.

## Objetivos y metodología

| Objetivo | Método aplicado | Resultado válido |
| --- | --- | --- |
| Medir eficiencia digital | Build Vite antes/después y pruebas locales | Cambio reproducible de tamaño de activo |
| Modelar eficiencia logística | Planificador determinista con mismas entradas | Factibilidad, rutas, km y tonelada-km estimados |
| Mantener trazabilidad | Clasificación de evidencia, ficha técnica y fórmula declarada | Separación entre dato medido y supuesto |
| Evitar conclusiones no sustentadas | Exclusión de CO2e, litros y kWh sin fuente operativa | Limitaciones explícitas |

Los pedidos, coordenadas y tiempos de la simulación fueron creados exclusivamente para prueba técnica. Son plausibles para Lima urbana, pero no representan clientes, recorridos, demanda ni operación histórica de la empresa. Las capacidades de vehículo se tomaron de fichas de fabricante citadas en este informe.

## Diagnóstico y línea base

| Elemento | Resultado | Clasificación | Evidencia |
| --- | --- | --- | --- |
| Build inicial antes de carga diferida | JS 592,456 bytes; 152,678 gzip | Medida | Build Vite local |
| Build inicial posterior | JS 444,576 bytes; 126,863 gzip | Medida | Build Vite local |
| Cambio reproducible | -147,880 bytes; -25,815 gzip (-16.9%) en activo inicial | Medida | Mismo entorno de build |
| Frontend | 26/26 pruebas, typecheck y build correctos | Medida | `npm run check` |
| Backend | 109/109 pruebas; 78% cobertura; Ruff correcto | Medida | pytest con cobertura y Ruff |
| Dependencias Python | Sin requisitos rotos | Medida | `pip check` |
| Dependencias npm | 9 vulnerabilidades moderadas reportadas | Medida | `npm ci` |

Los tamaños de build no equivalen a transferencia real, Web Vitals, consumo eléctrico ni experiencia de usuario.

## Impacto digital

| Área | Diagnóstico | Cambio | Evidencia | Estado |
| --- | --- | --- | --- | --- |
| Bundle | Las páginas se cargaban en el JS inicial | Carga diferida por ruta con React.lazy/Suspense | Reducción medida del activo inicial | Implementado |
| Solicitudes | Listado de pedidos sin límite | API con `limit`, `offset`, estado/fecha y `X-Total-Count`; UI con páginas de 25 | Pruebas de pedidos y frontend | Implementado |
| Renderizado | Sin Web Vitals | Pendiente de Lighthouse/navegador aislado | Herramienta no disponible | Pendiente |
| API/SQL | Sin perfil de latencia o plan SQL | No se agregaron índices, caché ni compresión sin evidencia | Inspección y línea base | Pendiente |
| Dependencias | Advertencias de npm | Revisión dirigida de auditoría | `npm ci` | Propuesto |

### Métricas de impacto ambiental del software

La huella digital se evaluará de forma independiente a la huella logística. Los tamaños de build, solicitudes y tiempos son indicadores operativos; solo se convertirán a carbono cuando exista una frontera de medición, energía y factor de intensidad documentados.

| Métrica | Unidad | Fórmula o fuente | Evidencia mínima | Estado actual |
| --- | --- | --- | --- | --- |
| JS inicial | bytes y bytes gzip | Artefacto Vite | Build reproducible | Medida: 444,576 / 126,863 gzip |
| Transferencia por flujo | bytes transferidos por sesión | DevTools/har o proxy local | Navegador aislado, caché documentada | No verificable |
| Solicitudes HTTP | solicitudes por flujo y método | Registro de red | Flujo autenticado reproducible | No verificable |
| Latencia API | ms p50/p95 por endpoint | Instrumentación de servidor o prueba de carga | Muestra, entorno y endpoint | No verificable |
| Trabajo de datos | filas devueltas, límite, offset y filtro | Respuesta/API y log de consulta | Consulta reproducible | Parcial: pedidos limitados a 200 |
| Energía digital | kWh por unidad funcional | Medidor de infraestructura o proveedor | Frontera, período y asignación | No verificable |
| Carbono de software (SCI) | gCO2e por unidad funcional | (E × I + M) / R | E, I, M y R con fuentes | No verificable |
| Intensidad funcional | bytes, ms o gCO2e por planificación/ruta | Métrica anterior / número de planificaciones | Unidad funcional definida | Propuesta |

Para este sistema, la unidad funcional propuesta es **una planificación de ruta completada** y, de forma secundaria, **una solicitud API atendida**. La especificación SCI define E como energía, I como intensidad de carbono de la electricidad, M como emisiones incorporadas del hardware y R como unidad funcional; sin esos datos no se calculará ni afirmará un SCI. [Software Carbon Intensity](https://greensoftware.foundation/standards/sci/) Las [Web Sustainability Guidelines de W3C](https://www.w3.org/TR/web-sustainability-guidelines/) respaldan reducir transferencia y trabajo innecesario, pero no sustituyen la medición.

### Protocolo de precisión para revisión

1. Registrar commit, fecha, dispositivo, red, caché, entorno y conjunto de datos antes de cada medición.
2. Reportar percentiles p50/p95 para latencia y el número de ejecuciones; no solo el mejor resultado.
3. Mantener por separado: **medición digital**, **estimación logística** y **dato técnico de fabricante**.
4. Para convertir a CO2e digital, anexar origen del kWh, región/hora del factor eléctrico y método de asignación de hardware.
5. Comparar antes/después únicamente con la misma unidad funcional, flujo, entorno y datos de entrada.

### Simulación técnica reproducible — no operativa

Se ejecutó el planificador local el 2026-11-10 con cuatro pedidos de prueba **sintéticos**, no pertenecientes a DistriRápido, para comprobar la sensibilidad del algoritmo a la capacidad. Entradas compartidas: depósito (-12.055, -77.045), pedidos en Lima, pesos de 1,000; 1,200; 1,500 y 2,000 kg (5,700 kg total), 2 m³ por pedido, ventanas 08:00–17:00, velocidad de 25 km/h, máximo 200 km y sin factor de emisiones. La distancia es Haversine; no es distancia vial.

| Escenario | Flota teórica | Factible | Rutas | Entregas | Distancia estimada | Tonelada-km estimada | Clasificación |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| A | 2 × Canter 3.6T (3,630 kg c/u) | Sí | 2 | 4 | 20.750 km | 31.386 t-km | Estimada / técnica |
| B | 2 × Canter 4T (4,134 kg c/u) | Sí | 2 | 4 | 19.429 km | 28.313 t-km | Estimada / técnica |
| C | 1 × Canter 6T (6,040 kg) | Sí | 1 | 4 | 18.254 km | 48.712 t-km | Estimada / técnica |

La menor distancia del escenario C no demuestra una reducción ambiental real: faltan consumo, combustible, tráfico, carrocería, factor de emisiones y datos operativos. La tonelada-km superior en C refleja que más carga viaja durante más tramos; es una métrica de trabajo logístico, no una calificación ambiental por sí sola. No se calcularon litros, kWh ni CO2e.

### Interpretación académica de la simulación

Los escenarios responden a la pregunta técnica “¿qué configuraciones de capacidad pueden atender una demanda de prueba bajo las restricciones del planificador?”. No responden todavía “¿qué vehículo contamina menos?” ni “¿cuánto reducirá EcoLogística sus emisiones?”. Para responder estas últimas preguntas se requiere contrastar la misma ruta real con combustible o kWh registrados y factores de emisión documentados.

## Impacto logístico

| Área | Situación | Clasificación | Limitación |
| --- | --- | --- | --- |
| Distancia | Haversine entre paradas; admite depósito y retorno si se informan | Estimada | No usa red vial, tráfico real ni GPS |
| Carga | Capacidad kg/m³ y cálculo de tonelada-km | Implementado / Estimado | Depende de peso y distancia de datos |
| Energía | Campo kWh/km para vehículo eléctrico | Implementado | Factor eléctrico y telemetría pendientes |
| Emisiones | Distancia × factor de vehículo, o kWh × factor eléctrico si ambos existen | Estimada | No es CO2e real ni ciclo de vida |
| Flota | Escenarios locales de furgón, camiones, eléctrico y pickup | Propuesta | No representa flota real |

### Escenarios teóricos con vehículos verificables

Los escenarios siguientes refuerzan la evaluación; no describen vehículos adquiridos, uso real, participación de mercado ni desempeño de DistriRápido. Se seleccionan por adecuación a distribución urbana y por contar con datos técnicos del fabricante disponibles en Perú.

| Escenario | Vehículo de referencia | Dato técnico verificable | Uso teórico | Clasificación |
| --- | --- | --- | --- | --- |
| Última milla | Toyota Hiace Van | Catálogo oficial disponible; configuración y volumen deben confirmarse antes de parametrizar | Pedidos ligeros o voluminosos, con múltiples paradas | Propuesta |
| Carga urbana consolidada | FUSO Canter 3.6T Euro 5 | Carga bruta 3,630 kg; PBV 5,700 kg | Rutas urbanas de carga media con furgón | Propuesta / dato técnico observado |
| Consolidación de mayor carga | FUSO Canter 4T | Carga bruta 4,134 kg; PBV 6,499 kg | Menos paradas, mayor peso o volumen | Propuesta / dato técnico observado |
| Alta carga | FUSO Canter 6T | Carga máxima 6,040 kg | Carga consolidada; no última milla densa | Propuesta / dato técnico observado |

Las fuentes de especificación son [Toyota Hiace Van](https://www.toyotaperu.com.pe/sites/default/files/2024-12/catalogo-van-toyota-hiace.pdf), [FUSO Canter 3.6T](https://www.fuso.com.pe/pdf/canter-3-6t.pdf) y el [comparador FUSO](https://www.fuso.com.pe/comparador). Se deben revisar nuevamente antes de transformar un escenario en una decisión de compra o parámetro operativo.

### Indicadores avanzados de escenario

| Indicador | Fórmula | Interpretación permitida |
| --- | --- | --- |
| Utilización de carga | kg transportados / capacidad técnica kg | Mide el aprovechamiento simulado, no ocupación real |
| Tonelada-km | toneladas por tramo × km por tramo | Base comparable para intensidad logística |
| Km cargados y vacíos | km con carga y retorno sin carga / km total | Identifica potencial de consolidación en el escenario |
| Intensidad por entrega | kg CO2e estimados / entregas | Solo comparable con misma demanda y método |
| Intensidad por tonelada-km | kg CO2e estimados / tonelada-km | Evita comparar solo por número de entregas |
| Calidad del dato | campos medidos / campos requeridos | Expone el nivel de incertidumbre |

GHG Protocol contempla métodos basados en combustible o distancia; este último exige masa, distancia y un factor por vehículo o modo. [Guía de cálculo GHG Protocol](https://ghgprotocol.org/sites/default/files/ghgp/standards/Scope3_Calculation_Guidance_0.pdf) La referencia conceptual por tonelada-km se alinea con GLEC/ISO 14083, sin constituir certificación. [Guía GLEC](https://www.smartfreightcentre.org/documents/38/SFC_Assurance_Guidance_for_GLEC_Framework_Implementation_-_SFC_Jan2019.pdf)

Como contexto de tiempo, los escenarios pueden contrastarse con velocidades de Lima 2025 de 13.9 km/h en punta matinal y 11.7 km/h en punta vespertina. Son datos agregados de ciudad, no telemetría de EcoLogística. [TomTom Traffic Index Lima](https://www.tomtom.com/traffic-index/city/lima/)

## Mejoras implementadas

| Problema | Cambio técnico | Impacto esperado/medido | Limitación | Estado |
| --- | --- | --- | --- | --- |
| Bundle inicial alto | Lazy loading de páginas | Reducción medida de 16.9% gzip en JS inicial | Chunks posteriores se transfieren al navegar | Implementado |
| Listado no acotado | Paginación y filtros seguros de pedidos | Menos registros por respuesta cuando se usa paginación | Sin medición HTTP/SQL ni búsqueda textual en servidor | Implementado |
| Métricas de ruta incompletas | Campos y cálculo de depósito/retorno, tonelada-km, kWh y fuente | Trazabilidad de estimaciones | Migración PostgreSQL pendiente de entorno local | Implementado localmente |
| Mensajes estáticos de sostenibilidad | Etiquetado y revisión de datos | Evita interpretar simulaciones como resultados | Revisión visual completa pendiente | Propuesto |

## Resultados de pruebas, limitaciones y pendientes

Las pruebas locales utilizan SQLite en memoria y un proveedor de identidad simulado. Las pruebas API no sustituyen una prueba de red o de Supabase real. RLS, Lighthouse y migración PostgreSQL no se ejecutaron por ausencia de Supabase CLI/Docker activo. No se aplicaron migraciones ni cambios remotos.

Pendientes: perfil de navegador y API, plan de consultas SQL, RLS local, datos reales de flota/rutas/carga, factores documentados y revisión de vulnerabilidades npm.

Para avanzar de escenarios teóricos a resultados medidos se requieren, como mínimo: vehículo y carrocería reales, peso por pedido, odómetro/GPS, combustible o kWh, ruta realizada, ventana horaria y fuente del factor de emisión. Hasta entonces, cualquier indicador del presente informe se reporta como **Propuesta** o **Estimada**.

## Conclusiones

1. **[Medida]** La carga diferida redujo el JavaScript inicial en 16.9% gzip en el entorno local evaluado; este es el único resultado de mejora digital cuantificado.
2. **[Estimada]** Los tres escenarios de flota atendieron el conjunto sintético. El Canter 6T lo hizo con una ruta y menor distancia Haversine, pero no existe evidencia suficiente para declararlo ambientalmente superior.
3. **[Observada]** El software dispone de campos y cálculo para depósito, retorno, tonelada-km y energía; la migración y validación RLS siguen pendientes de un entorno Supabase local aislado.
4. **[No verificable]** No se cuantificó CO2e digital ni logístico real. El informe establece el protocolo y los datos necesarios para hacerlo de forma auditable.
