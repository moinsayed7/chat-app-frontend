import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ChatForm } from "@/app/chatForm";

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

    response2 = await fetch(`http://localhost:3000/conversation/${conversationId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    result2 = await response2.json();
  } catch {
    redirect("/login");
  }

  if (!response.ok) {
    redirect("/login");
  }

  const data: Message[] = result.data;
  const convo:Conversation=result2.data;
  
  const decode = jwtDecode<{ id: string }>(token);
  const currentUserId = decode.id;
  const receiver=convo.participants.find((ele)=>{return ele._id!==currentUserId});
  const receiverId=receiver?._id

  if(!receiverId){
    redirect("/login");
  }


  const msgUi = data.map((ele) => {
    if (ele.senderId === currentUserId) {

      return (
        <div key={ele._id}>
          <p className="bg-green-300 w-fit px-4 py-2 rounded-2xl mt-2">
            {ele.text}
          </p>
        </div>
      );
    } else {
      return (
        <div
          key={ele._id}
          className="bg-gray-300 w-fit px-4 py-2 rounded-2xl mt-2"
        >
          {ele.text}
        </div>
      );
    }
  });

  return (
    <div>
      <div>{msgUi}</div>
      <div>
        <ChatForm receiverId={receiverId}/>
      </div>
    </div>
  );
}
