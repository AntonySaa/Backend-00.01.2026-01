const assert = require('assert');
const { spawn } = require('child_process');
const path = require('path');
const { io } = require('socket.io-client');

const ROOT = path.join(__dirname, '..');
const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) return;
    } catch (_e) {
      // continue polling
    }
    await sleep(150);
  }
  throw new Error('Servidor no disponible en el tiempo esperado.');
}

async function post(pathname, body) {
  const res = await fetch(`${BASE_URL}${pathname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function get(pathname) {
  const res = await fetch(`${BASE_URL}${pathname}`);
  const data = await res.json();
  return { status: res.status, data };
}

function onceWithTimeout(socket, eventName, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout esperando evento ${eventName}`));
    }, timeoutMs);

    socket.once(eventName, (payload) => {
      clearTimeout(timer);
      resolve(payload);
    });
  });
}

function startProcess() {
  return spawn('node', ['src/server.js'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

async function runValidation() {
  const serverProcess = startProcess();
  serverProcess.stdout.on('data', () => {});
  serverProcess.stderr.on('data', () => {});

  try {
    await waitForServer();

    console.log('VALIDACION 1/3: Flujo REST basico');
    const aliceLogin = await post('/api/auth/login', { username: 'alice' });
    const bobLogin = await post('/api/auth/login', { username: 'bob' });
    assert.equal(aliceLogin.status, 200);
    assert.equal(bobLogin.status, 200);

    const aliceId = aliceLogin.data.user.id;
    const bobId = bobLogin.data.user.id;

    const created = await post('/api/packages', {
      sender: 'Tienda Central',
      recipient: 'Carlos Perez',
      destinationAddress: 'Av. Universitaria 1234',
      userId: aliceId,
    });

    assert.equal(created.status, 201);
    const trackingCode = created.data.package.tracking_code;
    assert.ok(trackingCode.startsWith('TRK-'));

    console.log('VALIDACION 2/3: Tiempo real con Socket.IO');
    const aliceSocket = io(BASE_URL, { transports: ['websocket'] });
    const bobSocket = io(BASE_URL, { transports: ['websocket'] });

    await Promise.all([
      onceWithTimeout(aliceSocket, 'connect'),
      onceWithTimeout(bobSocket, 'connect'),
    ]);

    aliceSocket.emit('join_package', { trackingCode });
    bobSocket.emit('join_package', { trackingCode });
    await Promise.all([
      onceWithTimeout(aliceSocket, 'package:joined'),
      onceWithTimeout(bobSocket, 'package:joined'),
    ]);

    const msgPromise = onceWithTimeout(bobSocket, 'package:message');
    const locPromise = onceWithTimeout(bobSocket, 'package:location');

    const msgRes = await post(`/api/packages/${trackingCode}/messages`, {
      userId: aliceId,
      message: 'Paquete en camino al punto de entrega',
    });
    assert.equal(msgRes.status, 201);

    aliceSocket.emit('package_update_location', {
      trackingCode,
      userId: bobId,
      latitude: -12.0464,
      longitude: -77.0428,
      address: 'Centro de distribucion Lima',
      note: 'Salida del almacen',
    });

    const messageEvent = await msgPromise;
    const locationEvent = await locPromise;

    assert.equal(messageEvent.trackingCode, trackingCode);
    assert.equal(locationEvent.trackingCode, trackingCode);

    aliceSocket.disconnect();
    bobSocket.disconnect();

    console.log('VALIDACION 3/3: Persistencia y estado final');
    const received = await post(`/api/packages/${trackingCode}/receive`, { userId: bobId });
    assert.equal(received.status, 200);
    assert.equal(received.data.package.status, 'RECEIVED');

    const detail = await get(`/api/packages/${trackingCode}`);
    assert.equal(detail.status, 200);
    assert.equal(detail.data.package.status, 'RECEIVED');
    assert.ok(detail.data.package.messages.length >= 1);
    assert.ok(detail.data.package.locations.length >= 1);
    assert.ok(detail.data.package.timeline.length >= 3);

    console.log('OK: 3/3 validaciones completadas exitosamente.');
  } finally {
    serverProcess.kill('SIGTERM');
    await sleep(500);
  }
}

runValidation().catch((error) => {
  console.error('Fallo de validacion:', error.message);
  process.exit(1);
});
