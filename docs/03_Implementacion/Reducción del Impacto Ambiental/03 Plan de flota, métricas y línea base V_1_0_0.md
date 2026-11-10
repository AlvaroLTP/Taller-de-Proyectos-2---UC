# Plan de flota, métricas y línea base

**Versión:** 1.0.0  
**Fecha:** 2026-11-10  
**Estado:** Propuesta aprobada para implementación local; no aplicable a Supabase remoto sin aprobación separada.

## Clasificación de evidencia

| Elemento | Clasificación | Límites |
| --- | --- | --- |
| Congestión de Lima 2025 | Medida externa | Contexto de diseño, no telemetría de DistriRápido. |
| Campos y lógica del repositorio | Observada | Inspección estática y pruebas locales. |
| Parámetros de la flota de escenarios | Propuesta / Estimada | No son vehículos, consumo ni emisiones reales de la empresa. |
| CO2e, consumo, tonelada-km y energía futuros | No verificable hasta medir | Exigen datos de ruta, carga, energía y fuente documentada. |

## Escenarios de flota

Los cinco vehículos de prueba se encuentran en `Backend/tests/fixtures/fleet_lima_scenarios.json`. Se usan para validar contratos y futuras simulaciones, nunca para insertar datos operativos.

| Escenario | Vehículo | Uso |
| --- | --- | --- |
| A | Furgón urbano, camión ligero, camión mediano | Última milla, consolidación distrital y alta carga. |
| B | Furgón eléctrico | Piloto de rutas cortas que regresan a un punto de recarga. |
| C | Pickup ligera | Excepciones de acceso; no debe actuar como flota base. |

## Modelo de métricas

La migración local `20261110160000_logistics_metrics_traceability.sql` agrega campos opcionales y trazables:

- Vehículo: `energy_kwh_per_km`, `emission_factor_source`.
- Parámetros: ubicación de depósito y factor eléctrico por kWh.
- Ruta: distancias de salida/retorno, tonelada-km, kWh, método y fuente de emisiones.

Ningún campo nuevo genera por sí mismo una reducción de emisiones. La fórmula y fuente deben almacenarse junto con el resultado. Para vehículos eléctricos, `emissions_per_km = 0` solo evita inventar un factor; no significa cero emisiones de ciclo de vida.

Cuando el depósito y los factores requeridos están informados, el planificador calcula como **estimaciones**: salida depósito–primera entrega, retorno última entrega–depósito, distancia total, tonelada-km transportada hasta cada entrega, energía y emisiones. Sin depósito, conserva el comportamiento histórico y deja salida/retorno sin dato.

## Línea base digital reproducible

Desde `Programa_Proyectos_2/Frontend`:

```powershell
npm run measure:baseline
```

El comando crea un build de producción y muestra un JSON con tamaño bruto y gzip por activo. Mide artefactos de build, no transferencia de red, Web Vitals, renderizado, solicitudes HTTP, latencia API ni consultas SQL.

La siguiente toma debe ejecutarse en navegador contra un entorno local conocido y registrar: URL/commit, dispositivo, caché, número de solicitudes, bytes transferidos, LCP, INP, CLS, tiempo API, SQL y resultado del escenario de ruta.

### Resultado local de carga diferida

Tras aplicar carga diferida por página el 2026-11-10, el activo JavaScript inicial pasó de 592,456 bytes (152,678 gzip) a 444,576 bytes (126,863 gzip): **-147,880 bytes / -25,815 gzip, aproximadamente -16.9% gzip**. El build distribuye las páginas no visitadas en chunks posteriores. Es una medición de artefactos locales; no demuestra por sí misma mejora de LCP, transferencia real o experiencia de usuario.

## Criterios de aceptación de la siguiente fase

1. La línea base digital puede repetirse en el mismo commit y conserva activos/tamaños identificables.
2. Los escenarios de flota validan como contratos de vehículo sin confundirse con datos reales.
3. Las métricas nuevas siguen siendo nulas hasta que existan fuente, período y medición o estimación documentada.
4. La migración se prueba primero en una instancia local desechable; no se aplica remotamente en esta fase.

## Escenarios de vehículos con base técnica verificable

Esta selección no representa una compra, una flota existente ni una cuota de mercado de DistriRápido. Es una **propuesta de vehículos recurrentes para distribución/carga en Perú**, escogida por su disponibilidad documentada, capacidad publicada y aplicabilidad de carga. La familia FUSO Canter se usa como referencia consistente: el fabricante ofrece versiones de 3.6 a 6 toneladas para flotas y distribución; esto no prueba que sea la más vendida.

| Escenario | Vehículo de referencia | Parámetro técnico verificable | Uso de simulación propuesto | Estado |
| --- | --- | --- | --- | --- |
| Última milla / zona urbana | Toyota Hiace Van | Catálogo oficial disponible; confirmar volumen y configuración antes de cargar valores | Pedidos livianos, volumen alto y calles con restricciones | Propuesta; parámetros pendientes |
| Carga urbana consolidada | FUSO Canter 3.6T Euro 5 | Carga bruta 3,630 kg; PBV 5,700 kg; radio mínimo 6.7 m | Entregas urbanas de carga media; carrocería furgón | Propuesta; capacidad verificada |
| Consolidación de mayor carga | FUSO Canter 4T | Carga bruta 4,134 kg; PBV 6,499 kg | Rutas con mayor peso/volumen y menos paradas | Propuesta; capacidad verificada |
| Ruta de alta carga | FUSO Canter 6T | Carga máxima 6,040 kg; largo carrozable aproximado 6,150 mm | Carga consolidada, no última milla densa | Propuesta; capacidad verificada |

Fuentes técnicas: [Toyota Hiace Van](https://www.toyotaperu.com.pe/sites/default/files/2024-12/catalogo-van-toyota-hiace.pdf), [FUSO Canter 3.6T](https://www.fuso.com.pe/pdf/canter-3-6t.pdf), [comparador FUSO](https://www.fuso.com.pe/comparador) y [portafolio de flotas FUSO](https://www.fuso.com.pe/flotas). Las fichas pueden cambiar; deben revalidarse antes de usar sus valores.

## Métricas avanzadas trazables

| Métrica | Cálculo | Dato mínimo | Estado de resultado |
| --- | --- | --- | --- |
| Utilización de carga | carga transportada kg / capacidad técnica kg | Peso de pedidos y capacidad verificable | Estimada |
| Tonelada-km | suma de toneladas transportadas × km por tramo | Peso y distancia por tramo | Estimada |
| Km cargados / km vacíos | km con carga y retorno sin carga / km total | Depósito, secuencia y estado de carga | Estimada |
| Intensidad por entrega | kg CO2e / entregas | Emisiones calculadas y entregas | Estimada |
| Intensidad por tonelada-km | kg CO2e / tonelada-km | Emisiones y tonelada-km | Estimada |
| Combustible | litros medidos, o consumo técnico explícitamente marcado | Odómetro y vales, o ficha técnica | Medida o Estimada |
| Electricidad | kWh × factor eléctrico regional o contractual | kWh y fuente del factor | Medida o Estimada |
| Tiempo de escenario Lima | distancia / velocidad de franja | Distancia y franja horaria | Estimada |
| Calidad del dato | campos medidos / campos requeridos | Registro de procedencia | Medida |

La metodología prioriza combustible real cuando exista; de forma alternativa, GHG Protocol admite el método basado en distancia con masa, distancia y factor por modo/vehículo. [GHG Protocol](https://ghgprotocol.org/sites/default/files/ghgp/standards/Scope3_Calculation_Guidance_0.pdf) La intensidad por tonelada-km se alinea conceptualmente con GLEC/ISO 14083; no constituye una certificación. [Smart Freight Centre](https://www.smartfreightcentre.org/documents/38/SFC_Assurance_Guidance_for_GLEC_Framework_Implementation_-_SFC_Jan2019.pdf)

Para escenarios de tiempo, el contexto de Lima 2025 puede usarse únicamente como hipótesis: 13.9 km/h en punta matinal y 11.7 km/h en punta vespertina, según [TomTom Traffic Index](https://www.tomtom.com/traffic-index/city/lima/). No son velocidades reales de rutas de EcoLogística.

## Reglas de integración

1. Cada fila de simulación debe incluir vehículo, URL de ficha, fecha de consulta, configuración/carrocería y clasificación de evidencia.
2. Una capacidad técnica verificada no autoriza inferir consumo, emisiones o rendimiento en Lima.
3. Se reportará un intervalo de escenarios solo cuando sus supuestos estén enumerados; nunca como ahorro o reducción lograda.
4. La comparación entre vehículos usa la misma demanda, depósito, ventanas horarias y método de distancia.
