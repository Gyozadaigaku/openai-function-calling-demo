'use client'

import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { FormValues } from '@/components/chat/Chat'

type ChatFormProps = {
  form: UseFormReturn<FormValues>
  onSubmit: (data: FormValues) => Promise<void>
  loading: boolean
}

const ChatForm: React.FC<ChatFormProps> = ({ form, onSubmit, loading }) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex space-x-2 rounded-md border px-3 py-2"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl className="m-0 p-0">
                <Input
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-transparent"
                  placeholder="神奈川の天気を教えて"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="w-16"
          variant="ghost"
          type="submit"
          disabled={loading}
        >
          <PaperPlaneIcon className="h-5 w-5 text-primary" />
        </Button>
      </form>
    </Form>
  )
}

export default ChatForm
