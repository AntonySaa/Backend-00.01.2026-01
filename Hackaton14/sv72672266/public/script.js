const socket = io();

// Estado de la aplicación
const app = {
    currentChatId: null,
    chats: {},
    editingMessageId: null,
};

// Elementos del DOM
const newChatBtn = document.getElementById('newChatBtn');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messagesContainer');
const chatList = document.getElementById('chatList');
const chatTitle = document.getElementById('chatTitle');

// Crear nuevo chat
newChatBtn.addEventListener('click', () => {
    createNewChat();
});

// Enviar mensaje
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    if (!app.currentChatId) {
        createNewChat();
    }

    displayMessage('user', message, null, app.currentChatId);
    
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            alert('Error: ' + error);
            return;
        }
        messageInput.value = '';
        messageInput.focus();
    });
});

// Escuchar mensajes del servidor
socket.on('message', (message) => {
    displayMessage('assistant', message, null, app.currentChatId);
});

// Crear nuevo chat
async function createNewChat() {
    try {
        const response = await fetch('/conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: 'Nuevo chat' })
        });

        if (!response.ok) {
            throw new Error('Error al crear conversación');
        }

        const conversation = await response.json();
        const chatId = conversation.id;
        
        app.currentChatId = chatId;
        
        app.chats[chatId] = {
            id: chatId,
            title: 'Nuevo chat',
            messages: [],
            createdAt: new Date()
        };

        updateChatList();
        renderMessages();
        updateChatTitle();
        messagesContainer.innerHTML = '<div class="empty-state"><i class="fas fa-comments"></i><p>Comienza una conversación</p></div>';
    } catch (error) {
        console.error('Error creating new chat:', error);
        alert('Error al crear nuevo chat');
    }
}

// Mostrar mensaje
async function displayMessage(role, text, messageId = null, chatId = null) {
    if (!chatId) chatId = app.currentChatId;
    
    // Generar ID si no existe
    if (!messageId) {
        messageId = 'msg_' + Date.now() + '_' + Math.random();
    }

    // Guardar el mensaje en la BD
    try {
        await fetch('/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversation_id: chatId,
                role: role,
                content: text
            })
        });
    } catch (error) {
        console.error('Error guardando mensaje en BD:', error);
    }

    // Guardar el mensaje en la memoria local
    if (app.chats[chatId]) {
        app.chats[chatId].messages.push({
            id: messageId,
            role,
            text,
            version: 1,
            timestamp: new Date()
        });

        // Actualizar título del chat si es el primer mensaje del usuario
        if (role === 'user' && app.chats[chatId].messages.length === 1) {
            const newTitle = text.substring(0, 30) + (text.length > 30 ? '...' : '');
            app.chats[chatId].title = newTitle;
            
            // Guardar el título actualizado en la BD
            fetch(`/conversation/${chatId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle })
            }).catch(error => console.error('Error actualizando título:', error));
            
            updateChatList();
        }
    }

    // Renderizar el mensaje
    if (chatId === app.currentChatId) {
        renderMessages();
    }
}

// Renderizar todos los mensajes
function renderMessages() {
    const chat = app.chats[app.currentChatId];
    
    if (!chat || chat.messages.length === 0) {
        messagesContainer.innerHTML = '<div class="empty-state"><i class="fas fa-comments"></i><p>Comienza una conversación</p></div>';
        return;
    }

    messagesContainer.innerHTML = '';

    chat.messages.forEach(msg => {
        const messageEl = createMessageElement(msg);
        messagesContainer.appendChild(messageEl);
    });

    // Scroll al último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Crear elemento de mensaje
function createMessageElement(msg) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.role}`;
    messageDiv.dataset.messageId = msg.id;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = msg.role === 'user' ? 'Yo' : 'IA';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'message-content-wrapper';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = msg.text;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';

    // Botón de editar (solo para mensajes del usuario)
    if (msg.role === 'user') {
        const editBtn = document.createElement('button');
        editBtn.className = 'message-action-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Editar mensaje';
        editBtn.addEventListener('click', () => openEditModal(msg.id, msg.text));
        actionsDiv.appendChild(editBtn);

        // Botón de historial (si tiene versiones)
        if (msg.version && msg.version > 1) {
            const historyBtn = document.createElement('button');
            historyBtn.className = 'message-action-btn';
            historyBtn.innerHTML = '<i class="fas fa-history"></i>';
            historyBtn.title = 'Ver historial de versiones';
            historyBtn.addEventListener('click', () => openVersionHistory(msg.id, msg.text, msg.version));
            actionsDiv.appendChild(historyBtn);
        }
    }

    // Botón de copiar
    const copyBtn = document.createElement('button');
    copyBtn.className = 'message-action-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = 'Copiar mensaje';
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(msg.text);
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    });
    actionsDiv.appendChild(copyBtn);

    bubble.appendChild(textDiv);
    bubble.appendChild(actionsDiv);

    contentWrapper.appendChild(bubble);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentWrapper);

    return messageDiv;
}

// Abrir modal para ver historial de versiones
function openVersionHistory(messageId, currentText, version) {
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    
    const content = document.createElement('div');
    content.className = 'edit-modal-content';

    content.innerHTML = `
        <h2>Historial de versiones (v${version})</h2>
        <div class="version-info">
            <p><strong>Versión actual (${version}):</strong></p>
            <textarea readonly>${currentText}</textarea>
        </div>
        <div class="version-info">
            <p><em>💡 Este mensaje ha sido editado ${version} veces en total.</em></p>
            <p><small>Para ver todas las versiones anteriores, se necesitaría un sistema de historial completo en la base de datos.</small></p>
        </div>
        <div class="edit-modal-buttons">
            <button class="cancel-btn" id="closeBtn">Cerrar</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    const closeBtn = document.getElementById('closeBtn');

    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
function openEditModal(messageId, currentText) {
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    
    const content = document.createElement('div');
    content.className = 'edit-modal-content';

    content.innerHTML = `
        <h2>Editar mensaje</h2>
        <textarea id="editTextarea">${currentText}</textarea>
        <div class="edit-modal-buttons">
            <button class="cancel-btn" id="cancelBtn">Cancelar</button>
            <button class="save-btn" id="saveBtn">Guardar</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    const textarea = document.getElementById('editTextarea');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');

    textarea.focus();
    textarea.select();

    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });

    saveBtn.addEventListener('click', () => {
        const newText = textarea.value.trim();
        if (newText) {
            editMessage(messageId, newText);
            modal.remove();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Editar mensaje
async function editMessage(messageId, newText) {
    const chat = app.chats[app.currentChatId];
    
    if (!chat) return;

    const messageIndex = chat.messages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
        try {
            const response = await fetch(`/message/${messageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newText })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar mensaje');
            }

            const updatedMessage = await response.json();
            
            chat.messages[messageIndex].text = newText;
            chat.messages[messageIndex].version = updatedMessage.version;
            
            // Eliminar mensajes posteriores del frontend (sin eliminar de BD)
            chat.messages = chat.messages.slice(0, messageIndex + 1);
            
            renderMessages();
            
            // Generar respuesta del bot basada en el mensaje editado
            socket.emit('sendMessage', newText, (error) => {
                if (error) {
                    console.error('Error generating bot response:', error);
                }
            });
        } catch (error) {
            console.error('Error editing message:', error);
            alert('Error al editar mensaje');
        }
    }
}

// Actualizar lista de chats en el sidebar
function updateChatList() {
    chatList.innerHTML = '';

    // Ordenar chats por fecha más reciente
    const sortedChats = Object.values(app.chats).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    sortedChats.forEach(chat => {
        const chatItemContainer = document.createElement('div');
        chatItemContainer.className = 'chat-item-container';
        
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item' + (chat.id === app.currentChatId ? ' active' : '');
        chatItem.textContent = chat.title || 'Nuevo chat';
        
        chatItem.addEventListener('click', () => {
            switchChat(chat.id);
        });

        // Botones de acción
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'chat-item-actions';

        // Botón de renombrar
        const renameBtn = document.createElement('button');
        renameBtn.className = 'chat-action-btn';
        renameBtn.innerHTML = '<i class="fas fa-edit"></i>';
        renameBtn.title = 'Renombrar chat';
        renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openRenameModal(chat.id, chat.title);
        });
        actionsDiv.appendChild(renameBtn);

        // Botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'chat-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Eliminar chat';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`¿Eliminar el chat "${chat.title}"?`)) {
                deleteChat(chat.id);
            }
        });
        actionsDiv.appendChild(deleteBtn);

        chatItemContainer.appendChild(chatItem);
        chatItemContainer.appendChild(actionsDiv);
        chatList.appendChild(chatItemContainer);
    });
}

// Cambiar a otro chat
async function switchChat(chatId) {
    app.currentChatId = chatId;
    updateChatList();
    updateChatTitle();
    
    // Cargar mensajes de la conversación desde la BD
    await loadMessagesForChat(chatId);
    renderMessages();
}

// Actualizar título del chat
function updateChatTitle() {
    const chat = app.chats[app.currentChatId];
    if (chat) {
        chatTitle.textContent = chat.title || 'Nuevo chat';
    }
}

// Abrir modal para renombrar chat
function openRenameModal(chatId, currentTitle) {
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    
    const content = document.createElement('div');
    content.className = 'edit-modal-content';

    content.innerHTML = `
        <h2>Renombrar chat</h2>
        <input type="text" id="renameInput" value="${currentTitle}" placeholder="Nuevo nombre del chat">
        <div class="edit-modal-buttons">
            <button class="cancel-btn" id="cancelBtn">Cancelar</button>
            <button class="save-btn" id="saveBtn">Guardar</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    const input = document.getElementById('renameInput');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');

    input.focus();
    input.select();

    const handleSave = () => {
        const newTitle = input.value.trim();
        if (newTitle) {
            renameChat(chatId, newTitle);
            modal.remove();
        }
    };

    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });

    saveBtn.addEventListener('click', handleSave);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Renombrar chat
async function renameChat(chatId, newTitle) {
    try {
        const response = await fetch(`/conversation/${chatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        });

        if (!response.ok) {
            throw new Error('Error al renombrar conversación');
        }

        if (app.chats[chatId]) {
            app.chats[chatId].title = newTitle;
            updateChatList();
            updateChatTitle();
        }
    } catch (error) {
        console.error('Error renaming chat:', error);
        alert('Error al renombrar chat');
    }
}

// Eliminar chat
async function deleteChat(chatId) {
    try {
        const response = await fetch(`/conversation/${chatId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar conversación');
        }

        delete app.chats[chatId];
        
        // Si el chat eliminado era el actual, cambiar a otro
        if (app.currentChatId === chatId) {
            const remainingChats = Object.keys(app.chats);
            if (remainingChats.length > 0) {
                switchChat(remainingChats[0]);
            } else {
                app.currentChatId = null;
                createNewChat();
            }
        }
        
        updateChatList();
    } catch (error) {
        console.error('Error deleting chat:', error);
        alert('Error al eliminar chat');
    }
}

// Auto-focus en el input cuando carga
window.addEventListener('load', async () => {
    messageInput.focus();
    await loadConversations();
});

// Cargar conversaciones desde la BD
async function loadConversations() {
    try {
        const response = await fetch('/conversation');
        
        if (!response.ok) {
            throw new Error('Error al cargar conversaciones');
        }

        const conversations = await response.json();

        // Poblar app.chats con las conversaciones
        conversations.forEach(conversation => {
            app.chats[conversation.id] = {
                id: conversation.id,
                title: conversation.title,
                messages: [],
                createdAt: new Date(conversation.createdAt)
            };
        });

        // Actualizar la lista de chats
        updateChatList();

        // Si no hay chats, crear uno nuevo
        if (conversations.length === 0) {
            createNewChat();
        } else {
            // Si hay chats, seleccionar el primero
            const firstChatId = conversations[0].id;
            switchChat(firstChatId);
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

// Cargar mensajes de una conversación desde la BD
async function loadMessagesForChat(chatId) {
    try {
        const response = await fetch(`/message/${chatId}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar mensajes');
        }

        const messages = await response.json();

        // Limpiar mensajes anteriores
        if (app.chats[chatId]) {
            app.chats[chatId].messages = [];

            // Agregar los mensajes cargados
            messages.forEach(msg => {
                app.chats[chatId].messages.push({
                    id: msg.id,
                    role: msg.role,
                    text: msg.content,
                    version: msg.version || 1,
                    timestamp: new Date(msg.created_at)
                });
            });
        }
    } catch (error) {
        console.error('Error loading messages for chat:', error);
    }
}