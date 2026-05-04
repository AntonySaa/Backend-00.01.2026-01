const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const { initDatabase } = require('./db');
const {
  ensureUser,
  createPackage,
  addMessage,
  addLocation,
  markReceived,
  getPackageDetails,
} = require('./courierService');

function buildApp(io) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'courier-online' });
  });

  app.post('/api/auth/login', async (req, res, next) => {
    try {
      const user = await ensureUser(req.body.username);
      res.status(200).json({ ok: true, user });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/packages', async (req, res, next) => {
    try {
      const data = await createPackage(req.body);
      io.to(`package:${data.tracking_code}`).emit('package:created', data);
      res.status(201).json({ ok: true, package: data });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/packages/:trackingCode', async (req, res, next) => {
    try {
      const data = await getPackageDetails(req.params.trackingCode);
      if (!data) {
        return res.status(404).json({ ok: false, error: 'Paquete no encontrado.' });
      }
      return res.status(200).json({ ok: true, package: data });
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/packages/:trackingCode/messages', async (req, res, next) => {
    try {
      const payload = {
        trackingCode: req.params.trackingCode,
        userId: req.body.userId,
        message: req.body.message,
      };
      const data = await addMessage(payload);
      io.to(`package:${payload.trackingCode}`).emit('package:message', data);
      res.status(201).json({ ok: true, message: data });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/packages/:trackingCode/location', async (req, res, next) => {
    try {
      const payload = {
        trackingCode: req.params.trackingCode,
        userId: req.body.userId,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        note: req.body.note,
      };
      const data = await addLocation(payload);
      io.to(`package:${payload.trackingCode}`).emit('package:location', data);
      res.status(201).json({ ok: true, location: data });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/packages/:trackingCode/receive', async (req, res, next) => {
    try {
      const payload = {
        trackingCode: req.params.trackingCode,
        userId: req.body.userId,
      };
      const data = await markReceived(payload);
      io.to(`package:${payload.trackingCode}`).emit('package:received', data);
      res.status(200).json({ ok: true, package: data });
    } catch (error) {
      next(error);
    }
  });

  app.use((err, _req, res, _next) => {
    const status = err.message.includes('no encontrado') ? 404 : 400;
    res.status(status).json({ ok: false, error: err.message });
  });

  return app;
}

async function startServer({ port = 3000, host = '127.0.0.1' } = {}) {
  await initDatabase();

  const server = http.createServer();
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const app = buildApp(io);
  server.on('request', app);

  io.on('connection', (socket) => {
    socket.on('join_package', ({ trackingCode }) => {
      if (!trackingCode) return;
      socket.join(`package:${trackingCode}`);
      socket.emit('package:joined', { trackingCode });
    });

    socket.on('package_send_message', async (payload, callback) => {
      try {
        const data = await addMessage(payload);
        io.to(`package:${payload.trackingCode}`).emit('package:message', data);
        if (callback) callback({ ok: true, message: data });
      } catch (error) {
        if (callback) callback({ ok: false, error: error.message });
      }
    });

    socket.on('package_update_location', async (payload, callback) => {
      try {
        const data = await addLocation(payload);
        io.to(`package:${payload.trackingCode}`).emit('package:location', data);
        if (callback) callback({ ok: true, location: data });
      } catch (error) {
        if (callback) callback({ ok: false, error: error.message });
      }
    });

    socket.on('package_mark_received', async (payload, callback) => {
      try {
        const data = await markReceived(payload);
        io.to(`package:${payload.trackingCode}`).emit('package:received', data);
        if (callback) callback({ ok: true, package: data });
      } catch (error) {
        if (callback) callback({ ok: false, error: error.message });
      }
    });
  });

  await new Promise((resolve) => {
    server.listen(port, host, resolve);
  });

  return { server, io };
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  startServer({ port, host })
    .then(() => {
      console.log(`Courier API + Socket.IO ejecutándose en http://${host}:${port}`);
    })
    .catch((error) => {
      console.error('No se pudo iniciar el servidor:', error);
      process.exit(1);
    });
}

module.exports = { startServer };
