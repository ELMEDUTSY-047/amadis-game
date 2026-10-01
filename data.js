// =================================================================
// BANCO DE DATOS: 10 EQUIPOS PRECARGADOS Y PREGUNTAS EXTENDIDAS
// =================================================================

// 10 Equipos Misioneros precargados
const EQUIPOS_PRECARGADOS = [
    { id: 1, nombre: "Leones de San Marcos", sol: "Mateo", luna: "Valeria", color: "#e76f51" },
    { id: 2, nombre: "Misioneros de San Francisco", sol: "Santiago", luna: "Mariana", color: "#2a9d8f" },
    { id: 3, nombre: "Guerreros de Guadalupe", sol: "Diego", luna: "Andrea", color: "#e9c46a" },
    { id: 4, nombre: "Apóstoles del Monte", sol: "Sebastián", luna: "Camila", color: "#f4a261" },
    { id: 5, nombre: "Ángeles de la Sierra", sol: "Leonardo", luna: "Ximena", color: "#8338ec" },
    { id: 6, nombre: "Peregrinos de la Esperanza", sol: "Emiliano", luna: "Renata", color: "#3a86ff" },
    { id: 7, nombre: "Faro de Santa Teresa", sol: "Gabriel", luna: "Regina", color: "#06d6a0" },
    { id: 8, nombre: "Siervos de San Juan", sol: "Rodrigo", luna: "Valentina", color: "#ffb703" },
    { id: 9, nombre: "Antorchas de San Pablo", sol: "Daniel", luna: "Natalia", color: "#d90429" },
    { id: 10, nombre: "Mensajeros de la Paz", sol: "Alejandro", luna: "Sofía", color: "#118ab2" }
];

// Banco amplio de situaciones y preguntas basadas en la guía
const BANCO_PREGUNTAS_VERANO = [
    {
        id: 1,
        hora: "09:00 AM",
        fase: "VISITEO A LA COMUNIDAD",
        icono: "🏡",
        titulo_escenario: "Visiteo con Adultos Mayores",
        descripcion: "Llegan a la casa de una abuelita de la comunidad. El equipo debe romper el hielo con cercanía.",
        pregunta: "Según la guía de misiones, ¿cuál es un tema de conversación recomendado para adultos mayores?",
        opciones: [
            "Preguntar qué es lo que más le gusta de vivir aquí, sus comidas típicas o sus plantas favoritas",
            "Preguntarle qué película de ciencia ficción le gusta ver en streaming",
            "Hablar de política electoral y partidos políticos",
            "Decirle que solo tienen 2 minutos para hablar"
        ],
        correcta: 0,
        explicacion: "¡Correcto! La guía recomienda preguntar por su historia, su pueblo, comidas típicas y plantas favoritas."
    },
    {
        id: 2,
        hora: "10:30 AM",
        fase: "VISITEO A NIÑOS",
        icono: "🧒",
        titulo_escenario: "Charla en el Visiteo Infantil",
        descripcion: "En una de las casas los reciben dos niños pequeños que están algo tímidos.",
        pregunta: "¿Qué preguntas de la guía están diseñadas específicamente para romper el hielo con niños?",
        opciones: [
            "¿Cuál es tu color favorito?, ¿te gustan los animales?, ¿cuál es tu juego favorito?",
            "¿Cuánto dinero gana tu familia al mes?",
            "¿A qué hora te vas a dormir todos los días?",
            "¿Sabes cuántos libros tiene la Biblia?"
        ],
        correcta: 0,
        explicacion: "¡Exacto! La tabla de visiteo propone temas lúdicos: colores, animales, comida y juegos favoritos."
    },
    {
        id: 3,
        hora: "11:30 AM",
        fase: "ORACIÓN EN EL HOGAR",
        icono: "🙏",
        titulo_escenario: "La Frase de Inicio",
        descripcion: "La familia les pide orar por ellos antes de continuar el recorrido.",
        pregunta: "¿Con qué frase exacta deben iniciar TODAS las oraciones según la guía?",
        opciones: [
            "Recordemos que nos encontramos ante la santa presencia del Señor: adorémosle",
            "En el nombre del Padre todopoderoso comenzamos...",
            "Señor Jesús, bendice esta casa...",
            "Ave María Purísima, sin pecado concebida..."
        ],
        correcta: 0,
        explicacion: "¡Perfecto! La guía subraya en mayúsculas: 'Recordemos que nos encontramos ante la santa presencia del Señor: adorémosle'."
    },
    {
        id: 4,
        hora: "12:00 PM",
        fase: "ORACIÓN POR ENFERMOS",
        icono: "❤️‍🩹",
        titulo_escenario: "Visita a un Hermano Enfermo",
        descripcion: "En la última casa del barrio hay una persona en cama por enfermedad y piden oración.",
        pregunta: "En la oración para enfermos de la guía, ¿qué pedimos a Dios para nosotros como misioneros?",
        opciones: [
            "Un corazón dispuesto para escuchar, ayudar y ser instrumentos de su amor",
            "Que nos permita curar físicamente a la persona de inmediato",
            "Que no nos contagiemos de ninguna enfermedad",
            "Que nos dé permiso de marcharnos rápido a comer"
        ],
        correcta: 0,
        explicacion: "¡Muy bien! Rezamos: 'Danos también a nosotros un corazón dispuesto para escuchar, ayudar y ser instrumentos de tu amor'."
    },
    {
        id: 5,
        hora: "02:00 PM",
        fase: "ORACIÓN DE LOS ALIMENTOS",
        icono: "🍲",
        titulo_escenario: "La Comida del Equipo",
        descripcion: "El equipo se reúne a las 14:00 para la comida comunitaria.",
        pregunta: "En la oración de los alimentos de la guía, ¿a quiénes se pide bendecir de manera especial?",
        opciones: [
            "A los alimentos, a las manos que los producen y a todos los involucrados en que lleguen a la mesa",
            "Únicamente a los misioneros que van a comer",
            "A los restaurantes del pueblo",
            "A quienes aportaron dinero para la misión"
        ],
        correcta: 0,
        explicacion: "¡Exacto! Se bendice a la comida, a las manos que la producen y a todos los que hicieron posible que llegue a la mesa."
    },
    {
        id: 6,
        hora: "03:00 PM",
        fase: "JUEGO CON NIÑOS",
        icono: "🐥",
        titulo_escenario: "Cancionero: El Pollo",
        descripcion: "Empieza la tarde con los niños en el atrio y cantan 'El Pollo'.",
        pregunta: "¿Cuál es el orden base de las partes del cuerpo en 'El Pollo' según la guía?",
        opciones: [
            "1. Alita, 2. Otra alita, 3. Patita, 4. Otra patita, 5. Piquito, 6. Colita",
            "1. Piquito, 2. Cabecita, 3. Pancita, 4. Colita",
            "1. Patita, 2. Otra patita, 3. Alita, 4. Colita",
            "1. Colita, 2. Alita, 3. Piquito, 4. Pancita"
        ],
        correcta: 0,
        explicacion: "¡Excelente! La base es alita, otra alita, patita, otra patita, piquito y colita."
    },
    {
        id: 7,
        hora: "03:30 PM",
        fase: "JUEGO CON NIÑOS",
        icono: "🥗",
        titulo_escenario: "Cancionero: El Baile de la Ensalada",
        descripcion: "Sigue la animación infantil con el baile de la ensalada.",
        pregunta: "En 'El baile de la ensalada', ¿cuál es el primer vegetal con el que se inicia la canción según el ejemplo de la guía?",
        opciones: [
            "La lechuga",
            "El tomate",
            "La zanahoria",
            "El aguacate"
        ],
        correcta: 0,
        explicacion: "¡Correcto! El ejemplo de la guía inicia con: 'LA LECHUGAAAA', luego el tomate, la zanahoria y el pepino."
    },
    {
        id: 8,
        hora: "04:30 PM",
        fase: "JUEGO CON NIÑOS",
        icono: "🕊️",
        titulo_escenario: "Cierre de Actividades Infantiles",
        descripcion: "Dan las 17:00 y es hora de despedir a los niños.",
        pregunta: "¿Con qué se debe cerrar SIEMPRE el juego con niños según la instrucción de la guía?",
        opciones: [
            "Con actividad de reflexión litúrgica y actividad de agradecimiento",
            "Con una carrera de velocidad para ver quién gana dulces",
            "Diciéndoles que corran a sus casas de inmediato",
            "Con aplausos únicamente sin oración"
        ],
        correcta: 0,
        explicacion: "¡Así es! La guía marca en mayúsculas: SIEMPRE CERRAMOS JUEGO CON NIÑOS CON ACTIVIDAD DE REFLEXIÓN LITÚRGICA Y AGRADECIMIENTO."
    },
    {
        id: 9,
        hora: "05:00 PM",
        fase: "ACTIVIDADES CON ADULTOS",
        icono: "🧣",
        titulo_escenario: "El Paliacate del Perdón",
        descripcion: "Toca la reunión en círculo con los adultos de la comunidad.",
        pregunta: "¿Qué simboliza el paliacate y cuál es su regla?",
        opciones: [
            "Representa la confianza y el respeto; solo quien lo tiene habla y se invita sin obligación",
            "Representa un premio que se gana contestando preguntas de doctrina",
            "Es un castigo para quien llegue tarde",
            "Se debe lanzar por los aires para que lo atrape alguien al azar"
        ],
        correcta: 0,
        explicacion: "¡Exacto! Es un símbolo de respeto y escucha empática para compartir dolores, pedir perdón y orar juntos."
    },
    {
        id: 10,
        hora: "06:00 PM",
        fase: "EL SANTO ROSARIO",
        icono: "📿",
        titulo_escenario: "Misterios y Días de la Semana",
        descripcion: "Se preparan para dirigir el Santo Rosario con la comunidad.",
        pregunta: "¿Qué misterios corresponden a cada día según la tabla de la guía?",
        opciones: [
            "Lunes/Sábado: Gozosos | Martes/Viernes: Dolorosos | Miércoles/Domingo: Gloriosos | Jueves: Luminosos",
            "Lunes: Luminosos | Martes: Gloriosos | Miércoles: Dolorosos | Jueves: Gozosos",
            "Todos los días se rezan los misterios que el guía elija al azar",
            "Solo se rezan los Gozosos toda la semana"
        ],
        correcta: 0,
        explicacion: "¡Muy bien! Es la distribución oficial: Gozosos (Lun/Sáb), Dolorosos (Mar/Vie), Gloriosos (Mié/Dom), Luminosos (Jue)."
    },
    {
        id: 11,
        hora: "06:30 PM",
        fase: "EL SANTO ROSARIO",
        icono: "🙏",
        titulo_escenario: "Regla de Nones y Pares",
        descripcion: "Van a comenzar el segundo misterio del Rosario.",
        pregunta: "Según la nota importante de la guía, ¿cómo se distribuyen los misterios entre el guía y la comunidad?",
        opciones: [
            "Misterios nones (1°, 3°, 5°) inicia el guía; misterios pares (2°, 4°) inicia la comunidad",
            "El guía reza todo solo en voz alta sin que nadie responda",
            "La comunidad reza los primeros cuatro y el guía solo el quinto",
            "No hay ningún orden, quien quiera hablar empieza"
        ],
        correcta: 0,
        explicacion: "¡Excelente! Nones los inicia el guía y responde la asamblea; pares los inicia la asamblea y responde el guía."
    },
    {
        id: 12,
        hora: "07:30 PM",
        fase: "SANTA MISA",
        icono: "⛪",
        titulo_escenario: "Respuestas Litúrgicas de la Misa",
        descripcion: "Durante la Misa, el sacerdote dice: 'Por Cristo, con Él y en Él, a ti Dios Padre omnipotente...'",
        pregunta: "¿Qué responde con firmeza toda la asamblea en este momento?",
        opciones: [
            "Amén.",
            "Te alabamos, Señor.",
            "Demos gracias a Dios.",
            "Y con tu espíritu."
        ],
        correcta: 0,
        explicacion: "¡Correcto! Es el Gran Amén que concluye la Plegaria Eucarística."
    },
    {
        id: 13,
        hora: "09:00 PM",
        fase: "RETRO DIARIA",
        icono: "❤️",
        titulo_escenario: "El Lema Misionero",
        descripcion: "Termina la jornada a las 21:00 PM con la evaluación del equipo.",
        pregunta: "¿Qué versículo de 1 Corintios 16 concluye la guía como espíritu de misión?",
        opciones: [
            "Y todo lo que hagan, háganlo con amor",
            "El que no trabaje que no coma",
            "Todo tiene su tiempo bajo el sol",
            "Sean fuertes para vencer a los demás"
        ],
        correcta: 0,
        explicacion: "¡Amén! '1 Corintios 16:14 - Y todo lo que hagan, háganlo con amor'."
    }
];

// Función para barajar preguntas o incisos (Algoritmo Fisher-Yates, equivalente a C)
function barajarArreglo(arreglo) {
    const copia = [...arreglo];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}
