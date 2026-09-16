"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export function ChatForm({
  receiverId,
  socket,
}: {
  receiverId: string | undefined;
  socket: Socket;
}) {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    function handleError(err: string) {
      setError(err);
    }
    socket.on("messageError", handleError);

    return () => {
      socket.off("messageError", handleError);
    };
  }, [socket]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!receiverId) {
      return;
    }

    if (!socket) {
      return;
    }

    if (!text.trim()) {
      setError("Enter message")
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
      {error && <p>{error}</p>}
    </form>
  );
}
