import { Room, User, CursorPosition } from "../types";

const USER_COLORS = [
  "#f87171",
  "#4ade80",
  "#60a5fa",
  "#facc15",
  "#c084fc",
  "#fb923c",
  "#2dd4bf",
  "#f472b6",
  "#a3e635",
  "#38bdf8",
];

const ROOM_MAX_INACTIVE_MS = 2 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 30 * 60 * 1000;
const EMPTY_ROOM_TTL_MS = 10 * 60 * 1000;

class RoomManager {
  private rooms = new Map<string, Room>();
  private versions = new Map<string, number>();

  constructor() {
    this.startCleanup();
  }

  createOrGet(roomId: string): Room {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        code: "// Welcome! Start coding here...\n",
        language: "javascript",
        users: new Map(),
        createdAt: new Date(),
        lastActivity: new Date(),
      });
      this.versions.set(roomId, 0);
    }
    return this.rooms.get(roomId)!;
  }

  addUser(roomId: string, socketId: string, rawName: string): User {
    const room = this.createOrGet(roomId);
    const used = Array.from(room.users.values()).map((u) => u.color);
    const color =
      USER_COLORS.find((c) => !used.includes(c)) ??
      USER_COLORS[room.users.size % USER_COLORS.length];

    const user: User = {
      id: socketId,
      name: (rawName.trim() || "Anonymous").slice(0, 20),
      color,
      cursor: null,
    };

    room.users.set(socketId, user);
    room.lastActivity = new Date();
    return user;
  }

  removeUser(roomId: string, socketId: string): User | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    const user = room.users.get(socketId) ?? null;
    room.users.delete(socketId);
    room.lastActivity = new Date();

    if (room.users.size === 0) {
      setTimeout(() => {
        if (this.rooms.get(roomId)?.users.size === 0) {
          this.rooms.delete(roomId);
          this.versions.delete(roomId);
          console.log(`Empty room removed: ${roomId}`);
        }
      }, EMPTY_ROOM_TTL_MS);
    }
    return user;
  }

  updateCode(roomId: string, code: string): number {
    const room = this.rooms.get(roomId);
    if (!room) return 0;
    room.code = code;
    room.lastActivity = new Date();
    const v = (this.versions.get(roomId) ?? 0) + 1;
    this.versions.set(roomId, v);
    return v;
  }

  updateCursor(
    roomId: string,
    socketId: string,
    cursor: CursorPosition | null,
  ): void {
    const user = this.rooms.get(roomId)?.users.get(socketId);
    if (user) user.cursor = cursor;
  }

  updateLanguage(roomId: string, language: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.language = language;
    room.lastActivity = new Date();
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }
  getVersion(roomId: string) {
    return this.versions.get(roomId) ?? 0;
  }
  getUser(roomId: string, sid: string) {
    return this.rooms.get(roomId)?.users.get(sid);
  }
  exists(roomId: string) {
    return this.rooms.has(roomId);
  }

  stats() {
    let totalUsers = 0;
    this.rooms.forEach((r) => (totalUsers += r.users.size));
    return { totalRooms: this.rooms.size, totalUsers };
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      this.rooms.forEach((room, id) => {
        if (
          room.users.size === 0 &&
          now - room.lastActivity.getTime() > ROOM_MAX_INACTIVE_MS
        ) {
          this.rooms.delete(id);
          this.versions.delete(id);
          console.log(`Stale room cleaned: ${id}`);
        }
      });
    }, CLEANUP_INTERVAL_MS);
  }
}

export const roomManager = new RoomManager();
