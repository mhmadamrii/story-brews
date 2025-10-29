import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROP_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function main() {
  const chatCompletion = await getGroqChatCompletion()
  // Print the completion returned by the LLM.
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
    model: 'openai/gpt-oss-20b',
  })
}

export function addition() {
  return 1 + 1
}
