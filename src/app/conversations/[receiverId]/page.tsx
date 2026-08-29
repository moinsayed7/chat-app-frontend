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

interface Receiver {
  convoExist: boolean;
  data: Conversation|null;
}

export default async function Messages({
  params,
}: {
  params: Promise<{ receiverId: string }>;
}) {
  const { receiverId } = await params;

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
    return;
  }

  let response;
  let result;

  let receiverIdResponse;
  let receiverIdResult: Receiver;
  let data: Message[];

  try {
    receiverIdResponse = await fetch(
      `http://localhost:3000/conversation/with/${receiverId}`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    );

    receiverIdResult = await receiverIdResponse.json();
  } catch {
    redirect("/login");
    return;
  }

  if (receiverIdResult.convoExist) {
    try {
      const conversationId: string|undefined = receiverIdResult?.data?._id;
      response = await fetch(
        `http://localhost:3000/message/${conversationId}`,
        {
          headers: {
            Cookie: `token=${token}`,
          },
        },
      );

      result = await response.json();

      data = result.data;

      if (!response?.ok) {
        redirect("/login");
        return;
      }
    } catch {
      redirect("/conversations");
      return
    }
  } else {
    data = [];
  }

  const decode = jwtDecode<{ id: string }>(token);
  const currentUserId = decode.id;


  return (
    <ChatRoom
      receiverId={receiverId}
      currentUserId={currentUserId}
      messages={data}
    />
  );
}
