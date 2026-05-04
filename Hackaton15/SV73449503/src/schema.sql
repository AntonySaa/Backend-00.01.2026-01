PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracking_code TEXT NOT NULL UNIQUE,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'IN_TRANSIT', 'RECEIVED')),
  created_by INTEGER NOT NULL,
  last_updated_by INTEGER,
  received_at TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (last_updated_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS package_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (package_id) REFERENCES packages(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS package_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (package_id) REFERENCES packages(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS package_status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id INTEGER NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by INTEGER,
  changed_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (package_id) REFERENCES packages(id),
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_packages_tracking_code ON packages(tracking_code);
CREATE INDEX IF NOT EXISTS idx_messages_package_id ON package_messages(package_id);
CREATE INDEX IF NOT EXISTS idx_locations_package_id ON package_locations(package_id);
CREATE INDEX IF NOT EXISTS idx_status_history_package_id ON package_status_history(package_id);

CREATE TRIGGER IF NOT EXISTS trg_packages_status_history
AFTER UPDATE OF status ON packages
FOR EACH ROW
WHEN OLD.status <> NEW.status
BEGIN
  INSERT INTO package_status_history (package_id, old_status, new_status, changed_by)
  VALUES (NEW.id, OLD.status, NEW.status, NEW.last_updated_by);
END;

CREATE VIEW IF NOT EXISTS v_package_timeline AS
SELECT
  p.tracking_code AS tracking_code,
  'MESSAGE' AS event_type,
  m.created_at AS event_time,
  u.username AS actor,
  m.message AS detail
FROM package_messages m
JOIN packages p ON p.id = m.package_id
JOIN users u ON u.id = m.user_id
UNION ALL
SELECT
  p.tracking_code AS tracking_code,
  'LOCATION' AS event_type,
  l.created_at AS event_time,
  u.username AS actor,
  printf('lat=%.6f, lng=%.6f, address=%s, note=%s', l.latitude, l.longitude, IFNULL(l.address, ''), IFNULL(l.note, '')) AS detail
FROM package_locations l
JOIN packages p ON p.id = l.package_id
JOIN users u ON u.id = l.user_id
UNION ALL
SELECT
  p.tracking_code AS tracking_code,
  'STATUS' AS event_type,
  h.changed_at AS event_time,
  IFNULL(u.username, 'system') AS actor,
  printf('%s -> %s', IFNULL(h.old_status, 'NONE'), h.new_status) AS detail
FROM package_status_history h
JOIN packages p ON p.id = h.package_id
LEFT JOIN users u ON u.id = h.changed_by;
