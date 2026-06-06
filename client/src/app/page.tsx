"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { MAX_USERNAME_LENGTH } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    if (!userName.trim()) {
      setError("Please enter your name");
      return false;
    }
    return true;
  };

  const createRoom = () => {
    if (!validate()) return;
    setLoading(true);
    router.push(
      `/room/${uuidv4()}?name=${encodeURIComponent(userName.trim())}`,
    );
  };

  const joinRoom = () => {
    if (!validate()) return;
    if (!roomId.trim()) {
      setError("Please enter a Room ID");
      return;
    }
    setLoading(true);
    router.push(
      `/room/${roomId.trim()}?name=${encodeURIComponent(userName.trim())}`,
    );
  };

  return (
    <main className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center gap-2 mb-5">
            {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
              <div
                key={c}
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            CodeSync
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Real-time collaborative code editor
          </p>
        </div>

        <div className="bg-[#2d2d2d] rounded-xl border border-gray-700 p-6 shadow-2xl">
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              maxLength={MAX_USERNAME_LENGTH}
              placeholder="e.g. Alex"
              onChange={(e) => {
                setUserName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && createRoom()}
              className="w-full bg-[#1e1e1e] border border-gray-600 rounded-lg px-4 py-2.5
                         text-white placeholder-gray-600 text-sm
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                         transition-colors"
            />
          </div>

          <button
            onClick={createRoom}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                       text-white font-medium py-2.5 px-4 rounded-lg text-sm
                       transition-colors duration-150 mb-4"
          >
            {loading ? "Loading…" : "+ Create New Room"}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-xs">or join existing</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={roomId}
              placeholder="Paste Room ID…"
              onChange={(e) => {
                setRoomId(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              className="flex-1 bg-[#1e1e1e] border border-gray-600 rounded-lg px-4 py-2.5
                         text-white placeholder-gray-600 text-sm
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                         transition-colors"
            />
            <button
              onClick={joinRoom}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg text-sm
                         transition-colors whitespace-nowrap"
            >
              Join →
            </button>
          </div>

          {error && (
            <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-5">
          No sign-up required · Share the link to collaborate
        </p>
      </div>
    </main>
  );
}
