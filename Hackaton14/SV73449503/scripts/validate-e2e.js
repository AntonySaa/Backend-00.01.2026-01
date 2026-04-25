const { io } = require('socket.io-client');

const BASE_URL = 'http://127.0.0.1:3000';
const TIMEOUT_MS = 5000;

function waitFor(socket, eventName, predicate, timeoutMs = TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.off(eventName, handler);
      reject(new Error(`Timeout esperando ${eventName}`));
    }, timeoutMs);

    const handler = (payload) => {
      try {
        if (predicate(payload)) {
          clearTimeout(timeout);
          socket.off(eventName, handler);
          resolve(payload);
        }
      } catch (error) {
        clearTimeout(timeout);
        socket.off(eventName, handler);
        reject(error);
      }
    };

    socket.on(eventName, handler);
  });
}

async function run() {
  const socket = io(BASE_URL, {
    transports: ['websocket'],
    reconnection: false,
    timeout: TIMEOUT_MS,
  });

  await new Promise((resolve, reject) => {
    socket.on('connect', resolve);
    socket.on('connect_error', reject);
  });

  const historyPromise = waitFor(socket, 'message_history', (messages) => Array.isArray(messages));
  const initialHistory = await historyPromise;

  socket.emit('clear_history');
  await waitFor(socket, 'history_cleared', () => true);

  const newMsgPromise = waitFor(
    socket,
    'new_message',
    (msg) => msg && msg.author === 'Tester' && msg.text === 'mensaje inicial' && !msg.isBot
  );
  socket.emit('send_message', { author: 'Tester', text: 'mensaje inicial' });
  const created = await newMsgPromise;

  const editedPromise = waitFor(
    socket,
    'message_edited',
    (msg) => msg && msg.id === created.id && msg.text === 'mensaje editado'
  );
  socket.emit('edit_message', { id: created.id, newText: 'mensaje editado' });
  await editedPromise;

  const deletedPromise = waitFor(socket, 'message_deleted', ({ id }) => id === created.id);
  socket.emit('delete_message', { id: created.id });
  await deletedPromise;

  const botUserMsgPromise = waitFor(
    socket,
    'new_message',
    (msg) => msg && msg.author === 'Tester' && msg.text === '/bot hola bot'
  );
  const botReplyPromise = waitFor(
    socket,
    'new_message',
    (msg) => msg && msg.author === 'Bot' && msg.isBot === 1
  );
  socket.emit('send_message', { author: 'Tester', text: '/bot hola bot' });
  await botUserMsgPromise;
  const botReply = await botReplyPromise;

  socket.emit('clear_history');
  await waitFor(socket, 'history_cleared', () => true);

  socket.disconnect();

  console.log('E2E_OK');
  console.log(`history_inicial=${initialHistory.length}`);
  console.log(`mensaje_id=${created.id}`);
  console.log(`bot_respuesta=${JSON.stringify(botReply.text).slice(0, 120)}`);
}

run().catch((error) => {
  console.error('E2E_FAIL', error.message);
  process.exit(1);
});
