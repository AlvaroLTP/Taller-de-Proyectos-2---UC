/**
 * Crea el formulario "Evaluación de usabilidad — EcoLogística Lima".
 * Estado del artefacto: diseñado, no ejecutado automáticamente.
 *
 * Después de ejecutar, revise el registro para obtener:
 * - URL de edición.
 * - URL para participantes.
 */
function crearFormularioEvaluacionUX() {
  const titulo = 'Evaluación de usabilidad — EcoLogística Lima';
  const descripcion = [
    'Responda únicamente sobre las funciones que utilizó durante la sesión de prueba.',
    '',
    'Escala de respuesta:',
    '1. Totalmente en desacuerdo.',
    '2. En desacuerdo.',
    '3. Ni de acuerdo ni en desacuerdo.',
    '4. De acuerdo.',
    '5. Totalmente de acuerdo.',
    '',
    'Este cuestionario recoge percepciones de uso y no sustituye la evaluación heurística realizada por especialistas.'
  ].join('\n');

  const secciones = [
    {
      heuristica: '1. Visibilidad del estado del sistema',
      descripcion: 'Retroalimentación durante y después de las acciones realizadas.',
      indicadores: [
        {
          id: 'I01',
          indicador: 'Retroalimentación de procesamiento',
          item: 'Mientras realizaba una acción, pude identificar si el sistema estaba procesando mi solicitud.'
        },
        {
          id: 'I02',
          indicador: 'Confirmación del resultado',
          item: 'Después de una acción, el sistema me indicó claramente cuál fue el resultado.'
        }
      ]
    },
    {
      heuristica: '2. Correspondencia entre el sistema y el mundo real',
      descripcion: 'Lenguaje y secuencia relacionados con las tareas logísticas realizadas.',
      indicadores: [
        {
          id: 'I03',
          indicador: 'Terminología comprensible',
          item: 'Los términos utilizados en la interfaz coincidieron con el lenguaje de las tareas logísticas que realicé.'
        },
        {
          id: 'I04',
          indicador: 'Secuencia acorde con la tarea',
          item: 'El orden de los pasos coincidió con la forma en que esperaba realizar la tarea.'
        }
      ]
    },
    {
      heuristica: '3. Control y libertad del usuario',
      descripcion: 'Posibilidad de cancelar, salir y recuperar el contexto de trabajo.',
      indicadores: [
        {
          id: 'I05',
          indicador: 'Salida o cancelación',
          item: 'Pude cancelar o salir de una acción cuando lo necesité.'
        },
        {
          id: 'I06',
          indicador: 'Retorno al contexto',
          item: 'Después de cerrar o cancelar una acción, pude continuar desde un contexto que reconocía.'
        }
      ]
    },
    {
      heuristica: '4. Consistencia y estándares',
      descripcion: 'Comportamiento uniforme de controles, nombres, estados y formatos.',
      indicadores: [
        {
          id: 'I07',
          indicador: 'Consistencia de controles',
          item: 'Los controles similares funcionaron de la misma manera en las pantallas que utilicé.'
        },
        {
          id: 'I08',
          indicador: 'Consistencia de términos y formatos',
          item: 'Los nombres, estados y formatos mantuvieron el mismo significado durante mis tareas.'
        }
      ]
    },
    {
      heuristica: '5. Prevención de errores',
      descripcion: 'Orientación previa y protección frente a acciones sensibles.',
      indicadores: [
        {
          id: 'I09',
          indicador: 'Orientación antes de actuar',
          item: 'Antes de enviar datos, la interfaz me permitió identificar qué información era obligatoria o inválida.'