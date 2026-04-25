const db = require('./database');

class MessageRepository {
  constructor(database) {
    this.db = database;

    this.selectAllStmt = this.db.prepare(`
      SELECT id, author, text, is_bot AS isBot, created_at AS createdAt, updated_at AS updatedAt
      FROM messages
      ORDER BY id ASC
    `);

    this.insertStmt = this.db.prepare(`
      INSERT INTO messages (author, text, is_bot, created_at, updated_at)
      VALUES (@author, @text, @isBot, @createdAt, @updatedAt)
    `);

    this.selectByIdStmt = this.db.prepare(`
      SELECT id, author, text, is_bot AS isBot, created_at AS createdAt, updated_at AS updatedAt
      FROM messages
      WHERE id = ?
    `);

    this.updateStmt = this.db.prepare(`
      UPDATE messages
      SET text = @text,
          updated_at = @updatedAt
      WHERE id = @id
    `);

    this.deleteStmt = this.db.prepare('DELETE FROM messages WHERE id = ?');
    this.clearStmt = this.db.prepare('DELETE FROM messages');
  }

  getAll() {
    return this.selectAllStmt.all();
  }

  create({ author, text, isBot = 0 }) {
    const now = new Date().toISOString();

    const result = this.insertStmt.run({
      author,
      text,
      isBot,
      createdAt: now,
      updatedAt: now,
    });

    return this.selectByIdStmt.get(result.lastInsertRowid);
  }

  updateText(id, newText) {
    const updatedAt = new Date().toISOString();
    const result = this.updateStmt.run({
      id,
      text: newText,
      updatedAt,
    });

    if (result.changes === 0) {
      return null;
    }

    return this.selectByIdStmt.get(id);
  }

  deleteById(id) {
    const result = this.deleteStmt.run(id);
    return result.changes > 0;
  }

  clearAll() {
    this.clearStmt.run();
  }
}

module.exports = new MessageRepository(db);
