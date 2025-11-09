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

async function generate(systemPrompt: string, userPrompt: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
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

  return chatCompletion.choices[0]?.message.content
}

export async function main() {
  const chatCompletion = await getGroqChatCompletion()
  // eslint-disable-next-line no-console
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
  lang = 'en',
  previousContent = '',
}: {
  category: string
  customPrompt?: string
  storyBlocks: string[]
  lang: 'en' | 'id'
  previousContent: string
}) {
  const userPrompt = `
Write a short story in the "${category}" genre, in ${lang === 'en' ? 'English' : 'Indonesian'}.
Use this theme or idea: "${customPrompt}".
If relevant, incorporate these story fragments or ideas: ${storyBlocks.join(', ')}.
${previousContent ? `Continue from this previous content: "${previousContent}"` : ''}
Keep the story under 400 words.
`
  return generate(SYSTEM_PROMPT, userPrompt)
}

/**
 * Generate a synopsis for a story with AI
 * @param storyContent The content of the story
 * @returns A synopsis of the story
 */
export async function generateSynopsisWithAI(storyContent: string, lang: string) {
  const systemPrompt = 'You are a helpful assistant that summarizes stories.'
  const userPrompt = `
Generate a concise synopsis for the following story. The synopsis should be under 100 words.

language: ${lang}
Story:
${storyContent}
`
  return generate(systemPrompt, userPrompt)
}
