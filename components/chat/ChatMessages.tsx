'use client'

import Image from 'next/image'
import { ChatCompletionRequestMessage } from 'openai'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

interface ChatMessagesProps {
  messages: ChatCompletionRequestMessage[]
  loading: boolean
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, loading }) => {
  return (
    <div className="space-y-5 pb-40">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(message.role === 'user' && 'flex justify-end')}
        >
          <div className="flex items-center">
            {message.role !== 'user' && (
              <div className="relative mr-2 h-10 w-10">
                <Image src="/robot.png" fill alt="robot" />
              </div>
            )}

            <div
              className={cn(
                'max-w-[500px] p-3 shadow',
                message.role === 'user'
                  ? 'rounded-t-lg rounded-bl-lg bg-zinc-100 py-4 text-black dark:bg-zinc-800 dark:text-white'
                  : 'rounded-t-lg rounded-br-lg bg-primary text-white dark:text-black'
              )}
            >
              <div className="text-sm">{message.content}</div>
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex items-center">
          <div className="relative mr-2 h-10 w-10">
            <Image src="/robot.png" fill alt="robot" />
          </div>
          <Skeleton className="h-[44px] w-[300px] rounded-t-lg rounded-br-lg bg-muted" />
        </div>
      )}
    </div>
  )
}

export default ChatMessages
