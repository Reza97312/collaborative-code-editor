"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "./useSocket";
import {
  User,
  RoomState,
  CursorPosition,
  CodeUpdatePayload,
  CursorUpdatePayload,
  LanguageUpdatePayload,
} from "@/types";

interface Props {
  roomId: string;
  userName: string;
}

export function useCollaboration({ roomId, userName }: Props) {
  const { socketId, connectionStatus, emit, on } = useSocket();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [users, setUsers] = useState<User[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localCodeRef = useRef("");
  const versionRef = useRef(0);

  useEffect(() => {
    if (connectionStatus !== "connected" || !roomId || !userName) return;
    emit("join-room", { roomId, userName }, (res: unknown) => {
      const r = res as { success: boolean; error?: string };
      if (!r.success) setError(r.error ?? "Failed to join room");
    });
  }, [connectionStatus, roomId, userName, emit]);

  useEffect(
    () =>
      on<RoomState>(
        "room-state",
        ({ code: c, language: l, users: u, version: v }) => {
          localCodeRef.current = c;
          versionRef.current = v;
          setCode(c);
          setLanguage(l);
          setUsers(u);
          setIsJoined(true);
          setError(null);
        },
      ),
    [on],
  );

  useEffect(
    () =>
      on<CodeUpdatePayload>("code-updated", ({ code: newCode, version }) => {
        if (version < versionRef.current) return;
        versionRef.current = version;
        localCodeRef.current = newCode;
        setCode(newCode);
      }),
    [on],
  );

  useEffect(
    () =>
      on<CursorUpdatePayload>("cursor-updated", ({ userId, cursor }) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, cursor } : u)),
        );
      }),
    [on],
  );

  useEffect(
    () =>
      on<User>("user-joined", (user) => {
        setUsers((prev) => [...prev.filter((u) => u.id !== user.id), user]);
      }),
    [on],
  );

  useEffect(
    () =>
      on<{ userId: string; userName: string }>("user-left", ({ userId }) => {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }),
    [on],
  );

  useEffect(
    () =>
      on<LanguageUpdatePayload>("language-updated", ({ language: lang }) => {
        setLanguage(lang);
      }),
    [on],
  );

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (newCode === localCodeRef.current) return;
      localCodeRef.current = newCode;
      setCode(newCode);
      emit("code-change", {
        roomId,
        code: newCode,
        version: versionRef.current,
      });
    },
    [roomId, emit],
  );

  const handleCursorMove = useCallback(
    (cursor: CursorPosition) => {
      emit("cursor-move", { roomId, cursor });
    },
    [roomId, emit],
  );

  const handleLanguageChange = useCallback(
    (lang: string) => {
      setLanguage(lang);
      emit("language-change", { roomId, language: lang });
    },
    [roomId, emit],
  );

  return {
    code,
    language,
    users,
    connectionStatus,
    isJoined,
    error,
    handleCodeChange,
    handleCursorMove,
    handleLanguageChange,
    socketId,
  };
}
