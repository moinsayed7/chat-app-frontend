import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
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

export default async function Conversations() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("!token");
    redirect("/login");
    return;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/conversations`, {
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (!response.ok) {
    console.log("token is there but line 46");
    console.log(response.status);
    redirect("/login");
  }

  const decode = jwtDecode<{ id: string }>(token);
  const currentUserId = decode.id;
  const result = await response.json();
  const conversations: Conversation[] = result.data;

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
