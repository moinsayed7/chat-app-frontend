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

  return (<div className="w-full">
  <form onSubmit={handleSubmit} className="flex items-center gap-3">
    <label htmlFor="search" className="text-sm font-medium text-zinc-700 shrink-0">
      Find
    </label>
    <div className="relative flex-1">
      <input
        value={search}
        type="text"
        id="search"
        placeholder="Type to search..."
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="w-full px-4 py-2.5 text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-sm transition-all placeholder-zinc-400 shadow-xs"
      />
    </div>
    <button
      type="submit"
      className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white font-medium rounded-xl text-sm transition-colors shadow-xs shrink-0 cursor-pointer"
    >
      Search
    </button>
  </form>
</div>);
}
