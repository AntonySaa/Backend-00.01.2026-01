const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '../chat.db'));
    this.init();
  }

  init() {
    this.db.run(CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'user',
        timestamp TEXT NOT NULL
      ));
  }

  saveMessage(username, message, type = 'user') {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO messages (username, message, type, timestamp) VALUES (?, ?, ?, ?)',
        [username, message, type, new Date().toISOString()],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  getAllMessages() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM messages ORDER BY id ASC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  deleteMessage(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM messages WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  deleteAllMessages() {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM messages', function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  updateMessage(id, newMessage) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE messages SET message = ? WHERE id = ?',
        [newMessage, id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }
}

module.exports = { Database };
