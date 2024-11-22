import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!socket?.connected || !selectedUser) {
      console.log('Waiting for socket connection or user selection...');
      return;
    }

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, socket?.connected, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin 
        scrollbar-thumb-base-300 scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full ring-1 ring-base-300 p-0.5">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilepic || "/avatar.png"
                      : selectedUser.profilepic || "/avatar.png"
                  }
                  alt="profile pic"
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <div className="chat-header mb-1 opacity-70 text-xs">
              {message.senderId === authUser._id ? "You" : selectedUser.fullName}
              <time className="ml-2">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble ${
              message.senderId === authUser._id 
                ? "chat-bubble-primary text-primary-content" 
                : "bg-base-200"
            }`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="max-w-[240px] rounded-lg mb-2 hover:opacity-90 transition-opacity cursor-pointer"
                />
              )}
              {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;