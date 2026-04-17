# 📋 API Lista de Compras

Aplicación backend desarrollada con **Node.js, TypeScript y MongoDB** para gestionar una lista de compras.

## 🎯 Características

✅ Crear ítems de compra  
✅ Ver todos los ítems  
✅ Filtrar por pendientes  
✅ Filtrar por completados  
✅ Marcar ítems como completados  
✅ Actualizar ítems  
✅ Eliminar ítems  

## 🛠️ Requisitos

- Node.js (v18+)
- MongoDB (localmente o via Docker)
- npm o yarn

## 📦 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar MongoDB con Docker

Si tienes Docker instalado, ejecuta:

```bash
docker-compose up -d
```

Esto iniciará un contenedor MongoDB con las credenciales:
- Usuario: `admin`
- Contraseña: `admin123`
- Base de datos: `mydb`
- URI: `mongodb://admin:admin123@localhost:27017/mydb?authSource=admin`

O manualmente con el CLI de MongoDB:
```bash
mongosh -u admin -p admin123 --authenticationDatabase admin
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:8000**

### 4. Compilar a JavaScript

```bash
npm run build
```

## 📚 Estructura del Proyecto

```
src/
├── config/
│   ├── env.ts           # Configuración de variables de entorno
│   └── database.ts      # Conexión a MongoDB
├── models/
│   └── Item.ts          # Modelo de datos con Mongoose
├── controllers/
│   └── itemController.ts # Lógica de negocio
├── routes/
│   └── itemRoutes.ts    # Definición de endpoints
└── index.ts             # Aplicación principal
```

## 🌐 Endpoints API

### Base URL
```
http://localhost:8000/api/items
```

### 1. Crear un ítem
```http
POST /api/items
Content-Type: application/json

{
  "nombre": "Comprar leche",
  "descripcion": "Leche deslactosada integral",
  "fecha": "2026-04-10",
  "esCompletado": false
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Item creado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Comprar leche",
    "descripcion": "Leche deslactosada integral",
    "fecha": "2026-04-10T00:00:00.000Z",
    "esCompletado": false,
    "createdAt": "2026-04-10T12:34:56.789Z",
    "updatedAt": "2026-04-10T12:34:56.789Z"
  }
}
```

### 2. Obtener todos los ítems
```http
GET /api/items
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Comprar leche",
      "descripcion": "Leche deslactosada integral",
      "fecha": "2026-04-10T00:00:00.000Z",
      "esCompletado": false,
      "createdAt": "2026-04-10T12:34:56.789Z",
      "updatedAt": "2026-04-10T12:34:56.789Z"
    }
  ],
  "total": 1
}
```

### 3. Obtener ítems pendientes
```http
GET /api/items/pending
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Items pendientes",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Comprar leche",
      "descripcion": "Leche deslactosada integral",
      "fecha": "2026-04-10T00:00:00.000Z",
      "esCompletado": false,
      "createdAt": "2026-04-10T12:34:56.789Z",
      "updatedAt": "2026-04-10T12:34:56.789Z"
    }
  ],
  "total": 1
}
```

### 4. Obtener ítems completados
```http
GET /api/items/completed
```

### 5. Marcar ítem como completado
```http
PATCH /api/items/{id}/complete
```

Reemplaza `{id}` con el ID del ítem.

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Item marcado como completado",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Comprar leche",
    "descripcion": "Leche deslactosada integral",
    "fecha": "2026-04-10T00:00:00.000Z",
    "esCompletado": true,
    "createdAt": "2026-04-10T12:34:56.789Z",
    "updatedAt": "2026-04-10T12:35:00.000Z"
  }
}
```

### 6. Actualizar ítem
```http
PATCH /api/items/{id}
Content-Type: application/json

{
  "nombre": "Comprar leche descremada",
  "descripcion": "Leche descremada integral",
  "fecha": "2026-04-15",
  "esCompletado": false
}
```

### 7. Eliminar ítem
```http
DELETE /api/items/{id}
```

## 🧪 Prueba con Postman/Insomnia

Se incluye una colección `ApiColeccion.json` con todos los endpoints configurados.

**Pasos:**
1. Abre Postman o Insomnia
2. Importa el archivo `ApiColeccion.json`
3. Ejecuta los requests

## 📋 Variables de Entorno

Archivo `.env`:
```env
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DB=mydb

# App
PORT=8000

# URI
MONGO_URI=mongodb://admin:admin123@localhost:27017/mydb?authSource=admin
```

## 🧹 Limpiar Base de Datos

Para eliminar el volumen de MongoDB:
```bash
docker-compose down -v
```

## 📝 Validaciones

- **nombre**: Mínimo 3 caracteres, obligatorio
- **descripcion**: Mínimo 5 caracteres, obligatorio
- **fecha**: Obligatoria, por defecto fecha actual
- **esCompletado**: Boolean, por defecto `false`

