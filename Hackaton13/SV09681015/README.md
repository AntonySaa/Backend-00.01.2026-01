# 🚀 Hackatón Express Pro — API

API modular con Express.js que implementa middlewares personalizados, rutas versionadas, uploads, idempotencia, métricas y documentación Swagger.

---

## ⚙️ Instalación y ejecución

```bash
npm install
npm run dev
```

Servidor en: `http://localhost:3000`

---

## 🗂️ Estructura del proyecto

```
src/
├── app.js                    # Configuración central de Express
├── server.js                 # Entry point (escucha el puerto)
├── middlewares/
│   ├── logger.js             # Muestra método, ruta y duración
│   ├── requireJson.js        # Bloquea requests sin Content-Type: application/json
│   ├── errorHandler.js       # Error handler global + asyncHandler
│   ├── metrics.js            # Métricas en memoria
│   ├── conditionalLogger.js  # BONUS: loguea solo POST y PUT
│   └── apiKey.js             # BONUS: autenticación x-api-key
├── routes/
│   ├── health.js             # GET /api/health
│   ├── data.js               # POST /api/data
│   ├── metrics.js            # GET /api/metrics
│   ├── stream.js             # GET /api/stream (SSE)
│   ├── docs.js               # GET /api/docs (Swagger UI)
│   └── v1/
│       ├── users.js          # /api/v1/users
│       ├── orders.js         # /api/v1/orders (protegido con x-token)
│       ├── uploads.js        # /api/v1/uploads/avatar
│       └── payments.js       # /api/v1/payments (idempotente)
docs/
└── openapi.yaml              # Especificación OpenAPI 3.0
uploads/                      # Archivos subidos (generado automáticamente)
```

---

## 📋 Endpoints

### Fase 1 — Health & Data

| Método | Ruta        | Descripción                           | Auth |
|--------|-------------|---------------------------------------|------|
| GET    | /api/health | Estado del servidor                   | —    |
| POST   | /api/data   | Recibe JSON (requiere Content-Type)   | —    |

### Fase 2 — Usuarios

| Método | Ruta               | Descripción                         | Auth |
|--------|--------------------|-------------------------------------|------|
| GET    | /api/v1/users      | Lista usuarios                      | —    |
| POST   | /api/v1/users      | Crea usuario `{ name, email }`      | —    |
| GET    | /api/v1/users/:id  | Obtiene usuario por ID              | —    |

### Fase 2 — Órdenes (requieren `x-token: secret`)

| Método | Ruta                    | Descripción                                   |
|--------|-------------------------|-----------------------------------------------|
| GET    | /api/v1/orders          | Lista con paginación, filtro y orden          |
| POST   | /api/v1/orders          | Crea orden `{ items, customerId }`            |
| GET    | /api/v1/orders/export   | Descarga CSV en streaming                     |

**Query params de GET /orders:** `page`, `limit`, `status`, `sort`, `customerId`

### Fase 3 — Uploads

| Método | Ruta                      | Descripción                        |
|--------|---------------------------|------------------------------------|
| POST   | /api/v1/uploads/avatar    | Sube imagen (máx 2MB, `image/*`)  |
| GET    | /api/v1/uploads/:filename | Descarga archivo subido            |

**Body:** `multipart/form-data` con campo `avatar`.

### Fase 3 — Pagos (idempotentes)

| Método | Ruta               | Descripción                                        |
|--------|--------------------|----------------------------------------------------|
| POST   | /api/v1/payments   | Procesa pago `{ amount, currency, description }`   |
| GET    | /api/v1/payments   | Lista pagos procesados                             |

**Requiere header:** `Idempotency-Key: <uuid-único>`

Si se repite la misma key, devuelve la respuesta original con `X-Idempotent-Replayed: true`.

### Métricas, SSE y Docs

| Método | Ruta         | Descripción                             |
|--------|--------------|-----------------------------------------|
| GET    | /api/metrics | Métricas de uso por ruta                |
| GET    | /api/stream  | SSE — 5 ticks (1 por segundo)           |
| GET    | /api/docs    | Swagger UI (documentación interactiva)  |

---

## 🛡️ Seguridad y Middlewares

| Middleware         | Descripción                                              |
|--------------------|----------------------------------------------------------|
| `helmet`           | Headers de seguridad HTTP                               |
| `cors`             | Cross-Origin Resource Sharing                           |
| `compression`      | Compresión gzip de respuestas                           |
| `morgan`           | Log de requests HTTP                                    |
| `express-rate-limit` | Límite de 200 req / 15 minutos                        |
| `loggerMiddleware` | Log custom con método, ruta, status y duración          |
| `requireJson`      | Bloquea POST/PUT/PATCH sin `Content-Type: application/json` |
| `errorHandler`     | Captura errores sync y async globalmente                |
| `metricsMiddleware`| Contabiliza requests por ruta                           |

---

## 🎁 Bonus implementados

- ✅ **API Key**: header `x-api-key` (middleware `apiKey.js`)
- ✅ **Conditional Logger**: loguea solo `POST` y `PUT`
- ✅ **SSE `/api/stream`**: 5 ticks cada segundo

---

## 🧪 Ejemplos rápidos con curl

```bash
# Health
curl http://localhost:3000/api/health

# Crear usuario
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Laura","email":"laura@test.com"}'

# Listar órdenes (con token)
curl http://localhost:3000/api/v1/orders?page=1&limit=5&status=pending \
  -H "x-token: secret"

# Exportar CSV
curl http://localhost:3000/api/v1/orders/export \
  -H "x-token: secret" -o orders.csv

# Pago idempotente
curl -X POST http://localhost:3000/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: pago-unico-001" \
  -d '{"amount":99.99,"currency":"USD","description":"Suscripción"}'

# Métricas
curl http://localhost:3000/api/metrics

# SSE stream
curl -N http://localhost:3000/api/stream
```
