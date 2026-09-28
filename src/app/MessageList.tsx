"use client";

import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

interface Message {
  _id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export function MessageList({
  initialMessages,
  currentUserId,
  socket,
}: {
  initialMessages: Message[];
  currentUserId: string;
  socket: Socket;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    function handleNewMessage(msg: Message) {
      setMessages((prev) => [...prev, msg]);
    }

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSent", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSent", handleNewMessage);
    };
  }, [socket]);

  return (
    <div className="space-y-3 py-2">
      {messages.map((ele) =>
        ele.senderId === currentUserId ? (
          <div key={ele._id} className="flex justify-end">
            <p className="bg-zinc-900 text-white max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl rounded-tr-xs text-sm leading-relaxed shadow-xs">
              {ele.text}
            </p>
          </div>
        ) : (
          <div key={ele._id} className="flex justify-start">
            <div className="bg-zinc-100 text-zinc-900 border border-zinc-200/80 max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl rounded-tl-xs text-sm leading-relaxed shadow-xs">
              {ele.text}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
