# 04 Usabilidad V_1_0_0

## Ficha técnica

- **Sistema:** EcoLogística Lima, versión de evaluación del Sprint 4. Registrar URL y commit al realizar la sesión real.
- **Instrumento:** System Usability Scale (SUS), aplicado después de completar las tareas. Escala Likert de 1 a 5: 1 totalmente en desacuerdo, 2 en desacuerdo, 3 neutral, 4 de acuerdo, 5 totalmente de acuerdo.
- **Muestra del ejemplo:** 8 perfiles simulados (3 operadores, 3 conductores y 2 administradores). **Encuestas reales disponibles: 0.** La composición ilustra los tres roles del sistema. Para la evaluación real, reclutar usuarios de esos roles con distinta experiencia y registrar el tamaño efectivo.
- **Procedimiento:** usar cuentas de prueba y pedidos ficticios. Presentar el objetivo de cada tarea, registrar si se completó, el tiempo, los errores y la asistencia, y aplicar el SUS individualmente al terminar.

| Perfil | Tareas del protocolo |
| --- | --- |
| Operador | Iniciar sesión, buscar un pedido, generar una ruta con recursos disponibles y revisar la asignación. |
| Conductor | Iniciar sesión, localizar la siguiente entrega, actualizar su estado y consultar el historial. |
| Administrador | Iniciar sesión, localizar un vehículo, revisar su disponibilidad y consultar el estado de una ruta. |

### Cuestionario

1. Creo que me gustaría usar este sistema con frecuencia.
2. El sistema me pareció innecesariamente complejo.
3. Pensé que el sistema era fácil de usar.
4. Creo que necesitaría ayuda técnica para usar el sistema.
5. Encontré que las funciones del sistema estaban bien integradas.
6. Encontré demasiadas inconsistencias en el sistema.
7. Creo que la mayoría de las personas aprendería a usar el sistema rápidamente.
8. El sistema me pareció engorroso de usar.
9. Me sentí seguro al usar el sistema.
10. Necesité aprender muchas cosas antes de poder usar el sistema.

## Resultados cuantitativos 

Los siguientes valores se generaron para demostrar el cálculo. La evaluación con usuarios de DistriRápido S.A.C. queda pendiente.

| ID | Perfil | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| S01 | Operador | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 |
| S02 | Operador | 4 | 3 | 4 | 3 | 4 | 2 | 3 | 3 | 4 | 3 |
| S03 | Operador | 5 | 2 | 4 | 1 | 5 | 2 | 4 | 2 | 4 | 2 |
| S04 | Conductor | 4 | 2 | 4 | 3 | 4 | 2 | 4 | 2 | 4 | 3 |
| S05 | Conductor | 4 | 3 | 3 | 3 | 4 | 2 | 4 | 3 | 4 | 3 |
| S06 | Conductor | 5 | 1 | 5 | 2 | 4 | 2 | 5 | 2 | 4 | 2 |
| S07 | Administrador | 4 | 2 | 4 | 2 | 5 | 2 | 4 | 2 | 4 | 2 |
| S08 | Administrador | 4 | 2 | 4 | 2 | 4 | 2 | 5 | 2 | 4 | 3 |

1. Restar 1 a cada respuesta impar.
2. Restar cada respuesta par de 5.
3. Sumar las diez contribuciones (rango de 0 a 40) y multiplicar por 2,5. El resultado SUS se expresa en una escala de 0 a 100.

| ID | Contribuciones P1–P10 | Suma | Puntaje SUS |
| --- | --- | ---: | ---: |
| S01 | 3 + 3 + 3 + 3 + 3 + 3 + 3 + 3 + 3 + 3 | 30 | 75,0 |
| S02 | 3 + 2 + 3 + 2 + 3 + 3 + 2 + 2 + 3 + 2 | 25 | 62,5 |
| S03 | 4 + 3 + 3 + 4 + 4 + 3 + 3 + 3 + 3 + 3 | 33 | 82,5 |
| S04 | 3 + 3 + 3 + 2 + 3 + 3 + 3 + 3 + 3 + 2 | 28 | 70,0 |
| S05 | 3 + 2 + 2 + 2 + 3 + 3 + 3 + 2 + 3 + 2 | 25 | 62,5 |
| S06 | 4 + 4 + 4 + 3 + 3 + 3 + 4 + 3 + 3 + 3 | 34 | 85,0 |
| S07 | 3 + 3 + 3 + 3 + 4 + 3 + 3 + 3 + 3 + 3 | 31 | 77,5 |
| S08 | 3 + 3 + 3 + 3 + 3 + 3 + 4 + 3 + 3 + 2 | 30 | 75,0 |

El promedio de las ocho filas es **73,75** (590 ÷ 8). Para el estudio real, repetir el mismo cálculo con los cuestionarios completos y registrar por separado las respuestas incompletas.

## Análisis e interpretación

En el ejemplo, el promedio supera el umbral de 68 de la consigna y cae en el grado **B−** de la escala curva de Sauro y Lewis (B−: 72,6–74,0), usando el promedio redondeado a un decimal. El resultado describe los datos simulados. [Escala de calificación SUS de Sauro y Lewis, tabla 3](https://measuringu.com/wp-content/uploads/2023/10/2021_UsabilityAndUserExperienceDesignAndEvaluation_Chapter38_Preprint.pdf)

| Posible dificultad que se comprobará | Evidencia que debe registrarse | Mejora propuesta |
| --- | --- | --- |
| Distinguir por qué un pedido no se puede planificar | Intentos fallidos y consultas al facilitador durante la generación de rutas | Mostrar el requisito incumplido junto al pedido y una acción para corregirlo. |
| Encontrar la siguiente entrega desde el móvil | Tiempo y pulsaciones hasta identificar la parada correcta | Mostrar la próxima parada al inicio, con su estado y un botón para abrirla. |
| Confirmar que un cambio de estado se guardó | Repeticiones de la acción o dudas después de guardar | Mostrar una confirmación contextual con el nuevo estado. |

Contrastar estas hipótesis con las observaciones de las sesiones y repetir el SUS después de aplicar las mejoras priorizadas.
