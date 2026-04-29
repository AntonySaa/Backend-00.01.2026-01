const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('supertest');
const app = require('../src/app');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readSseTicks() {
  const sse = await request(app).get('/api/stream');
  const raw = sse.text || '';
  return raw
    .split('\n')
    .filter((line) => line.startsWith('data: tick'));
}

(async () => {
  console.log('Validation #2: Advanced rules + bonus endpoints');

  const apiKey = 'hackaton-key';
  const idemKey = `idem-${Date.now()}`;

  const payment1 = await request(app)
    .post('/api/v1/payments')
    .set('x-api-key', apiKey)
    .set('Idempotency-Key', idemKey)
    .set('Content-Type', 'application/json')
    .send({ amount: 150.75, currency: 'pen' });

  assert(payment1.status === 201, 'First payment request must return 201');

  const payment2 = await request(app)
    .post('/api/v1/payments')
    .set('x-api-key', apiKey)
    .set('Idempotency-Key', idemKey)
    .set('Content-Type', 'application/json')
    .send({ amount: 150.75, currency: 'pen' });

  assert(payment2.status === 200, 'Repeated idempotent payment must return 200');
  assert(
    JSON.stringify(payment1.body) === JSON.stringify(payment2.body),
    'Repeated idempotent payment must return exactly the same response body'
  );

  const paymentConflict = await request(app)
    .post('/api/v1/payments')
    .set('x-api-key', apiKey)
    .set('Idempotency-Key', idemKey)
    .set('Content-Type', 'application/json')
    .send({ amount: 999, currency: 'usd' });
  assert(paymentConflict.status === 409, 'Same Idempotency-Key with different payload must return 409');

  const tempDir = path.join(os.tmpdir(), `sv73449503-validate2-${Date.now()}`);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const fakeImagePath = path.join(tempDir, 'avatar.png');
  fs.writeFileSync(fakeImagePath, 'fakepngcontent');

  const uploadOk = await request(app)
    .post('/api/v1/uploads/avatar')
    .set('x-api-key', apiKey)
    .attach('avatar', fakeImagePath);
  assert(uploadOk.status === 201, 'Avatar upload with image MIME must return 201');
  if (uploadOk.body?.file?.path) {
    fs.rmSync(uploadOk.body.file.path, { force: true });
  }

  const txtPath = path.join(tempDir, 'bad.txt');
  fs.writeFileSync(txtPath, 'text-not-image');
  const uploadBad = await request(app)
    .post('/api/v1/uploads/avatar')
    .set('x-api-key', apiKey)
    .attach('avatar', txtPath);
  assert(uploadBad.status === 400, 'Avatar upload with non-image MIME must return 400');

  const ticks = await readSseTicks();
  assert(ticks.length === 5, 'SSE /api/stream must emit exactly 5 ticks');

  const docs = await request(app).get('/api/docs');
  assert([200, 301, 302].includes(docs.status), 'Swagger docs endpoint must be reachable');

  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('Validation #2 passed');
})().catch((err) => {
  console.error('Validation #2 failed:', err.message);
  process.exit(1);
});
