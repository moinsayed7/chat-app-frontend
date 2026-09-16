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
      console.log("Socket connected:", newSocket.id);
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
    <>
      {socket && (
        <>
          <MessageList
            initialMessages={messages}
            currentUserId={currentUserId}
            socket={socket}
          />

          <ChatForm
            receiverId={receiverId}
            socket={socket}
          />
        </>
      )}
    </>
  );
}



