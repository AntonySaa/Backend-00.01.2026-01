require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API Express Pro - Hackatón 13',
        description: 'API modular con Express.js con middlewares, validaciones, uploads e idempotencia',
    },
    host: `localhost:${process.env.PORT}`,
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./src/app');
});
