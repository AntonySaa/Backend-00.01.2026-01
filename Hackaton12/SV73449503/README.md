# Lista de Compras API

API con Express, TypeScript y MongoDB para gestionar una lista de compras.

## Requisitos
- Node.js
- MongoDB en ejecucion

## Configuracion
1. Copia `.env.example` a `.env` y ajusta `MONGODB_URI`.
2. Instala dependencias y ejecuta:

```bash
npm install
npm run dev
```

## Endpoints
- `POST /items`
- `GET /items/pending`
- `GET /items/completed`
- `PATCH /items/:id/complete`

## Ejemplo de request

```json
{
  "nombre": "Comprar leche",
  "descripcion": "Leche deslactosada",
  "fecha": "2026-04-10",
  "esCompletado": false
  
}
```
