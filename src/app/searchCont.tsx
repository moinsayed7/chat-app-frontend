"use client";

import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SearchedUsers } from "./SearchedUsers";

interface User {
  _id: string;
  username: string;
  email: string;
  isOnline: boolean;
  createdAt: string;
}

export default function SearchCont() {
  const [text, setText] = useState<string>("");

  function getSearchText(searchText: string) {
    setText(searchText);
  }

  return (
    <div>
      <SearchBar sendSearchText={getSearchText} />
      <SearchedUsers searchText={text} />
    </div>
  );
}
