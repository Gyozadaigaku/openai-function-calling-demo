import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages,
    })

    const responseMessage = response.data.choices[0].message

    if (!responseMessage) {
      return new NextResponse('Message Error', { status: 500 })
    }

    if (responseMessage.content) {
      return NextResponse.json(responseMessage)
    }
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
