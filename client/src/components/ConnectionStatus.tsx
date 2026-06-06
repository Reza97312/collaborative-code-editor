"use client";
import { ConnectionStatus as T } from "@/types";

const CONFIG = {
  connected: { dot: "bg-green-500", text: "Connected", pulse: false },
  connecting: { dot: "bg-yellow-500", text: "Connecting…", pulse: true },
  disconnected: { dot: "bg-red-500", text: "Disconnected", pulse: false },
} as const;

export default function ConnectionStatus({ status }: { status: T }) {
  const { dot, text, pulse } = CONFIG[status];
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-3 h-3">
        <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        {pulse && (
          <div
            className={`absolute w-2.5 h-2.5 rounded-full ${dot} animate-ping opacity-75`}
          />
        )}
      </div>
      <span className="text-xs text-gray-400 font-medium">{text}</span>
    </div>
  );
}
