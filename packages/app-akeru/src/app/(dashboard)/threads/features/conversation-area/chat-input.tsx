import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import React from 'react'

const ChatInput = () => {
  return (
    <Input placeholder={'Enter your message'} endIcon={Send}/>
  )
}

export default ChatInput