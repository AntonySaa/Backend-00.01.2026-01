const { run, get, all } = require('./db');

function makeTrackingCode() {
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TRK-${Date.now()}-${random}`;
}

async function ensureUser(username) {
  if (!username || !username.trim()) {
    throw new Error('El username es obligatorio.');
  }

  const clean = username.trim().toLowerCase();
  await run('INSERT OR IGNORE INTO users (username) VALUES (?)', [clean]);
  const user = await get('SELECT id, username, created_at FROM users WHERE username = ?', [clean]);
  return user;
}

async function getPackageByTracking(trackingCode) {
  return get('SELECT * FROM packages WHERE tracking_code = ?', [trackingCode]);
}

async function createPackage({ sender, recipient, destinationAddress, userId }) {
  if (!sender || !recipient || !destinationAddress || !userId) {
    throw new Error('sender, recipient, destinationAddress y userId son obligatorios.');
  }

  const trackingCode = makeTrackingCode();
  await run(
    `INSERT INTO packages (
      tracking_code, sender, recipient, destination_address, status, created_by, last_updated_by
    ) VALUES (?, ?, ?, ?, 'CREATED', ?, ?)`,
    [trackingCode, sender, recipient, destinationAddress, userId, userId]
  );

  return getPackageDetails(trackingCode);
}

async function addMessage({ trackingCode, userId, message }) {
  if (!message || !message.trim()) {
    throw new Error('El mensaje es obligatorio.');
  }

  const pkg = await getPackageByTracking(trackingCode);
  if (!pkg) throw new Error('Paquete no encontrado.');

  await run(
    'INSERT INTO package_messages (package_id, user_id, message) VALUES (?, ?, ?)',
    [pkg.id, userId, message.trim()]
  );

  const created = await get(
    `SELECT m.id, m.message, m.created_at, u.id AS user_id, u.username
     FROM package_messages m
     JOIN users u ON u.id = m.user_id
     WHERE m.package_id = ?
     ORDER BY m.id DESC
     LIMIT 1`,
    [pkg.id]
  );

  return { trackingCode, ...created };
}

async function addLocation({ trackingCode, userId, latitude, longitude, address, note }) {
  const pkg = await getPackageByTracking(trackingCode);
  if (!pkg) throw new Error('Paquete no encontrado.');

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('latitude y longitude deben ser numéricos.');
  }

  await run(
    `INSERT INTO package_locations (package_id, user_id, latitude, longitude, address, note)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [pkg.id, userId, latitude, longitude, address || null, note || null]
  );

  if (pkg.status === 'CREATED') {
    await run(
      `UPDATE packages
       SET status = 'IN_TRANSIT', last_updated_by = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [userId, pkg.id]
    );
  }

  const created = await get(
    `SELECT l.id, l.latitude, l.longitude, l.address, l.note, l.created_at, u.id AS user_id, u.username
     FROM package_locations l
     JOIN users u ON u.id = l.user_id
     WHERE l.package_id = ?
     ORDER BY l.id DESC
     LIMIT 1`,
    [pkg.id]
  );

  return { trackingCode, ...created };
}

async function markReceived({ trackingCode, userId }) {
  const pkg = await getPackageByTracking(trackingCode);
  if (!pkg) throw new Error('Paquete no encontrado.');

  await run(
    `UPDATE packages
     SET status = 'RECEIVED', received_at = CURRENT_TIMESTAMP, last_updated_by = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [userId, pkg.id]
  );

  return getPackageDetails(trackingCode);
}

async function getPackageDetails(trackingCode) {
  const pkg = await get(
    `SELECT
      p.id,
      p.tracking_code,
      p.sender,
      p.recipient,
      p.destination_address,
      p.status,
      p.received_at,
      p.created_at,
      p.updated_at,
      u.username AS created_by
     FROM packages p
     JOIN users u ON u.id = p.created_by
     WHERE p.tracking_code = ?`,
    [trackingCode]
  );

  if (!pkg) return null;

  const messages = await all(
    `SELECT m.id, m.message, m.created_at, u.id AS user_id, u.username
     FROM package_messages m
     JOIN users u ON u.id = m.user_id
     WHERE m.package_id = ?
     ORDER BY m.id ASC`,
    [pkg.id]
  );

  const locations = await all(
    `SELECT l.id, l.latitude, l.longitude, l.address, l.note, l.created_at, u.id AS user_id, u.username
     FROM package_locations l
     JOIN users u ON u.id = l.user_id
     WHERE l.package_id = ?
     ORDER BY l.id ASC`,
    [pkg.id]
  );

  const timeline = await all(
    `SELECT event_type, event_time, actor, detail
     FROM v_package_timeline
     WHERE tracking_code = ?
     ORDER BY event_time ASC`,
    [trackingCode]
  );

  return {
    ...pkg,
    messages,
    locations,
    timeline,
  };
}

module.exports = {
  ensureUser,
  createPackage,
  addMessage,
  addLocation,
  markReceived,
  getPackageDetails,
};
