"use client";

import { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function ChatForm({ receiverId }: { receiverId: string | undefined }) {
  const [text, setText] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!receiverId) {
      return;
    }

    if (!socketRef.current) {
      return;
    }

    socketRef.current.emit("sendMessage", {receiverId, text});

    setText("")
  }

  useEffect(() => {
    const socket = io("http://localhost:3000", { withCredentials: true });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  },[]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="border-2"
        value={text}
        type="text"
        placeholder="Message"
        onChange={(eve) => {
          setText(eve.target.value);
        }}
      />
      <button type="submit">Send</button>
    </form>
  );
}
