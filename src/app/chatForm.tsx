"use client";

import { useState } from "react";
import { io, Socket } from "socket.io-client";

export function ChatForm({
  receiverId,
  socket,
}: {
  receiverId: string | undefined;
  socket: Socket;
}) {
  const [text, setText] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!receiverId) {
      return;
    }

    if (!socket) {
      return;
    }

    socket.emit("sendMessage", {
      receiverId,
      text: text.trim(),
    });

    setText("");
  }

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
