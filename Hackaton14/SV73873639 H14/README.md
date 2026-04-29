# Chat Persistente con Socket.io y Base de Datos

Aplicación de chat en tiempo real con persistencia en SQLite, funcionalidades de edición/eliminación de mensajes e integración con asistente AI (ChatGPT/DeepSeek).

## Características

- **Chat en tiempo real** usando Socket.io
- **Persistencia de mensajes** en base de datos SQLite
- **Edición de mensajes** (solo propios)
- **Eliminación de mensajes** (solo propios)
- **Borrado de historial** por usuario
- **Asistente AI** integrado (invocar con `@bot` o `@ai`)
- **Interfaz responsive** y moderna
- **Historial de hasta 100 mensajes** cargados al conectar

## Tecnologías

- **Backend:** Node.js, ExpressJS, Socket.io
- **Base de datos:** SQLite3
- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **AI:** OpenAI API (GPT-3.5-turbo)

## Instalación

1. Clona o descarga el proyecto
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` y añade tu API key de OpenAI:
   ```
   OPENAI_API_KEY=sk-tu-api-key-aqui
   ```
4. Inicia el servidor:
   ```bash
   npm start
   ```
   Para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

5. Abre tu navegador en `http://localhost:3000`

## Uso

### Para usuarios normales
1. Ingresa tu nombre de usuario
2. Escribe mensajes en el campo de texto
3. Presiona Enter o clic en "Enviar"
4. Clic en un mensaje propio para editarlo
5. Doble clic (o botón eliminar) para borrar un mensaje
6. Botón "Borrar mi Historial" para eliminar todos tus mensajes

### Para invocar al asistente AI
Incluye `@bot` o `@ai` en tu mensaje. Ejemplos:
- `@bot ¿cómo estás?`
- `@ai recomiéndame una película`
- `hola @bot`

El asistente responderá automáticamente en el chat.

## Estructura del proyecto

```
.
├── server.js              # Servidor principal (Express + Socket.io)
├── package.json           # Dependencias
├── .env.example          # Configuración de ejemplo
├── README.md             # Este archivo
└── public/               # Archivos estáticos (frontend)
    ├── index.html       # Página principal
    ├── styles.css       # Estilos
    └── client.js        # Lógica del cliente Socket.io
```

## Base de datos

Se utiliza SQLite con dos tablas:

### `messages`
- `id` - Identificador único
- `username` - Nombre del usuario
- `content` - Contenido del mensaje
- `timestamp` - Fecha y hora
- `isBot` - 1 si es mensaje del bot, 0 si es usuario

### `users`
- `id` - Identificador único
- `username` - Nombre de usuario (único)
- `createdAt` - Fecha de registro

La base de datos se crea automáticamente en `chat.db` al iniciar el servidor.

## API Endpoints

- `GET /` - Sirve la interfaz de chat
- `GET /api/messages` - Retorna los últimos 50 mensajes (JSON)

## Comandos especiales

- `@bot` o `@ai` - Invoca al asistente de IA
- Doble clic en mensaje propio - Elimina el mensaje
- Clic simple en mensaje propio - Permite editar

## Personalización

### Cambiar modelo de OpenAI
En `server.js`, línea ~85, cambiar:
```javascript
model: "gpt-3.5-turbo"  // por "gpt-4" o cualquier otro
```

### Cambiar puerto
En `.env`:
```
PORT=3000
```

### Límite de historial
En `server.js`, función `loadHistory()`:
```javascript
LIMIT 100  // Cambiar a otro número
```

## Notas

- Los mensajes se guardan automáticamente en la base de datos
- El asistente AI responde solo cuando se menciona con @bot o @ai
- Solo puedes editar/eliminar tus propios mensajes
- La interfaz es responsive y funciona en móviles
- Al desconectarte y reconectarte, se carga el historial

## Requirements

- Node.js 14.x o superior
- npm o yarn
- API key de OpenAI (opcional para bot)

## License

MIT