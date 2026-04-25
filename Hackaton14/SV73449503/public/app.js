const socket = io();

const form = document.getElementById('chat-form');
const authorInput = document.getElementById('author');
const messageInput = document.getElementById('message');
const messagesList = document.getElementById('messages');
const clearBtn = document.getElementById('clear-btn');

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString();
}

function createMessageElement(message) {
  const item = document.createElement('li');
  item.className = `message ${message.isBot ? 'bot' : ''}`;
  item.dataset.id = String(message.id);

  const header = document.createElement('div');
  header.className = 'message-header';
  header.textContent = `${message.author} • ${formatDate(message.createdAt)}`;

  const text = document.createElement('div');
  text.className = 'message-text';
  text.textContent = message.text;

  const actions = document.createElement('div');
  actions.className = 'message-actions';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Editar';
  editBtn.type = 'button';
  editBtn.addEventListener('click', () => {
    const newText = prompt('Edita tu mensaje:', message.text);

    if (newText && newText.trim()) {
      socket.emit('edit_message', {
        id: message.id,
        newText: newText.trim(),
      });
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Eliminar';
  deleteBtn.type = 'button';
  deleteBtn.addEventListener('click', () => {
    const confirmed = confirm('¿Eliminar este mensaje?');
    if (confirmed) {
      socket.emit('delete_message', { id: message.id });
    }
  });

  if (!message.isBot) {
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
  }

  item.appendChild(header);
  item.appendChild(text);

  if (!message.isBot) {
    item.appendChild(actions);
  }

  return item;
}

function renderMessages(messages) {
  messagesList.innerHTML = '';
  messages.forEach((message) => {
    messagesList.appendChild(createMessageElement(message));
  });
}

function addMessage(message) {
  messagesList.appendChild(createMessageElement(message));
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const author = authorInput.value.trim() || 'Anónimo';
  const text = messageInput.value.trim();

  if (!text) {
    return;
  }

  socket.emit('send_message', { author, text });
  messageInput.value = '';
  messageInput.focus();
});

clearBtn.addEventListener('click', () => {
  const confirmed = confirm('¿Seguro que quieres borrar TODO el historial?');
  if (confirmed) {
    socket.emit('clear_history');
  }
});

socket.on('message_history', (messages) => {
  renderMessages(messages);
});

socket.on('new_message', (message) => {
  addMessage(message);
});

socket.on('message_edited', (updatedMessage) => {
  const existing = messagesList.querySelector(`[data-id="${updatedMessage.id}"]`);

  if (!existing) {
    return;
  }

  const replacement = createMessageElement(updatedMessage);
  existing.replaceWith(replacement);
});

socket.on('message_deleted', ({ id }) => {
  const existing = messagesList.querySelector(`[data-id="${id}"]`);

  if (existing) {
    existing.remove();
  }
});

socket.on('history_cleared', () => {
  messagesList.innerHTML = '';
});
