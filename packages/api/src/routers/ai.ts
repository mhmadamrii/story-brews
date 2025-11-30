// import { generateNextPart as geminiGenerateNextPart } from '@story-brew/ai/gemini-story'
import { protectedProcedure, router } from '../'
import { stories, storyPart } from '@story-brew/db/schema/story'
import { db, eq, and, desc, sql } from '@story-brew/db'
import { z } from 'zod'

export const aiRouter = router({
  generateNextPart: protectedProcedure
    .input(
      z.object({
        storyId: z.string(),
        userInstruction: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [story] = await db.select().from(stories).where(eq(stories.id, input.storyId))

      if (!story) throw new Error('Story not found')
      if (story.userId !== ctx.session.user.id) throw new Error('Unauthorized')

      const parts = await db
        .select()
        .from(storyPart)
        .where(eq(storyPart.storyId, story.id))
        .orderBy(storyPart.order)

      const storyContext = parts.map((p) => p.content).join('\n\n')

      // const nextPartContent = await geminiGenerateNextPart({
      //   storyContext,
      //   userInstruction: input.userInstruction,
      //   lang: 'id',
      // })

      // const lastOrder = parts[parts.length - 1]?.order ?? 0

      // const [newPart] = await db
      //   .insert(storyPart)
      //   .values({
      //     content: 'hello',
      //     order: 5,
      //     likes: 0,
      //   })
      //   .returning()

      return 'hello'
    }),
})
