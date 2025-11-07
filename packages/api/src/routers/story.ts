import z from 'zod'

import { db, eq } from '@story-brew/db'
import { stories, storyBlocks, storyPart } from '@story-brew/db/schema/story'
import { protectedProcedure } from '..'
import { user } from '@story-brew/db/schema/auth'

export const storyRouter = {
  getAllMyStories: protectedProcedure.query(({ ctx }) => {
    return db.select().from(stories).where(eq(stories.userId, ctx.session.user.id))
  }),
  getPopularStories: protectedProcedure.query(() => {
    return db.select().from(stories)
  }),
  getAllStories: protectedProcedure.query(() => {
    return db
      .select()
      .from(stories)
      .innerJoin(user, eq(user.id, stories.userId))
      .innerJoin(storyPart, eq(storyPart.storyId, stories.id))
  }),
  getAllMyStoryBlocks: protectedProcedure.query(({ ctx }) => {
    return db.select().from(storyBlocks).where(eq(storyBlocks.userId, ctx.session.user.id))
  }),
  getStoryById: protectedProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return db.select().from(stories).where(eq(stories.id, input.id))
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
  deleteStory: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    return db.delete(stories).where(eq(stories.id, input.id)).returning({ id: stories.id })
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
  createWholeStore: protectedProcedure
    .input(
      z.object({ title: z.string(), synopsis: z.string(), content: z.string(), order: z.number() })
    )
    .mutation(async ({ input, ctx }) => {
      return await db.transaction(async (tx) => {
        const [story] = await tx
          .insert(stories)
          .values({
            synopsis: input.synopsis,
            userId: ctx.session.user.id,
            title: input.title,
          })
          .returning({ id: stories.id })

        await tx.insert(storyPart).values({
          storyId: story?.id,
          content: input.content,
          order: input.order,
        })

        return story
      })
    }),
}
