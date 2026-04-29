#  CHAT PERSISTENTE - Hackathon

##  Descripción del Proyecto

Aplicación de chat en tiempo real con persistencia de datos, múltiples clientes, y asistente bot automático. Desarrollado como solución para hackathon.

###  Requisitos Cumplidos

- Base de datos SQLite (persistencia de mensajes)
-  Múltiples clientes en tiempo real (Socket.io)
- Botón para borrar historial completo
- Botones para editar y eliminar mensajes individuales
- Asistente Bot que responde a palabras clave
- Chat persistente (los mensajes no se pierden al recargar)

---

##  Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | v24+ | Entorno de ejecución |
| Express | 4.18.2 | Servidor web |
| Socket.io | 4.6.1 | Comunicación en tiempo real |
| SQLite3 | 5.1.6 | Base de datos embebida |
| HTML/CSS/JS | Vanilla | Interfaz de usuario |

---

##  Estructura del Proyecto
SV003007187/
├── backend/
│ ├── server.js # Servidor Express + Socket.io
│ ├── db.js # Configuración de SQLite
│ └── chat.db # Base de datos (se crea automáticamente)
├── frontend/
│ ├── index.html # Interfaz completa (CSS + JS incluidos)
│ ├── style.css # (vacío - opcional)
│ └── script.js # (vacío - opcional)
├── .env # Variables de entorno
├── .gitignore # Archivos ignorados por Git
├── package.json # Dependencias y scripts
└── readme.md # Este archivo

text

---

##  Instalación y Ejecución

### 1. Clonar o descargar el proyecto

```bash
cd SV003007187
2. Instalar dependencias
bash
npm install
3. Configurar variables de entorno
Crear archivo .env en la raíz:

env
PORT=3000
4. Iniciar el servidor
bash
npm run dev
5. Abrir el chat
Abrir frontend/index.html en el navegador (o usar Live Server)

🎮 Cómo Usar
Enviar mensajes
Escribe en el campo de texto y presiona "Enviar" o Enter

Los mensajes aparecen instantáneamente en todas las ventanas abiertas

Editar mensaje
Haz clic en " Editar" debajo de tu mensaje

Escribe el nuevo texto y confirma

Eliminar mensaje individual
Haz clic en " Eliminar" debajo de tu mensaje

Confirma la eliminación

Borrar todo el historial
Haz clic en el botón rojo " Borrar todo el historial"

Confirma la acción (NO se puede deshacer)

Asistente Bot
El bot responde automáticamente a estas palabras clave:

Palabra clave	Respuesta del Bot
"hola"	¡Hola! ¿Cómo estás? 😊
"cómo estás"	¡Muy bien! Gracias por preguntar. ¿Y tú?
"gracias"	¡De nada! 🤖
"ayuda"	Comandos disponibles...
"adiós"	¡Adiós! Vuelve pronto 👋
🔧 API Endpoints
Método	Endpoint	Descripción
GET	/api/messages	Obtener todos los mensajes
POST	/api/messages	Guardar nuevo mensaje
PUT	/api/chat/edit-message/:id	Editar mensaje
DELETE	/api/chat/delete-message/:id	Eliminar mensaje
DELETE	/api/chat/clear-history	Borrar todo el historial
GET	/test	Verificar servidor
📡 Eventos de Socket.io
Evento (cliente → servidor)	Descripción
sendMessage	Enviar nuevo mensaje
Evento (servidor → cliente)	Descripción
newMessage	Nuevo mensaje recibido
messageEdited	Mensaje editado
messageRemoved	Mensaje eliminado
historyCleared	Historial borrado
 Pruebas
Probar servidor
bash
curl http://localhost:3000/test
Probar API de mensajes
bash
# Obtener mensajes
curl http://localhost:3000/api/messages

# Guardar mensaje
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"text":"Hola","author":"user"}'
 Solución de Problemas
Error: Cannot find module
bash
npm install
Error: Puerto 3000 ocupado
Cambia el puerto en .env:

env
PORT=3001
El chat no conecta
Verificar que el servidor esté corriendo (npm run dev)

Abrir la consola del navegador (F12) para ver errores

Asegurar que la URL en index.html sea http://localhost:3000

 Demostración de Funcionalidades
Persistencia
Escribe un mensaje

Refresca la página (F5)

 El mensaje sigue ahí

Multi-cliente
Abre 2 o 3 pestañas con el chat

Envía un mensaje desde una

 Aparece instantáneamente en todas

Edición en tiempo real
Edita un mensaje desde una pestaña

 El cambio se ve en todas las pestañas

 Autor
Ruben Rojas

 Fecha
26 Abril 2026

 Conclusión
Proyecto completo que cumple con todos los requisitos del hackathon:

Chat persistente con SQLite

Tiempo real con Socket.io

CRUD completo (Crear, Leer, Actualizar, Borrar)

Asistente bot automático

Interfaz amigable y responsive

 Notas
La base de datos chat.db se crea automáticamente al iniciar

Los archivos style.css y script.js están vacíos (todo el código está en index.html por simplicidad)

Para producción, cambiar origin: "*" en CORS por la URL específica

 ¡Gracias por revisar mi proyecto!
text

---

##  Este `readme.md` incluye:

- Descripción del proyecto
-  Tecnologías usadas
- Estructura de archivos
-  Instrucciones de instalación
-  Guía de uso
-  API endpoints
-  Eventos Socket.io
-  Pruebas
-  Solución de problemas
-  Demostración de funcionalidades
-  Autoría

