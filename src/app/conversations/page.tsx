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
      <div className="group relative bg-white hover:bg-zinc-50/80 border border-zinc-200/80 hover:border-zinc-300 rounded-xl p-4 sm:p-5 transition-all duration-150 shadow-xs hover:shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="h-12 w-12 rounded-full bg-zinc-900 text-white font-semibold flex items-center justify-center shrink-0 text-base shadow-xs">
              {otherUsername ? otherUsername.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="font-semibold text-zinc-900 text-base truncate">{otherUsername}</p>
              <p className="text-zinc-500 text-sm truncate">{text}</p>
            </div>
          </div>
          <div className="shrink-0 text-zinc-400 group-hover:text-zinc-600 transition-colors pr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
});

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
      <div className="mb-8 border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Conversations</h1>
        <p className="text-sm text-zinc-500 mt-1">Select a conversation to start messaging</p>
      </div>
      <div className="grid gap-3">{convoUi}</div>
    </div>
  );
}
