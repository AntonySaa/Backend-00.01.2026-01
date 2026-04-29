require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// RUTAS

//  Obtener todos los mensajes
app.get('/api/messages', (req, res) => {
  db.getAllMessages((err, messages) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(messages);
  });
});

//  Guardar mensaje (API)
app.post('/api/messages', (req, res) => {
  const { text, author } = req.body;
  db.insertMessage(text, author || 'user', (err, id) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, message: 'Mensaje guardado' });
  });
});

//  Borrar TODO el historial
app.delete('/api/chat/clear-history', (req, res) => {
  db.deleteAllMessages((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    io.emit('historyCleared');
    res.json({ success: true, message: 'Historial borrado' });
  });
});

//  Editar un mensaje
app.put('/api/chat/edit-message/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  
  db.updateMessage(id, text, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    io.emit('messageEdited', { id: parseInt(id), newText: text });
    res.json({ success: true });
  });
});

//  Eliminar un mensaje específico
app.delete('/api/chat/delete-message/:id', (req, res) => {
  const { id } = req.params;
  
  db.deleteMessage(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    io.emit('messageRemoved', parseInt(id));
    res.json({ success: true });
  });
});

//  Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// .IO 
io.on('connection', (socket) => {
  console.log(` Cliente conectado: ${socket.id}`);
  
  socket.on('sendMessage', (data) => {
    console.log(` Mensaje: "${data.text}"`);
    
    db.insertMessage(data.text, data.author, (err, id) => {
      if (!err) {
        db.getAllMessages((err, messages) => {
          const newMessage = messages.find(m => m.id === id);
          io.emit('newMessage', newMessage);
          
          //  BOT
          const userText = data.text.toLowerCase();
          let botReply = null;
          
          if (userText.includes('hola')) botReply = '¡Hola! ¿Cómo estás? ';
          else if (userText.includes('como estas')) botReply = '¡Muy bien! Gracias por preguntar. ¿Y tú?';
          else if (userText.includes('gracias')) botReply = '¡De nada! ';
          else if (userText.includes('ayuda')) botReply = 'Comandos: "hola", "cómo estás", "gracias", "adiós"';
          else if (userText.includes('adios')) botReply = '¡Adiós! ';
          
          if (botReply) {
            setTimeout(() => {
              db.insertMessage(botReply, 'bot', (err, botId) => {
                if (!err) {
                  db.getAllMessages((err, all) => {
                    const botMsg = all.find(m => m.id === botId);
                    io.emit('newMessage', botMsg);
                  });
                }
              });
            }, 500);
          }
        });
      }
    });
  });
  
  socket.on('disconnect', () => {
    console.log(` Cliente desconectado: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`\n Servidor: http://localhost:${PORT}`);
  console.log(` API: http://localhost:${PORT}/api/messages`);
  console.log(` Socket.io activo\n`);
});