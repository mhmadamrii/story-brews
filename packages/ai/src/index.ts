import Groq from 'groq-sdk'
import 'dotenv'

console.log('GROQ_API_KEY', process.env.GROQ_API_KEY)

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true,
})

export async function main() {
  const chatCompletion = await getGroqChatCompletion()
  console.log(chatCompletion.choices[0]?.message?.content || '')
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'Explain the importance of fast language models',
      },
    ],
    model: 'mixtral-8x7b-32768',
  })
}

export function addition() {
  return 1 + 1
}
