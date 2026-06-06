"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";
import { ConnectionStatus } from "@/types";

export function useSocket() {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  const [socketId, setSocketId] = useState<string | undefined>();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => {
      setStatus("connected");
      setSocketId(socket.id);
    };
    const onDisconnect = () => {
      setStatus("disconnected");
      setSocketId(undefined);
    };
    const onConnectError = () => setStatus("disconnected");
    const onReconnecting = () => setStatus("connecting");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("reconnecting", onReconnecting);

    if (!socket.connected) {
      socket.connect();
    } else {
      Promise.resolve().then(() => {
        setStatus("connected");
        setSocketId(socket.id);
      });
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("reconnecting", onReconnecting);
    };
  }, []);

  const emit = useCallback(
    <T>(event: string, data?: T, callback?: (res: unknown) => void) => {
      const s = socketRef.current;
      if (!s?.connected) return;
      callback ? s.emit(event, data, callback) : s.emit(event, data);
    },
    [],
  );

  const on = useCallback(
    <T>(event: string, handler: (data: T) => void): (() => void) => {
      socketRef.current?.on(event, handler);
      return () => socketRef.current?.off(event, handler);
    },
    [],
  );

  return { socketId, connectionStatus: status, emit, on };
}
