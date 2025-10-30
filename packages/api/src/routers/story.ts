import { db, eq } from '@story-brew/db'
import { stories, storyBlocks } from '@story-brew/db/schema/story'
import { protectedProcedure } from '..'
import z from 'zod'

export const storyRouter = {
  getAllMyStories: protectedProcedure.query(({ ctx }) => {
    return db.select().from(stories).where(eq(stories.userId, ctx.session.user.id))
  }),
  getAllMyStoryBlocks: protectedProcedure.query(({ ctx }) => {
    return db.select().from(storyBlocks).where(eq(storyBlocks.userId, ctx.session.user.id))
  }),
  deleteStoryBlock: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return db
        .delete(storyBlocks)
        .where(eq(storyBlocks.id, input.id))
        .returning({ id: storyBlocks.id })
    }),
  createStoryBlock: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        order: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { content, order } = input
      return db
        .insert(storyBlocks)
        .values({
          content,
          order,
          userId: ctx.session.user.id,
        })
        .returning()
    }),
}
