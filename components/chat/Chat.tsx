'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { ChatCompletionRequestMessage } from 'openai'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { useToast } from '@/components/ui/use-toast'
import ChatForm from '@/components/chat/ChatForm'
import ChatMessages from '@/components/chat/ChatMessages'

const FormSchema = z.object({
  prompt: z.string().min(1, {
    message: '何か入力してね。',
  }),
})

export type FormValues = z.infer<typeof FormSchema>

// Type for dummy chat message list
/*
type ChatRole = 'user' | 'assistant'
type ChatMessage = {
  role: ChatRole
  content: string
}
type ChatMessageList = ChatMessage[]
*/

const Chat = () => {
  // Data for dummy chat message list
  /*
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
  */
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    defaultValues: {
      prompt: '',
    },
    resolver: zodResolver(FormSchema),
  })

  const loading = form.formState.isSubmitting

  const onSubmit = async (data: FormValues) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: data.prompt,
      }

      const newMessages = [...messages, userMessage]
      setMessages(newMessages)

      const response = await axios.post('/api/chat', {
        messages: newMessages,
      })

      if (response.status === 200) {
        setMessages((current) => [...current, response.data])
        form.reset()
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: 'Please try again.',
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Something went wrong.',
        description: 'Please try again.',
      })
    } finally {
      router.refresh()
    }
  }

  return (
    <>
      <ChatMessages messages={messages} loading={loading} />
      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-screen-md px-5 pb-16">
        <ChatForm form={form} onSubmit={onSubmit} loading={loading} />
      </div>
    </>
  )
}

export default Chat
