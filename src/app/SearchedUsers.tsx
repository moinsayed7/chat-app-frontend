"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  isOnline: boolean;
  createdAt: string;
}

export function SearchedUsers({ searchText }: { searchText: string }) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!searchText) {
      setUsers([]);
      return;
    }

    async function fetchUsers() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?search=${searchText}`,
          { credentials: "include" }
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          setUsers([]);
          return;
        }

        setUsers(result.data);
      } catch {
        setUsers([]);
      }
    }

    fetchUsers();
  }, [searchText]);

  return (<div className="space-y-2 mt-4">
  {users.map((ele) => (
    <Link key={ele._id} href={`/conversations/${ele._id}`}>
      <div className="group flex items-center justify-between p-3.5 bg-white hover:bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 rounded-xl transition-all duration-150 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-zinc-900 text-white font-medium flex items-center justify-center text-sm shrink-0">
            {ele.username ? ele.username.charAt(0).toUpperCase() : "?"}
          </div>
          <span className="font-semibold text-zinc-900 text-sm">{ele.username}</span>
        </div>
        <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-700 transition-colors pr-2">
          Chat →
        </span>
      </div>
    </Link>
  ))}
</div>);
}
