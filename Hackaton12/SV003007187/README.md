## ARQUITECTURA DEL PROYECTO

### Estructura MVC (Model-View-Controller)
- **Models**: Define la estructura de los datos (Item.ts)
- **Controllers**: Contiene la lógica de negocio
- **Routes**: Define los endpoints de la API
- **Config**: Configuración de la base de datos

### Tecnologías Utilizadas
| Tecnología | Propósito |
|------------|-----------|
| Node.js | Entorno de ejecución JavaScript |
| Express | Framework para crear APIs |
| TypeScript | Tipado estático y mejores prácticas |
| MongoDB | Base de datos NoSQL |
| Mongoose | ODM para modelar datos |

### Flujo de una Petición
1. Cliente (Postman) → Endpoint (Express)
2. Router → Controller
3. Controller → Model (Mongoose)
4. Model → MongoDB
5. Respuesta → Cliente

### Endpoints Implementados
| Método | Endpoint | Función |
|--------|----------|---------|
| POST | /api/items | Crear nuevo ítem |
| GET | /api/items/pending | Ver ítems no completados |
| GET | /api/items/completed | Ver ítems completados |
| PATCH | /api/items/:id/complete | Marcar ítem como completado |

### Códigos de Estado HTTP
- 200: Éxito
- 201: Recurso creado
- 400: Error del cliente (datos faltantes)
- 404: Recurso no encontrado
- 500: Error del servidor



  Lista de Compras API

API REST para gestionar lista de compras desarrollada con Node.js, TypeScript y MongoDB.

##  Tecnologías

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

## 📋 Requisitos Previos

- Node.js (v14+)
- MongoDB (v7+)
- npm o yarn

##  Instalación

```bash
# Clonar repositorio
git clone <tu-repositorio>
cd SV003007187

# Instalar dependencias
npm install

# Configurar variables de entorno
echo "PORT=3000" > .env
echo "MONGODB_URI=mongodb://localhost:27017/lista-compras" >> .env

# Ejecutar en desarrollo
npm run dev

# Compilar a producción
npm run build

# Ejecutar en producción
npm start