const socket = io();
let currentUser = '';
let editingMessageId = null;

const elements = {
  loginScreen: document.getElementById('loginScreen'),
  chatContainer: document.getElementById('chatContainer'),
  usernameInput: document.getElementById('usernameInput'),
  joinBtn: document.getElementById('joinBtn'),
  currentUser: document.getElementById('currentUser'),
  logoutBtn: document.getElementById('logoutBtn'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  messages: document.getElementById('messages'),
  messageInput: document.getElementById('messageInput'),
  sendBtn: document.getElementById('sendBtn'),
  status: document.getElementById('status')
};

elements.joinBtn.addEventListener('click', joinChat);
elements.usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') joinChat();
});

elements.logoutBtn.addEventListener('click', () => {
  socket.disconnect();
  location.reload();
});

elements.clearHistoryBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('⚠️ ¿Borrar TODO el historial del chat?\n\nEsto eliminará TODOS los mensajes de TODOS los usuarios (incluyendo respuestas del bot).\n\nNo te desconectará del chat.')) {
    socket.emit('clear-history');
  }
});

elements.sendBtn.addEventListener('click', sendMessage);
elements.messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

socket.on('connect', () => {
  elements.status.textContent = 'Conectado';
  elements.status.classList.add('connected');
});

socket.on('disconnect', () => {
  elements.status.textContent = 'Desconectado';
  elements.status.classList.remove('connected');
});

function joinChat() {
  const username = elements.usernameInput.value.trim();
  if (!username) {
    showNotification('Por favor ingresa un nombre', 'error');
    return;
  }

  currentUser = username;
  elements.currentUser.textContent = username;
  socket.emit('join', username);

  elements.loginScreen.style.display = 'none';
  elements.chatContainer.style.display = 'flex';
  elements.messageInput.focus();
}

function disconnectUser() {
  socket.disconnect();
  location.reload();
}

function sendMessage() {
  const content = elements.messageInput.value.trim();
  if (!content) return;

  socket.emit('message', { content });
  elements.messageInput.value = '';
  elements.messageInput.focus();
}

socket.on('message', (message) => {
  addMessageToDOM(message);
  scrollToBottom();
});

socket.on('load-history', (messages) => {
  elements.messages.innerHTML = '';
  messages.forEach(addMessageToDOM);
  scrollToBottom();
});

socket.on('message-edited', (message) => {
  const msgElement = document.querySelector(`[data-message-id="${message.id}"]`);
  if (msgElement) {
    msgElement.querySelector('.message-content').textContent = message.content;
    msgElement.querySelector('.message-time').textContent = formatTime(message.timestamp);
  }
});

socket.on('message-deleted', (data) => {
  const msgElement = document.querySelector(`[data-message-id="${data.messageId}"]`);
  if (msgElement) {
    msgElement.remove();
  }
});

socket.on('history-cleared', (data) => {
  console.log('Historial borrado:', data);

  if (data.all) {
    elements.messages.innerHTML = '';
    showNotification('✅ Historial del chat borrado completamente. Todos los mensajes eliminados.');
  }
});

socket.on('user-joined', (msg) => {
  addSystemMessage(msg);
});

socket.on('user-left', (msg) => {
  addSystemMessage(msg);
});

socket.on('error', (error) => {
  showNotification(error, 'error');
});

function addMessageToDOM(message) {
  const isOwn = message.username === currentUser;
  const isBot = message.isBot === 1 || message.isBot === true;
  const isSystem = message.username === 'Sistema';

  let messageClass = 'message';
  if (isOwn) messageClass += ' own';
  if (isBot) messageClass += ' bot';
  if (isSystem) messageClass += ' system';

  const messageDiv = document.createElement('div');
  messageDiv.className = messageClass;
  messageDiv.setAttribute('data-message-id', message.id);

  if (isSystem) {
    messageDiv.textContent = message.content;
  } else {
    const headerHTML = `
      <div class="message-header">
        <span class="message-sender">${escapeHtml(message.username)}</span>
        <span class="message-time">${formatTime(message.timestamp)}</span>
      </div>
    `;

    let contentHTML = `<div class="message-content">${escapeHtml(message.content)}</div>`;

    if (isOwn && !isBot) {
      contentHTML += `
        <div class="message-actions">
          <button class="action-btn edit-btn" onclick="editMessage(${message.id})">Editar</button>
          <button class="action-btn delete-btn" onclick="deleteMessage(${message.id})">Eliminar</button>
        </div>
      `;
    }

    messageDiv.innerHTML = headerHTML + contentHTML;
  }

  elements.messages.appendChild(messageDiv);
}

function addSystemMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message system';
  messageDiv.textContent = text;
  elements.messages.appendChild(messageDiv);
  scrollToBottom();
}

function editMessage(messageId) {
  if (editingMessageId) {
    cancelEdit();
  }

  const msgElement = document.querySelector(`[data-message-id="${messageId}"]`);
  if (!msgElement) return;

  const contentDiv = msgElement.querySelector('.message-content');
  const currentContent = contentDiv.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = currentContent;
  input.dataset.messageId = messageId;

  contentDiv.innerHTML = '';
  contentDiv.appendChild(input);
  input.focus();
  input.select();

  editingMessageId = messageId;

  const saveBtn = document.createElement('button');
  saveBtn.className = 'save-btn';
  saveBtn.textContent = 'Guardar';
  saveBtn.onclick = () => saveEdit(input, saveBtn);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveEdit(input, saveBtn);
    }
  });

  input.saveBtn = saveBtn;
  contentDiv.appendChild(saveBtn);
}

function saveEdit(input, saveBtn) {
  const newContent = input.value.trim();
  if (!newContent) {
    showNotification('El mensaje no puede estar vacío', 'error');
    return;
  }

  socket.emit('edit-message', {
    messageId: parseInt(input.dataset.messageId),
    newContent
  });

  cancelEdit();
}

function cancelEdit() {
  if (!editingMessageId) return;

  const msgElement = document.querySelector(`[data-message-id="${editingMessageId}"]`);
  if (msgElement) {
    location.reload();
  }
  editingMessageId = null;
}

function deleteMessage(messageId) {
  if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
    socket.emit('delete-message', messageId);
  }
}

function scrollToBottom() {
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && editingMessageId) {
    cancelEdit();
  }
});