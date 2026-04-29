const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'chat.db');
const db = new sqlite3.Database(dbPath);

console.log('🗄️ Conectando a base de datos SQLite...');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.log(' Error al crear tabla:', err.message);
    } else {
      console.log(' Tabla "messages" lista');
    }
  });
});

const getAllMessages = (callback) => {
  db.all('SELECT * FROM messages ORDER BY createdAt ASC', callback);
};

const insertMessage = (text, author, callback) => {
  db.run(
    'INSERT INTO messages (text, author) VALUES (?, ?)',
    [text, author],
    function(err) {
      callback(err, this?.lastID);
    }
  );
};

const updateMessage = (id, newText, callback) => {
  db.run('UPDATE messages SET text = ? WHERE id = ?', [newText, id], callback);
};

const deleteMessage = (id, callback) => {
  db.run('DELETE FROM messages WHERE id = ?', [id], callback);
};

const deleteAllMessages = (callback) => {
  db.run('DELETE FROM messages', callback);
};

module.exports = {
  getAllMessages,
  insertMessage,
  updateMessage,
  deleteMessage,
  deleteAllMessages
};