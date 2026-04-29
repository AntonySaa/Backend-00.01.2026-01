# API Express Modular - Hackaton

Proyecto de API modular con Express.js que incluye middlewares personalizados, rutas versionadas, uploads, idempotencia, métricas y Swagger.

## Requisitos

- Node.js 18+
- npm

## Instalación y ejecución

```bash
npm install
npm run dev
```
  
Servidor por defecto: `http://localhost:3000`

## Estructura

```bash
.
├── docs/
│   └── openapi.yaml
├── server.js
├── src/
│   ├── app.js
│   ├── data/
│   ├── middlewares/
│   ├── routes/
│   │   ├── index.js
│   │   └── v1/
│   └── services/
└── README.md
```

## Endpoints principales

### Fase 1

- `GET /api/health` -> `{ status: 'ok' }`
- `POST /api/data` -> `{ received: true }` (requiere `Content-Type: application/json`)

### Fase 2

#### Users (`/api/v1/users`)

- `GET /` lista usuarios
- `POST /` crea usuario validando `{ name, email }`
- `GET /:id` retorna usuario por ID

#### Orders (`/api/v1/orders`)

- Requiere header `x-token: secret`
- `GET /` paginación + filtros + orden
  - Query: `page`, `limit`, `status`, `sortBy`, `order`
- `POST /` valida `{ items, customerId }`
- `GET /export` descarga CSV por streaming

### Fase 3

- `POST /api/v1/uploads/avatar`
  - Header: `x-api-key: hackaton-key`
  - FormData: campo `avatar`
  - Solo `image/*`, máximo 2MB
- `POST /api/v1/payments`
  - Headers: `x-api-key: hackaton-key`, `Idempotency-Key: <unique>`
  - Body JSON: `{ amount, currency }`
  - Si repites la misma key y mismo body, devuelve exactamente la misma respuesta.
- `GET /api/metrics` devuelve métricas por ruta
- `GET /api/docs` documentación Swagger UI

### Bonus

- Middleware de API Key (`x-api-key`) en endpoints sensibles.
- Middleware condicional que loguea solo `POST` y `PUT`.
- SSE en `GET /api/stream` con 5 ticks (1 por segundo).

## Ejemplos rápidos

```bash
curl http://localhost:3000/api/health

curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"demo":true}'

curl http://localhost:3000/api/v1/orders -H "x-token: secret"

curl -X POST http://localhost:3000/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "x-api-key: hackaton-key" \
  -H "Idempotency-Key: pago-001" \
  -d '{"amount":120.50,"currency":"pen"}'
```
