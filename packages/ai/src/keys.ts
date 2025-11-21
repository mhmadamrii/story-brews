import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const keys = () =>
  createEnv({
    server: {
      OPENAI_API_KEY: z.string().startsWith('sk-').optional(),
      GEMINI_API_KEY: z.string().optional(),
      GROQ_API_KEY: z.string().startsWith('gsk_').optional(),
    },
    runtimeEnv: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
    },
  })
