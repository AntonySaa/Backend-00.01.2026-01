require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./chat.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
    initDB();
  }
});

function initDB() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      isBot INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
  }

  async function handleBotMessage(username, userMessage) {
  const botResponse = obtenerRespuestaBot(username, userMessage);
  saveBotMessage(botResponse);
}

function saveBotMessage(botResponse) {
  db.run(
    "INSERT INTO messages (username, content, isBot) VALUES (?, ?, 1)",
    ["Asistente AI", botResponse],
    function(err) {
      if (err) {
        console.error('Error guardando respuesta del bot:', err);
        return;
      }

      const botMessage = {
        id: this.lastID,
        username: "Asistente AI",
        content: botResponse,
        timestamp: new Date().toISOString(),
        isBot: 1
      };

      io.to('chat-room').emit('message', botMessage);
    }
  );
}

function obtenerRespuestaBot(username, userMessage) {
  const msg = userMessage.toLowerCase().replace('@bot', '').replace('@ai', '').trim();

  if (!msg) return "¡Hola! 👋 Soy un bot. Escribe tu pregunta después de @bot";

  const respuestas = {
    'hola': '¡Hola! 👋 ¿En qué puedo ayudarte?',
    'hola!': '¡Hola! ¿Cómo estás?',
    'como estas': '¡Muy bien, gracias! ¿Y tú?',
    'que tal': '¡Todo bien! ¿En qué te ayudo?',
    'adios': '¡Hasta luego! 👋',
    'gracias': '¡De nada! 😊',
    'ok': 'Perfecto.',
    'ayuda': 'Puedes preguntarme cosas. Solo escribe @bot + tu pregunta.',
    'que hora es': `Son las ${new Date().toLocaleTimeString('es-ES')}`,
    'que fecha es': `Hoy es ${new Date().toLocaleDateString('es-ES')}`,
    'nombre': 'Soy Asistente AI, tu ayudante en el chat.',
  };

  if (respuestas[msg]) return respuestas[msg];

  if (msg.includes('hola')) return '¡Hola! 👋';
  if (msg.includes('gracias')) return '¡De nada! 😊';
  if (msg.includes('adios')) return '¡Hasta pronto!';

  return `🤖 Bot: Recibí "${msg}". (Bot local sin API - funcionando 100%)`;
}

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join', (username) => {
    socket.username = username;
    socket.join('chat-room');

    db.get("SELECT id FROM users WHERE username = ?", [username], (err, row) => {
      if (!row) {
        db.run("INSERT INTO users (username) VALUES (?)", [username]);
      }
    });

    loadHistory(socket);
    io.to('chat-room').emit('user-joined', `${username} se unió al chat`);
  });

  socket.on('message', async (data) => {
    const { content } = data;
    const username = socket.username || 'Anónimo';

    db.run(
      "INSERT INTO messages (username, content) VALUES (?, ?)",
      [username, content],
      function(err) {
        if (err) {
          console.error('Error guardando mensaje:', err);
          return;
        }

        const message = {
          id: this.lastID,
          username,
          content,
          timestamp: new Date().toISOString(),
          isBot: 0
        };

        io.to('chat-room').emit('message', message);

        if (content.toLowerCase().includes('@bot') || content.toLowerCase().includes('@ai')) {
          handleBotMessage(username, content);
        }
      }
    );
  });

  socket.on('edit-message', (data) => {
    const { messageId, newContent } = data;
    const username = socket.username;

    db.run(
      "UPDATE messages SET content = ?, timestamp = CURRENT_TIMESTAMP WHERE id = ? AND username = ?",
      [newContent, messageId, username],
      function(err) {
        if (err) {
          socket.emit('error', 'No se pudo editar el mensaje');
          return;
        }

        if (this.changes > 0) {
          db.get("SELECT * FROM messages WHERE id = ?", [messageId], (err, row) => {
            io.to('chat-room').emit('message-edited', {
              id: messageId,
              content: newContent,
              username: row.username,
              timestamp: row.timestamp
            });
          });
        }
      }
    );
  });

  socket.on('delete-message', (messageId) => {
    const username = socket.username;

    db.run(
      "DELETE FROM messages WHERE id = ? AND username = ?",
      [messageId, username],
      function(err) {
        if (err) {
          socket.emit('error', 'No se pudo eliminar el mensaje');
          return;
        }

        if (this.changes > 0) {
          io.to('chat-room').emit('message-deleted', { messageId });
        }
      }
    );
  });

  socket.on('clear-history', () => {
    console.log('Borrando todo el historial...');

    db.serialize(() => {
      db.run("DELETE FROM messages", (err) => {
        if (err) {
          console.error('Error borrando historial:', err);
          socket.emit('error', 'No se pudo limpiar el historial');
          return;
        }

        console.log('Historial borrado completamente');
        io.to('chat-room').emit('history-cleared', {
          all: true
        });
      });
    });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.to('chat-room').emit('user-left', `${socket.username} salió del chat`);
    }
    console.log('Usuario desconectado:', socket.id);
  });
});

function loadHistory(socket) {
  db.all(
    "SELECT * FROM messages ORDER BY timestamp ASC LIMIT 100",
    [],
    (err, rows) => {
      if (err) {
        console.error('Error cargando historial:', err);
        return;
      }
      const messages = rows.map(row => ({
        id: row.id,
        username: row.username,
        content: row.content,
        timestamp: row.timestamp,
        isBot: !!row.isBot
      }));
      socket.emit('load-history', messages);
    }
  );
}

async function handleBotMessage(username, userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Responde brevemente (1-2 líneas).\n\nUsuario ${username}: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botResponse = response.text().trim();

    saveBotMessage(botResponse);
  } catch (error) {
    console.error('Error llamando a Gemini:', error.message);
    const mensajeError = obtenerRespuestaFallback(username, userMessage);
    saveBotMessage(mensajeError);
  }
}

function saveBotMessage(botResponse) {
  db.run(
    "INSERT INTO messages (username, content, isBot) VALUES (?, ?, 1)",
    ["Asistente AI", botResponse],
    function(err) {
      if (err) {
        console.error('Error guardando respuesta del bot:', err);
        return;
      }

      const botMessage = {
        id: this.lastID,
        username: "Asistente AI",
        content: botResponse,
        timestamp: new Date().toISOString(),
        isBot: 1
      };

      io.to('chat-room').emit('message', botMessage);
    }
  );
}

function obtenerRespuestaFallback(username, userMessage) {
  const msg = userMessage.toLowerCase().replace('@bot', '').replace('@ai', '').trim();

  if (!msg) return "¡Hola! ¿En qué puedo ayudarte?";

  const respuestas = {
    'hola': '¡Hola! 👋',
    'hola!': '¡Hola! ¿Cómo estás?',
    'hola como estas': '¡Muy bien, gracias! ¿Y tú?',
    'como estas': 'Todo bien por aquí :)',
    'que tal': '¡Todo bien! ¿En qué te ayudo?',
    'adios': '¡Hasta luego! 👋',
    'gracias': '¡De nada! 😊',
    'ok': 'Perfecto.',
    'ayuda': 'Puedo responder preguntas, aunque ahora estoy en modo básico.'
  };

  if (respuestas[msg]) return respuestas[msg];

  return `Dije: "${msg}" - (Bot en modo básico. Configura GEMINI_API_KEY para respuestas inteligentes)`;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/messages', (req, res) => {
  db.all(
    "SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50",
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Base de datos cerrada');
    process.exit(0);
  });
});