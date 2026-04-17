# Control de Producción de Armarios

Proyecto backend hecho con Node.js, Express y MongoDB Atlas. Permite manejar un inventario básico y simular la producción de armarios según los recursos disponibles.

## Funcionalidades

* Ver inventario
* Comprar materia prima
* Comprar insumos
* Gestionar horas de trabajo
* Producir armarios

## Tecnologías

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* dotenv

## Cómo ejecutar el proyecto

1. Clonar el repositorio:

```bash
git clone <tu-repo>
cd <tu-proyecto>
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz con:

```env
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=SV003007187
```

4. Ejecutar:

```bash
node app.js
```

5. Abrir en el navegador:

```
http://localhost:3000
```

## Sobre la estructura

Todo el proyecto está en un solo archivo (`app.js`).
Esto se hizo así para mantenerlo simple y fácil de entender, ya que es un proyecto pequeño y de práctica.

En un proyecto más grande lo puedo separar en:

* modelos
* rutas
* controladores

## Notas

* La base de datos está en MongoDB Atlas
* Se usa `.env` para no exponer credenciales
* Es un proyecto de práctica backend
