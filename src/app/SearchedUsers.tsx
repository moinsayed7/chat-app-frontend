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
          `http://localhost:3000/users?search=${searchText}`,
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

  return (
    <div>
      {users.map((ele) => (
        <Link  key={ele._id} href={`/conversations/${ele._id}`}>
        <div >{ele.username}</div></Link>
      ))}
    </div>
  );
}
