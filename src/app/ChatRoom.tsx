'use client';

import { useEffect, useRef } from "react";
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

export function ChatRoom({messages, receiverId, currentUserId}:{messages:Message[], receiverId:string, currentUserId:string}){
    const socketRef=useRef<Socket|null>(null);

    useEffect(()=>{
        const socket=io('http://localhost:3000', {withCredentials:true});
        socketRef.current=socket;

        return ()=>{
            socket.disconnect();
        }
    },[])

    return (
        <>
        <MessageList messages={messages} currentUserId={currentUserId} socketRef={socketRef.current}/>
        <ChatForm receiverId={receiverId} socketRef={socketRef.current}/>
        </>
    )

}








