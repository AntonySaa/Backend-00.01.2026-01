# API Express Pro - Hackaton 13

API modular con Express.js que implementa middlewares personalizados, validaciones, uploads, endpoints idempotentes y métricas.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm start
```

## Endpoints

### Health
- **GET** `/api/health` - Estado del servidor

### Métricas
- **GET** `/api/metrics` - Métricas de uso de rutas

### Usuarios (v1)
- **GET** `/api/v1/user` - Listar usuarios
- **POST** `/api/v1/user` - Crear usuario (body: {name, email})
- **GET** `/api/v1/user/:id` - Obtener usuario por ID

### Órdenes (v1)
Requieren header `x-token: secret`

- **GET** `/api/v1/order` - Listar órdenes (query: page, limit, sort)
- **POST** `/api/v1/order` - Crear orden (body: {items[], customerID})
- **GET** `/api/v1/order/export` - Exportar CSV
- **POST** `/api/v1/order/payment` - Crear pago (header: idempotency-key)
- **POST** `/api/v1/order/avatar` - Subir avatar (image/* max 2MB)

### Streaming (v2)
- **GET** `/api/v2/stream` - SSE stream con 5 ticks

## Documentación Swagger

Accede a `http://localhost:3000/api-docs` para ver la documentación interactiva.

## Estructura

```
├── bin/
│   └── www                    # Punto de entrada del servidor
├── src/
│   ├── app.js                 # Configuración de Express
│   ├── middlewares/
│   │   ├── errorHandler.js    # Manejo de errores global
│   │   ├── logger.js          # Logger personalizado
│   │   ├── requireJson.js     # Validar Content-Type
│   │   ├── metrics.js         # Recolectar métricas
│   │   ├── validateUser.js    # Validaciones de usuario
│   │   ├── validateOrder.js   # Validaciones de orden
│   │   ├── validateAuth.js    # Autenticación
│   │   ├── async.js           # Wrapper para async
│   │   └── httpError.js       # Clase de error personalizada
│   ├── routes/
│   │   ├── index.js           # Rutas principales
│   │   ├── v1/
│   │   │   ├── index.js       # Router v1
│   │   │   ├── user.route.js  # Rutas de usuarios
│   │   │   └── order.route.js # Rutas de órdenes
│   │   └── v2/
│   │       └── index.js       # Router v2 (streaming)
│   └── controllers/
│       ├── health.js          # Health check
│       ├── user.controller.js # Lógica de usuarios
│       └── order.controller.js # Lógica de órdenes
├── uploads/                   # Directorio de subidas
├── .env                       # Variables de entorno
├── package.json
└── swagger_output.json        # Documentación Swagger
```

## Middlewares

- **helmet**: Seguridad HTTP
- **cors**: CORS configurado
- **compression**: Compresión de respuestas
- **morgan**: Logging de requests
- **express-rate-limit**: Rate limiting
- **logger personalizado**: Tiempo de ejecución
- **requireJson**: Validar Content-Type
- **metrics**: Recolectar estadísticas

## Validaciones

- **validateUser**: Valida name y email
- **validateOrder**: Valida items y customerID
- **validateAuth**: Requiere x-token: secret

## Características Especiales

- **Idempotencia**: POST /api/v1/order/payment usa idempotency-key
- **Uploads**: Avatar con filtro de imágenes
- **Streaming**: SSE en /api/v2/stream
- **Paginación**: GET /api/v1/order soporta page, limit, sort
- **CSV Export**: Exportar órdenes a CSV

## Variables de Entorno

```
PORT=3000
NODE_ENV=development
ORIGINS=*
```
