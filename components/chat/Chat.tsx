'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import ChatMessages from '@/components/chat/ChatMessages'

const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: '2文字以上入力する必要があります。',
  }),
})

export type FormValues = z.infer<typeof FormSchema>

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

type ChatMessageList = ChatMessage[]

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessageList>([
    {
      role: 'user',
      content: 'やあ。',
    },
    {
      role: 'assistant',
      content: 'やあ。何か手伝おうか？',
    },
    {
      role: 'user',
      content: 'Hello.',
    },
    {
      role: 'assistant',
      content: 'Hello！May I help you?',
    },
  ])

  const form = useForm<FormValues>({
    defaultValues: {
      prompt: '',
    },
    resolver: zodResolver(FormSchema),
  })

  const loading = form.formState.isSubmitting

  return (
    <>
      <ChatMessages messages={messages} loading={loading} />
    </>
  )
}

export default Chat
