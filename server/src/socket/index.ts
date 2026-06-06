import { Server, Socket } from "socket.io";
import { roomManager } from "./roomManager";
import { socketRateLimiter } from "../middleware/rateLimiter";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  JoinRoomPayload,
  CodeChangePayload,
  CursorMovePayload,
  LanguageChangePayload,
} from "../types";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const VALID_LANGUAGES = new Set([
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "go",
  "rust",
  "html",
  "css",
  "json",
]);

export function setupSocketHandlers(io: AppServer): void {
  io.on("connection", (socket: AppSocket) => {
    console.log(`Connected  : ${socket.id}`);

    let currentRoom: string | null = null;

    socket.on(
      "join-room",
      ({ roomId, userName }: JoinRoomPayload, callback) => {
        try {
          if (!roomId || typeof roomId !== "string" || roomId.length > 50) {
            return callback({ success: false, error: "Invalid room ID" });
          }
          if (!userName || typeof userName !== "string") {
            return callback({ success: false, error: "Invalid username" });
          }

          if (currentRoom) leaveRoom(socket, io, currentRoom);

          currentRoom = roomId;
          socket.join(roomId);

          const user = roomManager.addUser(roomId, socket.id, userName);
          const room = roomManager.getRoom(roomId)!;
          const version = roomManager.getVersion(roomId);

          socket.emit("room-state", {
            roomId,
            code: room.code,
            language: room.language,
            users: Array.from(room.users.values()),
            version,
          });

          socket.to(roomId).emit("user-joined", user);
          callback({ success: true });
          console.log(` ${user.name} → room ${roomId}`);
        } catch (err) {
          console.error("join-room error:", err);
          callback({ success: false, error: "Server error" });
        }
      },
    );

    socket.on("code-change", ({ roomId, code, version }: CodeChangePayload) => {
      if (!currentRoom || currentRoom !== roomId) return;
      if (!socketRateLimiter(socket.id)) return;
      if (typeof code !== "string" || code.length > 100_000) return;

      const newVersion = roomManager.updateCode(roomId, code);
      socket.to(roomId).emit("code-updated", {
        code,
        senderId: socket.id,
        version: newVersion,
      });
    });

    socket.on("cursor-move", ({ roomId, cursor }: CursorMovePayload) => {
      if (!currentRoom || currentRoom !== roomId) return;
      if (!socketRateLimiter(socket.id)) return;

      roomManager.updateCursor(roomId, socket.id, cursor);
      socket.to(roomId).emit("cursor-updated", { userId: socket.id, cursor });
    });

    socket.on(
      "language-change",
      ({ roomId, language }: LanguageChangePayload) => {
        if (!currentRoom || currentRoom !== roomId) return;
        if (!VALID_LANGUAGES.has(language)) return;

        roomManager.updateLanguage(roomId, language);
        socket.to(roomId).emit("language-updated", {
          language,
          senderId: socket.id,
        });
      },
    );

    socket.on("leave-room", (roomId: string) => {
      leaveRoom(socket, io, roomId);
      currentRoom = null;
    });

    socket.on("disconnect", (reason) => {
      console.log(`Disconnected: ${socket.id} (${reason})`);
      if (currentRoom) leaveRoom(socket, io, currentRoom);
    });

    socket.on("error", (err) => {
      console.error(`Socket error [${socket.id}]:`, err);
    });
  });
}

function leaveRoom(socket: AppSocket, io: AppServer, roomId: string): void {
  const user = roomManager.removeUser(roomId, socket.id);
  socket.leave(roomId);
  if (user) {
    io.to(roomId).emit("user-left", { userId: socket.id, userName: user.name });
    console.log(`${user.name} left room ${roomId}`);
  }
}
