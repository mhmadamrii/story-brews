import { generateImage } from './gemini'

export async function generateImageWithGemini(prompt: string) {
  return await generateImage(prompt)
}
