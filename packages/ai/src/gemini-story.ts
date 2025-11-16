import { gemini } from './gemini'

type GenerateStoryParams = {
  category: string
  customPrompt: string
  storyBlocks: string[]
  lang: 'en' | 'id'
  previousContent: string
}

export async function generateStoryWithGemini({
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

  const result = await gemini(systemPrompt)
  const response = result.text
  console.log('response', response)

  return response
}

export async function generateSynopsisWithGemini(story: string, lang: 'en' | 'id') {
  const systemPrompt = `You are a professional story editor.
Your client has written a story and wants a synopsis.
The story is in ${lang}.
The story:\n${story}\n\nPlease provide a concise synopsis of the story in ${lang}.`

  const result = await gemini(systemPrompt)
  const response = result.text

  return response
}
