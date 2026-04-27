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

const onlineUsers = new Map<string, string>(); // userId -> socketId

export const io = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
>(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN || "*" },
});

io.on(
  "connection",
  (
    socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>,
  ) => {
    console.log(`New socket connected: ${socket.id}`);

    socket.on("setUser", async (user: string) => {
      socket.data.userId = user;
      onlineUsers.set(user, socket.id);

      // Update user online status
      await User.findByIdAndUpdate(user, { isOnline: true });
      console.log(`${user} connected (socket: ${socket.id})`);

      // Notify all clients that this user joined
      io.emit("userJoined", user);
    });

    // En socket.ts - Modifica la función sendMessage
    socket.on("sendMessage", async (to: string, text: string) => {
      const from = socket.data.userId;

      if (!from) {
        // console.error("No userId found in socket.data");
        return;
      }

      // console.log(`Sending message from ${from} to ${to}: ${text}`);

      if (!to || !text) {
        // console.error("Missing to or text in message");
        return;
      }

      // Crear mensaje con estructura completa
      const chatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        from: from,
        to: to,
        text: text,
        timestamp: Date.now(),
      };

      // Guardar en base de datos
      try {
        await Message.create({
          from: from,
          to: to,
          text: text,
          timestamp: new Date(),
        });
        // console.log(`Message saved successfully`);
      } catch (error) {
        // console.error("Error saving message:", error);
        return;
      }

      // 🔧 ENVIAR AL REMITENTE (para que vea su propio mensaje)
      socket.emit("message", chatMessage);

      // Enviar al destinatario si está online
      const toSocketId = onlineUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit("message", chatMessage);
        // console.log(`Message delivered to ${to}`);
      } else {
        // console.log(`User ${to} is offline`);
      }
    });
    socket.on("disconnect", async () => {
      const userId = socket.data.userId;
      if (!userId) return;

      onlineUsers.delete(userId);

      // Update user offline status
      await User.findByIdAndUpdate(userId, { isOnline: false });
      console.log(`${userId} disconnected!`);

      // Notify all clients that this user left
      io.emit("userLeft", userId);
    });
  },
);
