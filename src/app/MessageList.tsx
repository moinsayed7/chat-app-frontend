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
  socket: Socket ;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
  function handleNewMessage(msg: Message) {
    console.log("Received event, appending:", msg);

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
    <div>
      {messages.map((ele) =>
        ele.senderId === currentUserId ? (
          <div key={ele._id}>
            <p className="bg-green-300 w-fit px-4 py-2 rounded-2xl mt-2">
              {ele.text}
            </p>
          </div>
        ) : (
          <div
            key={ele._id}
            className="bg-gray-300 w-fit px-4 py-2 rounded-2xl mt-2"
          >
            {ele.text}
          </div>
        ),
      )}
    </div>
  );
}
