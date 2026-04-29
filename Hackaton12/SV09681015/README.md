# 🛒 Shopping List API

API REST para gestionar una lista de compras, desarrollada con **Node.js + TypeScript + Express + MongoDB Atlas**.

---

## 📦 Tecnologías

- Node.js
- TypeScript
- Express.js
- MongoDB Atlas + Mongoose
- dotenv
- Middleware de logs personalizado
- cors

---

## 🚀 Instalación y uso

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd shopping-list-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tu URI de MongoDB Atlas:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxxx.mongodb.net/lista_compras
NODE_ENV=development
```

> ⚠️ **Importante:** el nombre de la base de datos (`lista_compras`) debe ir al final de la URI. Si no se especifica, MongoDB usará `test` por defecto.

Para obtener tu URI:
1. Ingresa a [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click en **Connect** → **Drivers**
3. Copia la URI y reemplaza `<usuario>` y `<password>`
4. Asegúrate de tener `0.0.0.0/0` en **Network Access**

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

Deberías ver:
```
✅ MongoDB conectado: cluster0.xxxxxx.mongodb.net
🚀 Servidor corriendo en http://localhost:3000
🌐 Interfaz web en   http://localhost:3000/index.html
```

### 5. Compilar para producción

```bash
npm run build
npm start
```

---

## 🌐 Interfaz web

La aplicación incluye una interfaz web accesible en:

```
http://localhost:3000/index.html
```

Permite agregar ítems, ver pendientes, ver completados, marcar como completado y eliminar, todo desde el navegador sin necesidad de Postman.

---

## 📡 Endpoints

### Requeridos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/items` | Crear un nuevo ítem |
| `GET` | `/items/pending` | Ver ítems pendientes |
| `GET` | `/items/completed` | Ver ítems completados |
| `PATCH` | `/items/:id/complete` | Marcar ítem como completado |

### Bonus

| Método | Ruta | Descripción |
|--------|------|-------------|
| `DELETE` | `/items/:id` | Eliminar ítem |
| `PUT` | `/items/:id` | Editar ítem |
| `GET` | `/items/filter/by-date?from=&to=` | Filtrar por rango de fechas |
| `GET` | `/health` | Estado del servidor |

---

## 🧾 Ejemplos de requests

### Crear ítem

```http
POST /items
Content-Type: application/json

{
  "nombre": "Comprar leche",
  "descripcion": "Leche deslactosada 1L",
  "fecha": "2026-04-19",
  "esCompletado": false
}
```

### Ver pendientes

```http
GET /items/pending
```

### Ver completados

```http
GET /items/completed
```

### Completar ítem

```http
PATCH /items/6619a3f2d4e2a10012345678/complete
```

### Eliminar ítem

```http
DELETE /items/6619a3f2d4e2a10012345678
```

### Editar ítem

```http
PUT /items/6619a3f2d4e2a10012345678
Content-Type: application/json

{
  "nombre": "Comprar pan",
  "descripcion": "Pan integral"
}
```

### Filtrar por fecha

```http
GET /items/filter/by-date?from=2026-04-01&to=2026-04-30
```

---

## 📁 Estructura del proyecto

```
shopping-list-api/
├── public/
│   └── index.html             # Interfaz web (bonus)
├── src/
│   ├── config/
│   │   └── database.ts        # Conexión a MongoDB Atlas
│   ├── controllers/
│   │   └── item.controller.ts # Lógica de negocio
│   ├── middleware/
│   │   └── logger.middleware.ts # Logs de peticiones
│   ├── models/
│   │   └── item.model.ts      # Esquema Mongoose + tipos TS
│   ├── routes/
│   │   └── item.routes.ts     # Definición de rutas
│   └── app.ts                 # Punto de entrada
├── .env                       # Variables de entorno (no subir a git)
├── .env.example               # Plantilla de variables de entorno
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📋 Modelo de datos

```typescript
interface IItem {
  nombre: string;        // Nombre del ítem (requerido, max 100 chars)
  descripcion: string;   // Descripción (requerido, max 500 chars)
  fecha: Date;           // Fecha del ítem (requerido)
  esCompletado: boolean; // Estado completado (default: false)
  createdAt: Date;       // Auto-generado por Mongoose
  updatedAt: Date;       // Auto-generado por Mongoose
}
```

---

## ✅ Criterios cumplidos

- [x] Proyecto configurado con TypeScript
- [x] Conexión exitosa a MongoDB Atlas
- [x] CRUD básico funcionando
- [x] Rutas implementadas correctamente
- [x] Código organizado por capas (models / controllers / routes / config / middleware)
- [x] Aplicación funcional

## ⭐ Bonus implementados

- [x] Eliminar ítems (`DELETE /items/:id`)
- [x] Editar ítems (`PUT /items/:id`)
- [x] Filtro por fecha (`GET /items/filter/by-date`)
- [x] Variables de entorno (`.env` con dotenv)
- [x] Middleware de logs personalizado
- [x] Scripts `dev` y `build`
- [x] Interfaz web simple (`public/index.html`)
