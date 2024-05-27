import React from 'react'
import ChatInput from './chat-input'
import ChatDisplay from './chat-display'

const ConversationArea = () => {
  return (
    <div className="flex-grow h-full flex flex-col gap-4">
      <ChatDisplay/>
      <ChatInput/>
    </div>
  )
}

export default ConversationArea