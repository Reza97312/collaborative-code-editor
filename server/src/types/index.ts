export interface User {
  id: string;
  name: string;
  color: string;
  cursor: CursorPosition | null;
}

export interface Room {
  id: string;
  code: string;
  language: string;
  users: Map<string, User>;
  createdAt: Date;
  lastActivity: Date;
}

export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface RoomState {
  roomId: string;
  code: string;
  language: string;
  users: User[];
  version: number;
}

export interface JoinRoomPayload {
  roomId: string;
  userName: string;
}

export interface JoinRoomResponse {
  success: boolean;
  error?: string;
}

export interface CodeChangePayload {
  roomId: string;
  code: string;
  version: number;
}

export interface CursorMovePayload {
  roomId: string;
  cursor: CursorPosition;
}

export interface LanguageChangePayload {
  roomId: string;
  language: string;
}

export interface ServerToClientEvents {
  "room-state": (data: RoomState) => void;
  "code-updated": (data: {
    code: string;
    senderId: string;
    version: number;
  }) => void;
  "cursor-updated": (data: {
    userId: string;
    cursor: CursorPosition | null;
  }) => void;
  "user-joined": (user: User) => void;
  "user-left": (data: { userId: string; userName: string }) => void;
  "language-updated": (data: { language: string; senderId: string }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  "join-room": (
    payload: JoinRoomPayload,
    callback: (response: JoinRoomResponse) => void,
  ) => void;
  "code-change": (payload: CodeChangePayload) => void;
  "cursor-move": (payload: CursorMovePayload) => void;
  "language-change": (payload: LanguageChangePayload) => void;
  "leave-room": (roomId: string) => void;
}
