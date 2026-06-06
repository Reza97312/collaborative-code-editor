"use client";
import { User } from "@/types";

interface Props {
  users: User[];
  currentUserId?: string;
}

export default function UserList({ users, currentUserId }: Props) {
  return (
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
        Online — {users.length}
      </p>

      {users.length === 0 && (
        <p className="text-xs text-gray-600 italic">No users yet…</p>
      )}

      <ul className="flex flex-col gap-1.5">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: user.color }}
            />
            <span className="text-sm text-gray-300 truncate">
              {user.name}
              {user.id === currentUserId && (
                <span className="text-gray-500 text-xs ml-1">(you)</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
