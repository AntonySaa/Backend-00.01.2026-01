import { Server as SocketIOServer, Socket } from "socket.io";
import { httpServer } from "./app.ts";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  ChatMessage,
} from "./interface/ISocket.ts";
import User from "./models/User.ts";
import Message from "./models/Message.ts";
import { askBot } from "./service/ai.service.ts";

const onlineUsers = new Map<string, string>(); // userId -> socketId
const BOT_ID = "bot";

export const io = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
>(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN || "*" },
});

// Helper: detectar comandos en el texto
function parseCommand(text: string): { command: string; args: string } | null {
  if (!text.startsWith("/")) return null;
  const [cmd, ...rest] = text.trim().split(" ");
  return { command: cmd.toLowerCase(), args: rest.join(" ") };
}

io.on(
  "connection",
  (
    socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>,
  ) => {
    console.log(`New socket connected: ${socket.id}`);

    socket.on("setUser", async (user: string) => {
      socket.data.userId = user;
      onlineUsers.set(user, socket.id);
      await User.findByIdAndUpdate(user, { isOnline: true });
      console.log(`${user} connected (socket: ${socket.id})`);
      io.emit("userJoined", user);
    });

    socket.on("sendMessage", async (to: string, text: string) => {
      const from = socket.data.userId;
      if (!from || !to || !text) return;

      // --- Detección de comandos ---
      const parsed = parseCommand(text);

      if (parsed?.command === "/clear") {
        // Borrar historial con el destinatario actual
        await Message.deleteMany({
          $or: [
            { from, to },
            { from: to, to: from },
          ],
        } as any);
        socket.emit("historyCleared", to);
        const toSocketId = onlineUsers.get(to);
        if (toSocketId) io.to(toSocketId).emit("historyCleared", from);
        return;
      }

      if (parsed?.command === "/bot") {
        // Consultar al bot con el texto después del comando
        const question = parsed.args || text;
        const botReply = await askBot(question);

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          from: BOT_ID,
          to: from,
          text: botReply,
          timestamp: Date.now(),
        };
        socket.emit("botMessage", botMsg);
        return;
      }

      // --- Mensaje normal ---
      const saved = await Message.create({ from, to, text, timestamp: new Date() });

      const chatMessage: ChatMessage = {
        id: (saved._id as any).toString(),
        from,
        to,
        text,
        timestamp: Date.now(),
      };

      // Enviar al remitente y al destinatario
      socket.emit("message", chatMessage);
      const toSocketId = onlineUsers.get(to);
      if (toSocketId) io.to(toSocketId).emit("message", chatMessage);

      // Si el destinatario es "bot", responder automáticamente
      if (to === BOT_ID) {
        const botReply = await askBot(text);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          from: BOT_ID,
          to: from,
          text: botReply,
          timestamp: Date.now(),
        };
        socket.emit("botMessage", botMsg);
      }
    });

    socket.on("deleteMessage", async (msgId: string) => {
      const from = socket.data.userId;
      if (!from) return;

      const msg = await Message.findById(msgId);
      if (!msg || msg.from !== from) return;

      const recipientId = msg.to;
      await Message.findByIdAndDelete(msgId);

      socket.emit("messageDeleted", msgId);
      const toSocketId = onlineUsers.get(recipientId);
      if (toSocketId) io.to(toSocketId).emit("messageDeleted", msgId);
    });

    socket.on("editMessage", async (msgId: string, newText: string) => {
      const from = socket.data.userId;
      if (!from || !newText) return;

      const msg = await Message.findById(msgId);
      if (!msg || msg.from !== from) return;

      msg.text = newText;
      msg.edited = true;
      await msg.save();

      const recipientId = msg.to;
      const payload = { id: msgId, text: newText };

      socket.emit("messageEdited", payload);
      const toSocketId = onlineUsers.get(recipientId);
      if (toSocketId) io.to(toSocketId).emit("messageEdited", payload);
    });

    socket.on("clearHistory", async (withUserId: string) => {
      const from = socket.data.userId;
      if (!from) return;

      await Message.deleteMany({
        $or: [
          { from, to: withUserId },
          { from: withUserId, to: from },
        ],
      } as any);

      socket.emit("historyCleared", withUserId);
      const toSocketId = onlineUsers.get(withUserId);
      if (toSocketId) io.to(toSocketId).emit("historyCleared", from);
    });

    socket.on("disconnect", async () => {
      const userId = socket.data.userId;
      if (!userId) return;
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false });
      console.log(`${userId} disconnected!`);
      io.emit("userLeft", userId);
    });
  },
);
