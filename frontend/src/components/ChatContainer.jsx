import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';


const ChatContainer = () => {
  const messagesEndRef = useRef(null);
  const {getMessages, messages, isMessageLoading, 
          selectedUser, subscribeToMessages, unsubscribeForMessages} = useChatStore();
  const {authUser} = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
      scrollToBottom();
  
    if (!selectedUser?._id) return;
      getMessages(selectedUser._id);
      subscribeToMessages();
      scrollToBottom();
    return () => {
      unsubscribeForMessages(); // Corrected spelling
    };
  }, [selectedUser?._id,]); 

  if(isMessageLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
    </div>
  
  )
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <div className='flex-1 flex flex-col overflow-auto'>
          {messages.map((message, key)=>(
            <div 
              key={key}
              className={`chat ${(message.senderId === authUser._id) ? "chat-end" : "chat-start"}`}
            >
                <div className='chat-image avatar'>
                    <div className='size-10 rounded-full border'>
                        <img 
                          src={message.senderId === authUser._id ? 
                            authUser.profilPic || '/avatar.jpg' : 
                            selectedUser.profilPic  || '/avatar.jpg' } alt="profilePic" />
                    </div>
                </div>

                <div className='chat-header mb-1'>
                    <time className='text-xs opacity-50 ml-1'>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </time>
                </div>
                <div className='chat-bubble flex flex-col'>
                      {message.image && 
                      (<img 
                      src={message.image} 
                      alt="Attachment"
                      className='sm:max-w-[200px] rounded-md' 
                      />)}
                      {message.text && <p>{message.text}</p>}
                </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer
