import Groq from 'groq-sdk'
import 'dotenv'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true,
})

const SYSTEM_PROMPT = `
You are a creative and descriptive storyteller. 
Your task is to write short, engaging stories based on the user's inputs.
Make sure each story has a clear beginning, middle, and end, with emotional depth and vivid imagery.
`

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

/**
 * Generate a story with AI
 * @returns
 * @example
 * await generateStoryWithAI()
 */
export async function generateStoryWithAI({
  category,
  customPrompt = 'cool',
  storyBlocks = [],
}: {
  category: string
  customPrompt?: string
  storyBlocks: string[]
}) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `
Write a short story in the "${category}" genre.
Use this theme or idea: "${customPrompt}".
If relevant, incorporate these story fragments or ideas: ${storyBlocks.join(', ')}.
Keep the story under 400 words.
`,
      },
    ],
    model: 'openai/gpt-oss-20b',
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    stream: false,
    reasoning_effort: 'medium',
    stop: null,
  })

  console.log('chat completion', chatCompletion)

  return chatCompletion.choices[0]?.message.content
}
