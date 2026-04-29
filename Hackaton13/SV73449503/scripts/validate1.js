const request = require('supertest');
const app = require('../src/app');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

(async () => {
  console.log('Validation #1: Core required endpoints');

  const health = await request(app).get('/api/health');
  assert(health.status === 200, 'GET /api/health must return 200');
  assert(health.body.status === 'ok', 'GET /api/health must return { status: ok }');

  const dataOk = await request(app)
    .post('/api/data')
    .set('Content-Type', 'application/json')
    .send({ demo: true });
  assert(dataOk.status === 200, 'POST /api/data must return 200');
  assert(dataOk.body.received === true, 'POST /api/data must return { received: true }');

  const dataWrongType = await request(app)
    .post('/api/data')
    .set('Content-Type', 'text/plain')
    .send('not-json');
  assert(dataWrongType.status === 415, 'POST /api/data with wrong content-type must return 415');

  const usersList = await request(app).get('/api/v1/users');
  assert(usersList.status === 200, 'GET /api/v1/users must return 200');
  assert(Array.isArray(usersList.body.data), 'GET /api/v1/users must return array');

  const userCreated = await request(app)
    .post('/api/v1/users')
    .set('Content-Type', 'application/json')
    .send({ name: 'Carlos Vega', email: 'carlos@demo.com' });
  assert(userCreated.status === 201, 'POST /api/v1/users must return 201');

  const userGet = await request(app).get(`/api/v1/users/${userCreated.body.data.id}`);
  assert(userGet.status === 200, 'GET /api/v1/users/:id must return 200');

  const ordersUnauthorized = await request(app).get('/api/v1/orders');
  assert(ordersUnauthorized.status === 401, 'GET /api/v1/orders without x-token must return 401');

  const ordersOk = await request(app)
    .get('/api/v1/orders?page=1&limit=2&status=pending&sortBy=createdAt&order=asc')
    .set('x-token', 'secret');
  assert(ordersOk.status === 200, 'GET /api/v1/orders with token must return 200');
  assert(ordersOk.body.meta.limit === 2, 'GET /api/v1/orders must honor limit query');

  const orderCreated = await request(app)
    .post('/api/v1/orders')
    .set('x-token', 'secret')
    .set('Content-Type', 'application/json')
    .send({ customerId: 777, items: [{ sku: 'Z-9', qty: 1 }] });
  assert(orderCreated.status === 201, 'POST /api/v1/orders must return 201');

  const ordersCsv = await request(app)
    .get('/api/v1/orders/export')
    .set('x-token', 'secret');
  assert(ordersCsv.status === 200, 'GET /api/v1/orders/export must return 200');
  assert(ordersCsv.text.includes('id,customerId,status,total,createdAt'), 'CSV export must include headers');

  const metrics = await request(app).get('/api/metrics');
  assert(metrics.status === 200, 'GET /api/metrics must return 200');
  assert(typeof metrics.body.totalRequests === 'number', 'GET /api/metrics must return totalRequests');

  const docs = await request(app).get('/api/docs');
  assert([200, 301, 302].includes(docs.status), 'GET /api/docs must be reachable');

  console.log('Validation #1 passed');
})().catch((err) => {
  console.error('Validation #1 failed:', err.message);
  process.exit(1);
});
