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
      setError("Enter message");
      return;
    }

    socket.emit("sendMessage", {
      receiverId,
      text: text.trim(),
    });

    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2">
        <input
          className="w-full px-4 py-2.5 text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-sm transition-all placeholder-zinc-400 shadow-xs"
          value={text}
          type="text"
          placeholder="Message"
          onChange={(eve) => {
            setText(eve.target.value);
          }}
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white font-medium rounded-xl text-sm transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          Send
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-2 font-medium">{error}</p>
      )}
    </form>
  );
}
