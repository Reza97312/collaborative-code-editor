export interface User {
  id: string;
  name: string;
  color: string;
  cursor: CursorPosition | null;
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

export interface CodeUpdatePayload {
  code: string;
  senderId: string;
  version: number;
}

export interface CursorUpdatePayload {
  userId: string;
  cursor: CursorPosition | null;
}

export interface LanguageUpdatePayload {
  language: string;
  senderId: string;
}

export type ConnectionStatus = "connected" | "connecting" | "disconnected";

export interface Language {
  id: string;
  label: string;
  defaultCode: string;
}
