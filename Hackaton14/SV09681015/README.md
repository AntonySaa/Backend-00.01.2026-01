# Chatelier — Hackathon Semanal

Chat en tiempo real persistente con Node.js, Express, Socket.io, SQLite y bot de IA local con Ollama.

## 🚀 Instalación y Uso

```bash
# 1. Instalar dependencias
npm install

# 2. Tener Ollama corriendo con llama3.2 (ver sección Bot)
ollama serve

# 3. Iniciar el servidor
node server.js

# 4. Abrir en el navegador
http://localhost:3000
```

## 🛠 Tecnologías

| Tecnología            | Uso                                       |
|-----------------------|-------------------------------------------|
| **Node.js + Express** | Servidor HTTP                             |
| **Socket.io**         | Comunicación en tiempo real (WebSockets)  |
| **sql.js (SQLite)**   | Base de datos persistente (SQL)           |
| **Ollama + llama3.2** | Bot de IA local (sin API key)             |

## 📁 Estructura

```
chat-hackathon/
├── server.js        ← Servidor principal (Express + Socket.io + DB)
├── public/
│   └── index.html   ← Frontend (HTML/CSS/JS)
├── db/
│   └── chat.db      ← Base de datos SQLite (se crea automáticamente)
├── .env             ← Variables de entorno (opcional)
└── README.md
```

## 🗄️ Base de Datos SQL

### Tabla `messages`
```sql
CREATE TABLE messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  username   TEXT    NOT NULL,
  content    TEXT    NOT NULL,
  created_at TEXT,
  edited     INTEGER DEFAULT 0
);
```

### Operaciones CRUD implementadas
- **INSERT**      — Guardar nuevo mensaje
- **SELECT**      — Cargar historial al conectarse
- **UPDATE**      — Editar contenido de un mensaje
- **DELETE**      — Borrar mensaje individual
- **DELETE ALL**  — Limpiar historial completo

## ⚡ Eventos Socket.io

| Evento            | Dirección           | Descripción                 |
|-------------------|---------------------|-----------------------------|
| `send_message`    | cliente → servidor  | Enviar mensaje              |
| `new_message`     | servidor → todos    | Broadcast de nuevo mensaje  |
| `edit_message`    | cliente → servidor  | Editar mensaje              |
| `message_edited`  | servidor → todos    | Broadcast de edición        |
| `delete_message`  | cliente → servidor  | Borrar mensaje              |
| `message_deleted` | servidor → todos    | Broadcast de borrado        |
| `clear_history`   | cliente → servidor  | Limpiar todo                |
| `history_cleared` | servidor → todos    | Broadcast de limpieza       |
| `history`         | servidor → cliente  | Historial al conectarse     |

## 🤖 Bot de IA — Ollama + llama3.2

El bot corre **100% local**, sin API key ni conexión a internet.

### Instalación de Ollama
1. Descarga desde **ollama.com** e instala
2. Descarga el modelo:
```bash
ollama pull llama3.2
```
3. Ollama debe estar corriendo antes de iniciar el servidor

### Uso en el chat
Activa el asistente con el prefijo `@bot`:

```
@bot ¿Cuál es la capital de Perú?
@bot Explícame qué es un WebSocket
@bot ¿Cómo funciona Socket.io?
```

### Requisitos
- Mínimo **4GB de RAM libre** para correr llama3.2
- Ollama escucha en `http://localhost:11434` por defecto

## ✨ Funcionalidades

- ✅ Mensajes persistentes en SQLite
- ✅ Historial cargado al conectarse
- ✅ Editar mensajes propios (inline)
- ✅ Borrar mensajes propios
- ✅ Limpiar historial completo
- ✅ Bot de IA local con `@bot` (Ollama + llama3.2)
- ✅ Chat en tiempo real multi-usuario
- ✅ Indicador "bot está pensando..."
- ✅ Terminal limpia mostrando solo clientes conectados
