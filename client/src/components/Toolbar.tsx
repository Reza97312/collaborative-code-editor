"use client";
import { useState } from "react";
import { LANGUAGES } from "@/lib/constants";

interface Props {
  language: string;
  onLanguageChange: (lang: string) => void;
  roomId: string;
  userCount: number;
}

export default function Toolbar({
  language,
  onLanguageChange,
  roomId,
  userCount,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = Object.assign(document.createElement("input"), { value: url });
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
            <div
              key={c}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <span className="text-gray-400 text-sm font-mono hidden sm:block">
          Room&nbsp;
          <span className="text-gray-200">{roomId.slice(0, 8)}…</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-[#1e1e1e] text-gray-300 text-sm px-3 py-1.5 rounded
                     border border-gray-600 focus:outline-none focus:border-blue-500
                     cursor-pointer transition-colors"
        >
          {LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>

        <div
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e1e]
                        rounded border border-gray-700 text-gray-300 text-sm"
        >
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93
                     17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6
                     11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
            />
          </svg>
          {userCount}
        </div>

        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium
                     text-white transition-colors duration-150
                     bg-blue-600 hover:bg-blue-500"
        >
          {copied ? (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012
                         2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0
                         00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Share Link
            </>
          )}
        </button>
      </div>
    </header>
  );
}
