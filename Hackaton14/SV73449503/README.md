# Reto 1: Chat con Base de Datos + Socket.IO + Bot

Proyecto base para universidad con los requisitos:
- Chat en tiempo real con `Socket.IO`
- Persistencia de mensajes con base de datos `SQLite`
- Edición y borrado de mensajes
- Borrado de historial completo
- Integración de asistente tipo ChatGPT/DeepSeek (o modo mock)

## 1) Instalar dependencias

```bash
npm install
```

## 2) Configurar variables de entorno

```bash
cp .env.example .env
```

Opcional: editar `.env` para usar IA real:
- `BOT_PROVIDER=openai` + `OPENAI_API_KEY=...`
- `BOT_PROVIDER=deepseek` + `DEEPSEEK_API_KEY=...`

Si no configuras API key, usa `BOT_PROVIDER=mock`.

## 3) Ejecutar el proyecto

```bash
npm start
```

Abrir: [http://localhost:3000](http://localhost:3000)

## 4) Cómo usar el bot

En el chat escribe:
- `/bot Explica que es Node.js`
- o `@bot dame un ejemplo de API`

## 5) Estructura

- `src/server.js`: servidor Express + Socket.IO
- `src/database.js`: conexión SQLite y creación de tabla
- `src/messageRepository.js`: objeto de acceso a datos (CRUD)
- `src/botService.js`: integración de bot (mock/openai/deepseek)
- `public/`: interfaz web del chat

## 6) Requisitos del reto cubiertos

- Persistencia de mensajes: ✅
- Clientes múltiples en tiempo real: ✅
- Acciones para editar, eliminar y borrar historial: ✅
- Integración con asistente IA: ✅

