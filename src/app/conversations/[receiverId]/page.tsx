"use client";
import { useRouter, useParams } from "next/navigation";
import { ChatRoom } from "@/app/ChatRoom";
import { useEffect, useState } from "react";

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

interface Receiver {
  convoExist: boolean;
  data: Conversation | null;
  currentUserId: string;
}

export default function Messages() {
  const router = useRouter();
  const { receiverId } = useParams<{ receiverId: string }>();

  const [message, setMessage] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    async function fetchConversation() {
      let response;
      let result;

      let receiverIdResponse;
      let receiverIdResult: Receiver;

      try {
        receiverIdResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/conversation/with/${receiverId}`,
          {
            credentials: "include",
          },
        );

        receiverIdResult = await receiverIdResponse.json();
      } catch {
        router.push("/login");
        return;
      }
      if (!receiverIdResponse.ok) {
        router.push("/login");
        return;
      }

      setCurrentUserId(receiverIdResult.currentUserId);

      if (receiverIdResult.convoExist) {
        try {
          const conversationId: string | undefined =
            receiverIdResult?.data?._id;
          response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/message/${conversationId}`,
            {
              credentials: "include",
            },
          );

          result = await response.json();
          if (!response?.ok) {
            router.push("/login");
            return;
          }

          setMessage(result.data);
        } catch {
          router.push("/conversations");
          return;
        }
      } else {
        setMessage([]);
      }
    }
    fetchConversation();
  }, [receiverId, router]);

  return (
    <ChatRoom
      receiverId={receiverId}
      currentUserId={currentUserId}
      messages={message}
    />
  );
}
