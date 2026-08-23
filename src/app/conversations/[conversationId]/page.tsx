import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ChatRoom } from "@/app/ChatRoom";

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

export default async function Messages({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  let response;
  let result;

  let response2;
  let result2;

  if (!token) {
    redirect("/login");
  }

  try {
    response = await fetch(`http://localhost:3000/message/${conversationId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    result = await response.json();

    response2 = await fetch(
      `http://localhost:3000/conversation/${conversationId}`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    );

    result2 = await response2.json();
  } catch {
    redirect("/login");
  }

  if (!response.ok) {
    redirect("/login");
  }

  const data: Message[] = result.data;
  const convo: Conversation = result2.data;

  const decode = jwtDecode<{ id: string }>(token);
  const currentUserId = decode.id;
  const receiverId = convo.participants.find((ele) => {
    return ele._id !== currentUserId;
  })?._id

  if (!receiverId) {
    redirect("/login");
  }


  return <ChatRoom receiverId={receiverId} currentUserId={currentUserId} messages={data} />;
}
