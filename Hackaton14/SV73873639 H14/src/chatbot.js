class ChatBot {
  constructor() {
    this.responses = {
      hola: '¡Hola! ¿En qué te puedo ayudar hoy?',
      ayuda: 'Puedes usar los comandos @borrar para limpiar todo, @editar para modificar mensajes, y preguntarme lo que quieras.',
      adios: '¡Hasta luego! Que tengas un buen día.',
      gracias: '¡De nada! Estoy aquí para ayudarte.',
      porfavor: 'Como gustes. ¿En qué más te puedo ayudar?',
      default: 'Soy tu asistente virtual. Puedo responder preguntas básicas y ayudarte con el chat.

Escribe @borrar para limpiar todo
Escribe @editar id  nuevo mensaje para editar'
    },
    this.context = [];
  }

  generateResponse(query, history = []) {
    const q = query.toLowerCase().trim();
    
    if (!q) return 'Por favor, escribe algo después de @bot o @asistente';

    for (const [key, response] of Object.entries(this.responses)) {
      if (q.includes(key) && key !== 'default') {
        return response;
      }
    }

    if (q.includes('borrar') || q.includes('limpiar')) {
      return 'Escribe @borrar para limpiar todo el historial de mensajes';
    }

    if (q.includes('editar') || q.includes('modificar')) {
      return 'Usa el comando @editar junto con el ID del mensaje y el nuevo texto para modificar mensajes';
    }

    const userCount = history.filter(m => m.type === 'user').length;
    const botCount = history.filter(m => m.type === 'bot').length;

    if (q.includes('cuantos mensajes') || q.includes('cuántos mensajes')) {
      return Hay  mensajes de usuarios y  mensajes del bot en el historial.;
    }

    if (q.includes('hola') || q.includes('buenos dias') || q.includes('buenas')) {
      return this.responses.hola;
    }

    if (q.includes('adios') || q.includes('chao') || q.includes('hasta luego')) {
      return this.responses.adios;
    }

    if (q.includes('como estas') || q.includes('cómo estás')) {
      return '¡Estoy muy bien, gracias por preguntar! ¿Y tú cómo estás?';
    }

    if (q.includes('que puedes hacer') || q.includes('qué puedes hacer') || q.includes('ayuda')) {
      return this.responses.ayuda;
    }

    if (q.includes('creador') || q.includes('desarrollador') || q.includes('quien te creo')) {
      return 'Fui creado como parte de un proyecto de chat para demostrar el uso de Node.js, Express, Socket.io y SQLite.';
    }

    if (q.includes('node') || q.includes('javascript')) {
      return 'Node.js y JavaScript son tecnologías increíbles para crear aplicaciones web en tiempo real.';
    }

    if (q.includes('socket') || q.includes('websocket')) {
      return 'Socket.io permite la comunicación en tiempo real entre el cliente y el servidor.';
    }

    if (q.length < 5) {
      return 'Por favor, escribe una pregunta más completa para poder ayudarte mejor.';
    }

    return Entiendo tu pregunta sobre: . 



También puedo responder preguntas sobre:
• El historial de mensajes
• Cómo usar el chat
• Conceptos básicos de programación;
  }
}

module.exports = { ChatBot };