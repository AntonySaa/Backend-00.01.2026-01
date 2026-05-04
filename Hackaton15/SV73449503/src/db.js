const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = path.join(__dirname, '..', 'data', 'courier.db');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

let db;

function connect() {
  if (db) return db;

  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  db = new sqlite3.Database(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');
  return db;
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    connect().run(sql, params, function onRun(err) {
      if (err) return reject(err);
      return resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    connect().get(sql, params, (err, row) => {
      if (err) return reject(err);
      return resolve(row || null);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    connect().all(sql, params, (err, rows) => {
      if (err) return reject(err);
      return resolve(rows);
    });
  });
}

function exec(sql) {
  return new Promise((resolve, reject) => {
    connect().exec(sql, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

async function initDatabase() {
  const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
  await exec(schema);
}

module.exports = {
  initDatabase,
  run,
  get,
  all,
};
