"use client";

import { useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  isOnline: boolean;
  createdAt: string;
}

export function SearchBar({
  sendSearchText,
}: {
  sendSearchText: (searchText: string) => void;
}) {
  const [search, setSearch] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    sendSearchText(search.trim());
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search">Find </label>
        <input
          value={search}
          type="text"
          id="search"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </form>
      <button type="submit">Search</button>
    </div>
  );
}
