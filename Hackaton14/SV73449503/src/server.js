require('dotenv').config();

const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const messageRepository = require('./messageRepository');
const { generateBotReply } = require('./botService');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/messages', (_req, res) => {
  const messages = messageRepository.getAll();
  res.json(messages);
});

function shouldTriggerBot(text) {
  const normalized = text.trim().toLowerCase();
  return normalized.startsWith('/bot ') || normalized.startsWith('@bot ');
}

function normalizeBotPrompt(text) {
  if (text.toLowerCase().startsWith('/bot ')) {
    return text.slice(5).trim();
  }

  if (text.toLowerCase().startsWith('@bot ')) {
    return text.slice(5).trim();
  }

  return text;
}

io.on('connection', (socket) => {
  socket.emit('message_history', messageRepository.getAll());

  socket.on('send_message', async (payload = {}) => {
    const author = String(payload.author || 'Anónimo').trim() || 'Anónimo';
    const text = String(payload.text || '').trim();

    if (!text) {
      return;
    }

    const savedMessage = messageRepository.create({ author, text, isBot: 0 });
    io.emit('new_message', savedMessage);

    if (shouldTriggerBot(text)) {
      const prompt = normalizeBotPrompt(text);

      if (!prompt) {
        const helpMessage = messageRepository.create({
          author: 'Bot',
          text: 'Usa /bot seguido de tu pregunta. Ejemplo: /bot ¿Qué es Socket.IO?',
          isBot: 1,
        });

        io.emit('new_message', helpMessage);
        return;
      }

      try {
        const botText = await generateBotReply(prompt);
        const botMessage = messageRepository.create({
          author: 'Bot',
          text: botText,
          isBot: 1,
        });

        io.emit('new_message', botMessage);
      } catch (error) {
        const botError = messageRepository.create({
          author: 'Bot',
          text: `No pude consultar la IA: ${error.message}`,
          isBot: 1,
        });

        io.emit('new_message', botError);
      }
    }
  });

  socket.on('edit_message', (payload = {}) => {
    const id = Number(payload.id);
    const newText = String(payload.newText || '').trim();

    if (!id || !newText) {
      return;
    }

    const updated = messageRepository.updateText(id, newText);

    if (updated) {
      io.emit('message_edited', updated);
    }
  });

  socket.on('delete_message', (payload = {}) => {
    const id = Number(payload.id);

    if (!id) {
      return;
    }

    const deleted = messageRepository.deleteById(id);

    if (deleted) {
      io.emit('message_deleted', { id });
    }
  });

  socket.on('clear_history', () => {
    messageRepository.clearAll();
    io.emit('history_cleared');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
