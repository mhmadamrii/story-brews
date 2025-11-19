import z from 'zod'

import { db, eq, and, desc, sql } from '@story-brew/db'
import { bookmark, stories, storyBlocks, storyLikes, storyPart } from '@story-brew/db/schema/story'
import { protectedProcedure } from '..'
import { user } from '@story-brew/db/schema/auth'

export const storyRouter = {
  getAllMyStories: protectedProcedure.query(({ ctx }) => {
    return db.select().from(stories).where(eq(stories.userId, ctx.session.user.id))
  }),
  getPopularStories: protectedProcedure.query(() => {
    return db.select().from(stories)
  }),
  getAllStories: protectedProcedure.query(({ ctx }) => {
    return db
      .select({
        stories: stories,
        user: user,
        bookmark: bookmark,
        isLiked: storyLikes.id,
      })
      .from(stories)
      .innerJoin(user, eq(user.id, stories.userId))
      .leftJoin(
        bookmark,
        and(eq(bookmark.storyId, stories.id), eq(bookmark.userId, ctx.session.user.id))
      )
      .leftJoin(
        storyLikes,
        and(eq(storyLikes.storyId, stories.id), eq(storyLikes.userId, ctx.session.user.id))
      )
      .orderBy(desc(stories.createdAt))
  }),
  getAllMyStoryBlocks: protectedProcedure.query(({ ctx }) => {
    return db.select().from(storyBlocks).where(eq(storyBlocks.userId, ctx.session.user.id))
  }),
  getStoryById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const result = await db
      .select({
        story: stories,
        user: user,
        part: storyPart,
      })
      .from(stories)
      .innerJoin(user, eq(user.id, stories.userId))
      .leftJoin(storyPart, eq(storyPart.storyId, stories.id))
      .leftJoin(
        storyLikes,
        and(eq(storyLikes.storyId, stories.id), eq(storyLikes.userId, ctx.session.user.id))
      )
      .where(eq(stories.id, input.id))

    if (result.length === 0) {
      return null
    }

    const story = {
      ...result[0]?.story,
      user: result[0]?.user,
      // isLiked: !!result[0]?.isLiked,
      parts: result
        .filter((row) => row.part !== null)
        .map((row) => row.part)
        .sort((a, b) => a!.order - b!.order),
    }

    return story
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
  deleteAllStoryBlocks: protectedProcedure.mutation(({ ctx }) => {
    return db.delete(storyBlocks).where(eq(storyBlocks.userId, ctx.session.user.id))
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
  createWholeStory: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        synopsis: z.string(),
        contentParts: z.array(
          z.object({
            id: z.string(),
            content: z.string(),
            order: z.number(),
          })
        ),
      })
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

        if (!story) {
          tx.rollback()
          return
        }

        await tx.insert(storyPart).values(
          input.contentParts.map((part) => ({
            storyId: story.id,
            content: part.content,
            order: part.order,
          }))
        )

        return story
      })
    }),
  toggleLike: protectedProcedure
    .input(z.object({ storyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingLike = await db
        .select()
        .from(storyLikes)
        .where(
          and(eq(storyLikes.storyId, input.storyId), eq(storyLikes.userId, ctx.session.user.id))
        )

      if (existingLike.length > 0) {
        await db.transaction(async (tx) => {
          await tx.delete(storyLikes).where(eq(storyLikes.id, existingLike[0]!.id))
          await tx
            .update(stories)
            .set({ likes: sql`${stories.likes} - 1` })
            .where(eq(stories.id, input.storyId))
        })
        return { liked: false }
      } else {
        await db.transaction(async (tx) => {
          await tx
            .insert(storyLikes)
            .values({ userId: ctx.session.user.id, storyId: input.storyId })
          await tx
            .update(stories)
            .set({ likes: sql`${stories.likes} + 1` })
            .where(eq(stories.id, input.storyId))
        })
        return { liked: true }
      }
    }),
}
