import { GoogleGenAI } from '@google/genai'
import { keys } from './keys'

// Lazy initialization to prevent client-side crash
let ai: GoogleGenAI | null = null

const getAiClient = () => {
  if (!ai) {
    const { GEMINI_API_KEY } = keys()
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    })
  }
  return ai
}

export async function gemini(systemPrompt: string) {
  try {
    const client = getAiClient()
    const result = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    })
    return result
  } catch (error: any) {
    console.error('Gemini API error:', error)
    throw new Error(error?.message || 'Failed to communicate with Gemini API')
  }
}
