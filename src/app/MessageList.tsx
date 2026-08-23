'use client';

import { Socket } from "socket.io-client";

interface Message {
  _id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export function MessageList({messages,currentUserId, socketRef}:{messages:Message[], currentUserId:string, socketRef:Socket|null}){

    
    return(
        <>
        </>
    )
}






