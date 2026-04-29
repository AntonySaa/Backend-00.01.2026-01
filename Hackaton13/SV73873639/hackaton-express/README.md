# 🚀 Hackatón Express Pro — 6 Horas (Idat)

API modular y avanzada construida con Express.js. Este proyecto cumple con todos los requerimientos de las Fases 1, 2 y 3, incluyendo además los Desafíos Bonus propuestos para la evaluación.

## 🛠️ Tecnologías y Librerías Utilizadas
* **Node.js & Express:** Core del servidor y enrutamiento.
* **Helmet & Cors:** Seguridad y manejo de peticiones de origen cruzado.
* **Multer:** Gestión de subida de archivos (multipart/form-data).
* **Swagger-UI-Express & YAML:** Documentación interactiva de la API.
* **Express-Rate-Limit:** Prevención de ataques de fuerza bruta.
* **Morgan:** Logging de peticiones HTTP.

---

## ⚙️ Instalación y Ejecución

1. Clona o descarga este repositorio.
2. Abre la terminal en la carpeta del proyecto e instala las dependencias:
   ```bash
   npm install

   📚 Documentación Swagger
La API cuenta con documentación interactiva. Una vez que el servidor esté corriendo, visita:
👉 http://localhost:3000/api/docs

¿Cómo probarlo?

Dale clic al botón blanco que dice "Try it out" (Suele estar arriba a la derecha en esa misma cajita).

Swagger te habilitará un cuadro de texto en la zona de "Request body" donde podrás modificar el JSON que armamos (el que dice "name": "Juan Pérez").

Le das al botón azul grande de "Execute" y verás la respuesta del servidor más abajo.


Resumen de Endpoints Principales
Fase 1: Base y Middlewares
GET /api/health: Verifica el estado del servidor.

POST /api/data: Endpoint de prueba (Requiere x-api-key por el bonus).

Fase 2: Rutas y Validaciones
GET /api/v1/users: Lista todos los usuarios.

POST /api/v1/users: Crea un usuario (Valida name y email).

GET /api/v1/orders: Paginación, filtrado y ordenamiento de órdenes (Requiere Header: x-token: secret).

GET /api/v1/orders/export: Descarga las órdenes en formato CSV (Streaming).

POST /api/v1/orders: Crea una orden validando estructura.

Fase 3: Uploads e Idempotencia
POST /api/v1/uploads/avatar: Sube una imagen (Máx 2MB, solo formato image/*).

POST /api/v1/payments: Simula un cobro. (Requiere Header: Idempotency-Key). Si se envía la misma llave, retorna el resultado cacheado.

GET /api/metrics: Retorna el conteo de peticiones por ruta.