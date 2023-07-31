import { NextResponse } from 'next/server'
import axios from 'axios'
import moment from 'moment-timezone'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const WORLD_TIME_URL = 'http://worldtimeapi.org/api/timezone'

const getTime = async (location: string, name: string) => {
  try {
    const response = await axios.get(`${WORLD_TIME_URL}/${location}`)
    const { datetime } = response.data
    const dateTime = moment.tz(datetime, location).format('A HH:mm')

    return `${name}の時刻は${dateTime}です。`
  } catch (error) {
    return `${name}の時刻は分かりませんでした。`
  }
}

const functions = [
  {
    name: 'getTime',
    description: 'Get the current time for a specific location.',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description:
            'The specified location, for instance, Tokyo, Los Angeles, should be represented in the form of a timezone name such as Asia/Tokyo.',
        },
        name: {
          type: 'string',
          description:
            'The location referred to in the prompt could be, for example, Tokyo, Los Angeles.',
        },
      },
      required: ['location', 'name'],
    },
  },
]

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages,
      functions,
      function_call: 'auto',
    })

    const responseMessage = response.data.choices[0].message

    if (!responseMessage) {
      return new NextResponse('Message Error', { status: 500 })
    }

    if (responseMessage.content) {
      return NextResponse.json(responseMessage)
    } else {
      if (!responseMessage.function_call) {
        return new NextResponse('Function Call Error', { status: 500 })
      }

      if (!responseMessage.function_call.arguments) {
        return new NextResponse('Function Call Arguments Error', {
          status: 500,
        })
      }

      const functionCallName = responseMessage.function_call.name

      const functionCallNameArguments = JSON.parse(
        responseMessage.function_call.arguments
      )

      let content = ''

      if (functionCallName === 'getTime') {
        content = await getTime(
          functionCallNameArguments.location,
          functionCallNameArguments.name
        )
      } else {
        return new NextResponse('Function Call Name Error', { status: 500 })
      }

      const message = {
        role: 'assistant',
        content,
      }

      return NextResponse.json(message)
    }
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
