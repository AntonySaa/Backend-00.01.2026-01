
require('dotenv').config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
const initSqlJs = require("sql.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const DB_PATH = path.join(__dirname, "db", "chat.db");
let db;
let clientCount = 0;

// ─── Initialize DB ────────────────────────────────────────────────────────────
async function initDB() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT,
      edited INTEGER DEFAULT 0
    )
  `);
  saveDB();
}

function saveDB() {
  const data = db.export();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// ─── DB helpers ───────────────────────────────────────────────────────────────
function getMessages() {
  const stmt = db.prepare("SELECT * FROM messages ORDER BY id ASC");
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function insertMessage(username, content) {
  const now = new Date().toISOString();
  db.run("INSERT INTO messages (username, content, created_at) VALUES (?, ?, ?)", [username, content, now]);
  saveDB();
  const res = db.exec("SELECT * FROM messages ORDER BY id DESC LIMIT 1");
  if (!res || !res[0]) return [null, username, content, now, 0];
  return res[0].values[0];
}

function editMessage(id, content) {
  db.run("UPDATE messages SET content = ?, edited = 1 WHERE id = ?", [content, id]);
  saveDB();
}

function deleteMessage(id) {
  db.run("DELETE FROM messages WHERE id = ?", [id]);
  saveDB();
}

function clearHistory() {
  db.run("DELETE FROM messages");
  saveDB();
}

// ─── llama3.2 Bot ────────────────────────────────────────────────────────────
async function askBot(userMessage, username = "usuario") {
  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        stream: false,
        messages: [
          { role: "system", content: `Eres NexBot, asistente amigable. Responde en español, máximo 3 oraciones. El usuario se llama ${username}, menciónalo en tu respuesta cuando sea natural.` },
          { role: "user", content: userMessage }
        ]
      })
    });
    const data = await response.json();
    return data.message?.content || "Sin respuesta.";
  } catch (e) {
    console.error("Bot error:", e);
    return "Error al conectar con el bot. 🔌";
  }
}

// ─── Socket.io ────────────────────────────────────────────────────────────────
io.on("connection", async (socket) => {
  clientCount++;
  console.clear();
  console.log(`🚀 Servidor corriendo en http://localhost:3000`);
  console.log(`👥 Clientes conectados: ${clientCount}`);

  // Send history on connect
  socket.emit("history", getMessages());
  // New message
  socket.on("send_message", async ({ username, content }) => {
    if (!username || !content?.trim()) return;

    // Save user message
    const row = insertMessage(username, content.trim());
    const [id, user, text, created_at, edited] = row;
    io.emit("new_message", { id, username: user, content: text, created_at, edited });

    // Bot trigger: @bot or /bot
    if (/^(@bot|\/bot)\s+/i.test(content.trim())) {
      const question = content.trim().replace(/^(@bot|\/bot)\s+/i, "");
      const botReply = await askBot(question, username);
      const botRow = insertMessage("🤖 NexBot", botReply);
      const [bid, buser, bcontent, bca, bedited] = botRow;
      io.emit("new_message", { id: bid, username: buser, content: bcontent, created_at: bca, edited: bedited, isBot: true });
    }
  });
  // Edit message
  socket.on("edit_message", ({ id, content, username }) => {
    editMessage(id, content);
    io.emit("message_edited", { id, content, username });
  });
  // Delete message
  socket.on("delete_message", ({ id }) => {
    deleteMessage(id);
    io.emit("message_deleted", { id });
  });
  // Clear all
  socket.on("clear_history", () => {
    clearHistory();
    io.emit("history_cleared");
  });

  socket.on("disconnect", () => {
    clientCount--;
    console.clear();
    console.log(`🚀 Servidor corriendo en http://localhost:3000`);
    console.log(`👥 Clientes conectados: ${clientCount}`);
  });
});

// ─── Start ─────────────────────────────────────────────────────────────────────
initDB().then(() => {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`👥 Clientes conectados: 0`);
  });
});
