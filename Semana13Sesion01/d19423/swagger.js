require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API de Pruebas',
        description: 'Documentación de la API para la gestión de mascotas',
    },
    host: `localhost:${process.env.PORT}`,
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./app.js']; // Cambia este archivo según el punto de entrada de tu API

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app'); // Inicia el servidor automáticamente
});