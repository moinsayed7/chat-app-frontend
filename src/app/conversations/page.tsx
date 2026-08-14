import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export default async function Conversation() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }
  const response = await fetch("http://localhost:3000/conversations", {
    headers: {
      Cookie: `token=${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    redirect("/login");
  }

  const conversations = result.data;

  const convoUi = conversations.map((element:Conversation) => {});

  return <div>Conversation Page</div>;
}
