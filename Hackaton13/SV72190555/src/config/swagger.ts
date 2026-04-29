import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hackatón 13 Express Pro API',
      version: '1.0.0',
      description:
        'API modular con Express.js — middlewares, rutas versionadas, uploads, idempotencia, métricas y documentación Swagger.',
      contact: { name: 'Milan', email: 'milan@example.com' },
      license: { name: 'MIT' },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        XToken: {
          type: 'apiKey',
          in: 'header',
          name: 'x-token',
          description: 'Token simple (valor: "secret")',
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API Key para rutas protegidas',
        },
        IdempotencyKey: {
          type: 'apiKey',
          in: 'header',
          name: 'Idempotency-Key',
          description: 'UUID único por operación (evita duplicados)',
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT para rutas originales /api/auth y /api/item',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Milan' },
            email: { type: 'string', example: 'milan@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            customerId: { type: 'string' },
            items: { type: 'array', items: { type: 'object' } },
            status: { type: 'string', enum: ['pending', 'paid', 'shipped', 'cancelled'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            code: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  // Incluir tanto rutas originales como las nuevas (v1)
  apis: [
    path.join(__dirname, '..', 'routes', '*.ts'),
    path.join(__dirname, '..', 'routes', 'v1', '*.ts'),
    path.join(__dirname, '..', 'app.ts'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
