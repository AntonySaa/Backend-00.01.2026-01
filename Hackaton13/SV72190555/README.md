# Hackatón 13 — Express Pro API

API REST modular con **Express.js + TypeScript** — basada en el repositorio original, extendida con las rutas y funcionalidades del README del hackathon.

---

## Qué venía en el repo original

| Archivo | Descripción |
|---|---|
| `middlewares/logger.ts` | Log coloreado por status code + duración |
| `middlewares/errorHandler.ts` | `errorHandler` global + `appError()` factory |
| `middlewares/metrics.ts` | Acumulador de métricas por ruta/método/status |
| `middlewares/multer.ts` | Upload con diskStorage, filtro image/*, límite 2MB |
| `middlewares/auth.ts` | JWT middleware (Bearer token) |
| `middlewares/verifyAdmin.ts` | Verificación de rol admin |
| `controllers/auth.controller.ts` | Login, logout, createAccount, uploadAvatar |
| `controllers/item.controller.ts` | CRUD de ítems con paginación |
| `controllers/metrics.controller.ts` | Endpoint métricas del servidor |
| `routes/auth.ts` | POST /api/auth/login, /sign-in, /logout, /avatar |
| `routes/item.ts` | GET/POST/PUT/DELETE /api/item |
| `routes/metrics.ts` | GET /api/metrics |
| `routes/stream.ts` | GET /api/stream (SSE 5 ticks) |
| `config/swagger.ts` | OpenAPI 3.0 con swagger-jsdoc |
| `utils/pagination.ts` | `getPagination` + `paginatedResponse` |

## Qué se añadió (para cumplir el README del hackathon)

| Añadido | Motivo |
|---|---|
| `middlewares/requireJson.ts` | Fase 1: bloquea POST/PUT/PATCH sin `Content-Type: application/json` |
| `middlewares/requireToken.ts` | Fase 2: protege `/api/v1/orders` con `x-token: secret` |
| `middlewares/apiKey.ts` | Bonus: protección por `x-api-key` |
| `interface/IStore.ts` | Tipos TS para el store en memoria |
| `utils/store.ts` | BD en memoria (users, orders, idempotencia) — sin MongoDB |
| `controllers/users.controller.ts` | Fase 2: CRUD users con validación |
| `controllers/orders.controller.ts` | Fase 2: orders + paginación + export CSV |
| `controllers/uploadsV1.controller.ts` | Fase 3: upload público (sin JWT) |
| `controllers/payments.controller.ts` | Fase 3: pagos idempotentes |
| `routes/health.ts` | Fase 1: `GET /api/health` + `POST /api/data` |
| `routes/v1/users.ts` | Fase 2: rutas versionadas `/api/v1/users` |
| `routes/v1/orders.ts` | Fase 2: rutas versionadas `/api/v1/orders` |
| `routes/v1/uploads.ts` | Fase 3: `POST /api/v1/uploads/avatar` |
| `routes/v1/payments.ts` | Fase 3: `POST /api/v1/payments` |
| `morgan` activado en `app.ts` | Estaba comentado en el repo original |
| `server.ts` MongoDB opcional | Arranca sin BD si `MONGODB_URI` está vacío |

---

## Requisitos

- **Node.js** 18+
- **npm** 8+
- **Postman** (para probar endpoints)

---

## Instalación y arranque

```bash
# 1. Clonar o descomprimir el proyecto
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Editar .env — MONGODB_URI vacío = modo memoria (sin BD)
# Completar MONGODB_URI si quieres usar MongoDB Atlas

# 4. Arrancar
npm run dev
```

Servidor disponible en: `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api/docs`

> **Nota**: Con `MONGODB_URI` vacío el servidor arranca en **modo memoria** (ideal para el hackathon). Las rutas `/api/auth` y `/api/item` requieren MongoDB para funcionar.

---

## Estructura del proyecto

```
src/
├── app.ts                          ← Express: middlewares + rutas
├── server.ts                       ← Arranca servidor (MongoDB opcional)
├── config/
│   ├── database.ts                 ← Conexión MongoDB (original)
│   └── swagger.ts                  ← OpenAPI 3.0 (actualizado con v1)
├── middlewares/
│   ├── logger.ts                   ← Log coloreado (ORIGINAL)
│   ├── errorHandler.ts             ← errorHandler + appError() (ORIGINAL)
│   ├── metrics.ts                  ← Acumulador de métricas (ORIGINAL)
│   ├── multer.ts                   ← Upload imagen <2MB (ORIGINAL)
│   ├── auth.ts                     ← JWT middleware (ORIGINAL)
│   ├── verifyAdmin.ts              ← Rol admin (ORIGINAL)
│   ├── requireJson.ts              ← Content-Type validation (NUEVO)
│   ├── requireToken.ts             ← x-token: secret (NUEVO)
│   └── apiKey.ts                   ← x-api-key (NUEVO - bonus)
├── routes/
│   ├── index.ts                    ← Router principal (actualizado)
│   ├── health.ts                   ← /api/health + /api/data (NUEVO)
│   ├── auth.ts                     ← /api/auth/* (ORIGINAL)
│   ├── item.ts                     ← /api/item (ORIGINAL)
│   ├── metrics.ts                  ← /api/metrics (ORIGINAL)
│   ├── stream.ts                   ← /api/stream SSE (ORIGINAL)
│   └── v1/
│       ├── users.ts                ← /api/v1/users (NUEVO)
│       ├── orders.ts               ← /api/v1/orders (NUEVO)
│       ├── uploads.ts              ← /api/v1/uploads (NUEVO)
│       └── payments.ts             ← /api/v1/payments (NUEVO)
├── controllers/
│   ├── auth.controller.ts          ← Login/registro (ORIGINAL)
│   ├── item.controller.ts          ← CRUD ítems (ORIGINAL)
│   ├── metrics.controller.ts       ← Métricas (ORIGINAL)
│   ├── users.controller.ts         ← CRUD users memoria (NUEVO)
│   ├── orders.controller.ts        ← Orders + CSV (NUEVO)
│   ├── uploadsV1.controller.ts     ← Upload público (NUEVO)
│   └── payments.controller.ts      ← Pagos idempotentes (NUEVO)
├── models/
│   ├── User.ts                     ← Mongoose model (ORIGINAL)
│   └── Item.ts                     ← Mongoose model (ORIGINAL)
├── interface/
│   ├── IAppError.ts                ← (ORIGINAL)
│   ├── IItem.ts                    ← (ORIGINAL)
│   ├── IMetrics.ts                 ← (ORIGINAL)
│   ├── IPagination.ts              ← (ORIGINAL)
│   ├── IUser.ts                    ← (ORIGINAL)
│   └── IStore.ts                   ← Tipos store en memoria (NUEVO)
├── utils/
│   ├── store.ts                    ← BD en memoria (NUEVO)
│   ├── pagination.ts               ← getPagination (ORIGINAL)
│   ├── encriptar.ts                ← bcrypt (ORIGINAL)
│   └── jwt.handle.ts               ← JWT utils (ORIGINAL)
└── types/
    └── express.d.ts                ← Augmentación tipos Express (ORIGINAL)
uploads/                            ← Archivos subidos con multer
```

---

## Endpoints completos

### Fase 1 — Base

| Método | Ruta | Headers | Descripción |
|---|---|---|---|
| GET | `/api/health` | — | Estado del servidor |
| POST | `/api/data` | Content-Type: application/json | Echo de datos |

### Fase 2 — Rutas versionadas

| Método | Ruta | Headers | Descripción |
|---|---|---|---|
| GET | `/api/v1/users` | — | Listar usuarios |
| POST | `/api/v1/users` | Content-Type: application/json | Crear usuario |
| GET | `/api/v1/users/:id` | — | Obtener usuario por ID |
| GET | `/api/v1/orders?page=1&limit=10&sort=desc` | x-token: secret | Listar órdenes paginadas |
| POST | `/api/v1/orders` | Content-Type: application/json, x-token: secret | Crear orden |
| GET | `/api/v1/orders/export` | x-token: secret | Exportar CSV |

### Fase 3 — Uploads, Idempotencia, Métricas

| Método | Ruta | Headers | Descripción |
|---|---|---|---|
| POST | `/api/v1/uploads/avatar` | multipart/form-data | Subir imagen (<2MB) |
| POST | `/api/v1/payments` | Content-Type: application/json, Idempotency-Key: uuid | Pago idempotente |
| GET | `/api/metrics` | — | Métricas del servidor |
| GET | `/api/docs` | — | Swagger UI |
| GET | `/api/stream` | — | SSE: 5 ticks cada segundo |

### Originales del repo (requieren MongoDB + JWT)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/sign-in` | Crear cuenta |
| POST | `/api/auth/login` | Login → devuelve JWT |
| POST | `/api/auth/logout` | Invalidar token |
| POST | `/api/auth/avatar` | Subir avatar (requiere Bearer token) |
| GET | `/api/item` | Listar ítems del usuario |
| POST | `/api/item` | Crear ítem |
| PUT | `/api/item` | Actualizar ítem |
| DELETE | `/api/item` | Eliminar ítem |

---

## Cómo probar en Postman

### 1. Verificar servidor
```
GET http://localhost:3000/api/health
```
Respuesta: `{ "status": "ok", "timestamp": "..." }`

### 2. Crear usuario
```
POST http://localhost:3000/api/v1/users
Headers: Content-Type: application/json
Body:
{
  "name": "Milan",
  "email": "milan@example.com"
}
```
Copia el `id` de la respuesta para usarlo como `customerId`.

### 3. Crear orden
```
POST http://localhost:3000/api/v1/orders
Headers:
  Content-Type: application/json
  x-token: secret
Body:
{
  "customerId": "<id-del-usuario>",
  "items": [
    { "product": "Laptop", "qty": 1, "price": 999 }
  ]
}
```

### 4. Listar órdenes con paginación
```
GET http://localhost:3000/api/v1/orders?page=1&limit=5&sort=desc
Headers: x-token: secret
```

### 5. Exportar CSV
```
GET http://localhost:3000/api/v1/orders/export
Headers: x-token: secret
```
En Postman: **Send and Download** para guardar el archivo `.csv`.

### 6. Subir avatar
```
POST http://localhost:3000/api/v1/uploads/avatar
Body: form-data
  Key: avatar  (tipo: File)
  Value: seleccionar imagen JPEG/PNG < 2MB
```

### 7. Pago idempotente
```
POST http://localhost:3000/api/v1/payments
Headers:
  Content-Type: application/json
  Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Body:
{
  "amount": 99.99,
  "currency": "USD",
  "description": "Suscripcion mensual"
}
```
Envía la misma petición **dos veces** con el mismo `Idempotency-Key`:
- Primera: `201` — pago procesado
- Segunda: `200` + `"_idempotent": true` — sin doble cobro

### 8. Métricas
```
GET http://localhost:3000/api/metrics
```

### 9. SSE Stream
```
GET http://localhost:3000/api/stream
```
Abre en **Postman** (Send and Download) o en el navegador para ver los 5 eventos en tiempo real.

---

## Headers de referencia rápida

| Header | Valor | Usado en |
|---|---|---|
| `Content-Type` | `application/json` | POST/PUT en `/api/v1/*` |
| `x-token` | `secret` | Todas las rutas `/api/v1/orders` |
| `Idempotency-Key` | UUID único por pago | `POST /api/v1/payments` |
| `x-api-key` | `api-key-demo` | Rutas con `apiKey` middleware (bonus) |
| `Authorization` | `Bearer <jwt>` | Rutas originales `/api/auth`, `/api/item` |

---

## MongoDB (opcional)

Para activar las rutas originales (`/api/auth`, `/api/item`):

1. Crear cluster en [MongoDB Atlas](https://cloud.mongodb.com)
2. Copiar la connection string
3. Editar `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hackaton13
   ```
4. Seed de datos de prueba:
   ```bash
   npm run db:seed
   # Usuarios: milan@test.com / 123456  |  ana@test.com / 123456
   ```

---

## Notas de aprendizaje

- **`store.ts`**: Patrón Repository en memoria. En producción: sustituir `store.users.create()` por `User.create()` (Mongoose) sin tocar los controladores.
- **`errorHandler`**: Necesita exactamente **4 parámetros** `(err, req, res, next)` para que Express lo reconozca como middleware de error.
- **`appError()`**: Factory que enriquece un `Error` estándar con `statusCode` y `code`. Úsalo en controladores: `return next(appError(404, 'NOT_FOUND', 'mensaje'))`.
- **Idempotencia**: El cliente genera el UUID, no el servidor. La misma clave = mismo resultado garantizado. Fundamental en pagos para evitar doble cobro por reintentos de red.
- **`requireJson`**: Solo aplica en `/api/v1/*`. No afecta las rutas originales ni los endpoints de upload (`multipart/form-data`).
- **SSE**: `Content-Type: text/event-stream` + formato `data: {...}\n\n` (doble newline obligatorio entre eventos). Alternativa ligera a WebSockets para streams del servidor al cliente.
- **`metricsMiddleware`**: Usa `res.on('finish')` para medir el tiempo **real** de respuesta (después de que Express envía el último byte al cliente).
- **Swagger JSDoc**: Los bloques `@swagger` sobre las rutas son leídos por `swagger-jsdoc` y convertidos a OpenAPI 3.0. Visibles en `/api/docs`.
