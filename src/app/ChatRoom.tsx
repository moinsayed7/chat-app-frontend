// 'use client';

// import { useEffect, useRef } from "react";
// import { io, Socket } from "socket.io-client";
// import { MessageList } from "./MessageList";
// import { ChatForm } from "./chatForm";

// interface Message {
//   _id: string;
//   roomId: string;
//   senderId: string;
//   text: string;
//   createdAt: string;
// }

// export function ChatRoom({messages, receiverId, currentUserId}:{messages:Message[], receiverId:string, currentUserId:string}){
//     const socketRef=useRef<Socket|null>(null);

//     useEffect(()=>{
//         const socket=io('http://localhost:3000', {withCredentials:true});
//         socketRef.current=socket;

//         return ()=>{
//             socket.disconnect();
//         }
//     },[])

//     return (
//         <>
//         <MessageList initialMessages={messages} currentUserId={currentUserId} socketRef={socketRef}/>
//         <ChatForm receiverId={receiverId} socketRef={socketRef}/>
//         </>
//     )

// }






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
    const newSocket = io("http://localhost:3000", {
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







