"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  email: string;
  isOnline: boolean;
  createdAt: string;
}

interface Message {
  _id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: User[];
  lastMessageId: Message;
  lastMessageAt: string;
}

export default function Conversations() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    async function fetchConversations() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.log("token is there but line 46");
        console.log(response.status);
        router.push("/login");
        return;
      }

      const result = await response.json();

      const data = result.data;
      const userId = result.currentUserId;
      setConversations(data);
      setCurrentUserId(userId);
    }

    fetchConversations();
  }, []);

  // render logic here
  const convoUi = conversations.map((ele) => {
    const text = ele.lastMessageId.text;
    const otherId = ele.participants.find((ele) => ele._id !== currentUserId);
    const otherUsername = otherId?.username;

    return (
      <Link key={ele._id} href={`/conversations/${otherId?._id}`}>
        <div className="border">
          <p className="font-bold">{otherUsername}</p>
          <p>{text}</p>
        </div>
      </Link>
    );
  });

  return (
    <div>
      <div>{convoUi}</div>
    </div>
  );
}
