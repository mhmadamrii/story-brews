import Groq from 'groq-sdk'
import { keys } from './keys'

const { GROQ_API_KEY } = keys()

if (!GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set')
}

export const groq = new Groq({
  apiKey: GROQ_API_KEY,
})

type GenerateStoryParams = {
  category: string
  customPrompt: string
  storyBlocks: string[]
  lang: 'en' | 'id'
  previousContent: string
}

export async function generateStoryWithAI({
  category,
  customPrompt,
  storyBlocks,
  lang,
  previousContent,
}: GenerateStoryParams) {
  const systemPrompt = `You are a professional story writer.
Your client wants to write a story with the following constraints:
- Category: ${category}
- Language: ${lang}
- Story Blocks (Keywords): ${storyBlocks.join(', ')}
${customPrompt ? `- Additional client instructions: ${customPrompt}` : ''}

${previousContent ? `The story so far:\n${previousContent}` : ''}

Continue the story based on these constraints. Provide only the next part of the story.`

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: 'Please continue the story.',
      },
    ],
    model: 'llama3-8b-8192',
  })

  return response.choices[0]?.message?.content
}

export async function generateSynopsisWithAI(story: string, lang: 'en' | 'id') {
  const systemPrompt = `You are a professional story editor.
Your client has written a story and wants a synopsis.
The story is in ${lang}.
The story:\n${story}\n\nPlease provide a concise synopsis of the story in ${lang}.`

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: 'Please provide the synopsis.',
      },
    ],
    model: 'llama3-8b-8192',
  })

  return response.choices[0]?.message?.content
}
