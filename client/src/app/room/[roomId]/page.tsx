"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useCollaboration } from "@/hooks/useCollaboration";
import Editor from "@/components/Editor";
import Toolbar from "@/components/Toolbar";
import UserList from "@/components/UserList";
import ConnectionStatus from "@/components/ConnectionStatus";
import { MAX_USERNAME_LENGTH } from "@/lib/constants";

function LoadingScreen({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#070710] gap-4">
      <div className="w-8 h-8 border-[3px] border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}

function ErrorScreen({
  message,
  onBack,
}: {
  message: string;
  onBack: () => void;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#070710] gap-5">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667
               1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732
               16.5C2.963 17.833 3.925 19 5.465 19z"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-red-400 text-base mb-2">{message}</p>
        <p className="text-gray-700 text-sm">
          Something went wrong joining the room
        </p>
      </div>
      <button
        onClick={onBack}
        className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600
                   hover:from-indigo-400 hover:to-purple-500 text-white font-semibold
                   rounded-xl text-sm transition-all duration-200 hover:-translate-y-px"
      >
        ← Go Back
      </button>
    </div>
  );
}

function NameModal({ onConfirm }: { onConfirm: (name: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!value.trim()) {
      setError("Please enter your name");
      return;
    }
    onConfirm(value.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-sm bg-gradient-to-br from-[#12121b] to-[#0f0f18]
                   border border-white/10 rounded-2xl p-7
                   shadow-[0_32px_64px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)]
                   animate-fade-up"
      >
        <div className="flex justify-center mb-5">
          <div
            className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-indigo-500 to-purple-600
                          flex items-center justify-center
                          shadow-[0_0_28px_rgba(99,102,241,0.4)]"
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-lg font-bold text-[#e4e4ef] mb-1">
          Join Room
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your name to start collaborating
        </p>

        <div className="relative mb-4">
          <input
            type="text"
            value={value}
            maxLength={MAX_USERNAME_LENGTH}
            placeholder="e.g. Alex"
            autoFocus
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                       px-4 py-3 text-sm text-[#e4e4ef] placeholder-gray-700
                       outline-none focus:border-indigo-500/60 focus:ring-2
                       focus:ring-indigo-500/10 transition-all duration-150"
          />
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-red-400 text-sm mb-3">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2
                   0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1
                   1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        <button
          onClick={submit}
          className="w-full flex items-center justify-center gap-2
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     hover:from-indigo-400 hover:to-purple-500
                     text-white font-semibold py-3 rounded-xl text-sm
                     transition-all duration-200
                     hover:shadow-[0_6px_24px_rgba(99,102,241,0.45)]
                     hover:-translate-y-px active:translate-y-0"
        >
          Join Room →
        </button>
      </div>
    </div>
  );
}

function RoomInner() {
  const { roomId } = useParams<{ roomId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const nameFromUrl = searchParams.get("name");
  const [confirmedName, setConfirmedName] = useState<string | null>(
    nameFromUrl,
  );

  useEffect(() => {
    if (!roomId) router.push("/");
  }, [roomId, router]);

  const {
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
  } = useCollaboration({
    roomId: roomId ?? "",
    userName: confirmedName ?? "",
  });

  if (error)
    return <ErrorScreen message={error} onBack={() => router.push("/")} />;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a12] overflow-hidden">
      {!confirmedName && (
        <NameModal onConfirm={(name) => setConfirmedName(name)} />
      )}

      <Toolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        roomId={roomId ?? ""}
        userCount={users.length}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
          {!isJoined && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a12]">
              <div className="w-9 h-9 border-[3px] border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3" />
              <p className="text-gray-600 text-sm">Joining room…</p>
            </div>
          )}
          <Editor
            code={code}
            language={language}
            users={users}
            currentUserId={socketId}
            onChange={handleCodeChange}
            onCursorChange={handleCursorMove}
          />
        </div>

        <aside
          className="w-48 flex-shrink-0 bg-[#0b0b14] border-l border-white/[0.07]
                          flex flex-col p-3.5 gap-4 overflow-y-auto"
        >
          <ConnectionStatus status={connectionStatus} />
          <div className="h-px bg-white/[0.06]" />
          <UserList users={users} currentUserId={socketId} />
        </aside>
      </div>
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={<LoadingScreen text="Loading room…" />}>
      <RoomInner />
    </Suspense>
  );
}
