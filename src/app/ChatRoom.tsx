"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { MessageList } from "./MessageList";
import { ChatForm } from "./chatForm";

interface Message {
  _id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export function ChatRoom({
  messages,
  receiverId,
  currentUserId,
}: {
  messages: Message[];
  receiverId: string;
  currentUserId: string;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] max-w-4xl mx-auto bg-white border border-zinc-200 rounded-2xl shadow-xs overflow-hidden">
      {socket && (
        <div className="flex flex-col h-full min-h-0">
          <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6">
            <MessageList
              initialMessages={messages}
              currentUserId={currentUserId}
              socket={socket}
            />
          </div>

          <div className="border-t border-zinc-200 bg-white p-4 shrink-0">
            <ChatForm receiverId={receiverId} socket={socket} />
          </div>
        </div>
      )}
    </div>
  );
}
