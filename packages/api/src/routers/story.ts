import z from 'zod'

import { db, eq, and, desc, sql } from '@story-brew/db'
import { bookmark, stories, storyBlocks, storyLikes, storyPart } from '@story-brew/db/schema/story'
import { protectedProcedure } from '..'
import { user } from '@story-brew/db/schema/auth'
import { generateNextPart as geminiGenerateNextPart } from '@story-brew/ai/gemini-story'

export const storyRouter = {
  getAllMyStories: protectedProcedure.query(({ ctx }) => {
    return db
      .select({
        id: stories.id,
        userId: stories.userId,
        title: stories.title,
        likes: stories.likes,
        synopsis: stories.synopsis,
        image: stories.image,
        impression: stories.impression,
        createdAt: stories.createdAt,
        updatedAt: stories.updatedAt,
        partsCount: sql<number>`count(${storyPart.id})`.mapWith(Number),
      })
      .from(stories)
      .leftJoin(storyPart, eq(storyPart.storyId, stories.id))
      .where(eq(stories.userId, ctx.session.user.id))
      .groupBy(stories.id)
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
  getStoryById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
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
        coverImage: z.string().nullable(),
        category: z.string(),
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
            image: input.coverImage,
            category: input.category,
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
  updateStoryPart: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return db
        .update(storyPart)
        .set({ content: input.content, updatedAt: new Date() })
        .where(eq(storyPart.id, input.id))
        .returning()
    }),
  deleteStoryPart: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.delete(storyPart).where(eq(storyPart.id, input.id)).returning()
    }),
  duplicateStoryPart: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.transaction(async (tx) => {
        const [part] = await tx.select().from(storyPart).where(eq(storyPart.id, input.id))
        if (!part) throw new Error('Part not found')
        if (!part.storyId) throw new Error('Part has no story')

        await tx
          .update(storyPart)
          .set({ order: sql`${storyPart.order} + 1` })
          .where(and(eq(storyPart.storyId, part.storyId), sql`${storyPart.order} > ${part.order}`))

        const [newPart] = await tx
          .insert(storyPart)
          .values({
            storyId: part.storyId,
            content: part.content,
            order: part.order + 1,
          })
          .returning()

        return newPart
      })
    }),
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

      const nextPartContent = await geminiGenerateNextPart({
        storyContext,
        userInstruction: input.userInstruction,
        lang: 'id',
      })

      const lastOrder = parts[parts.length - 1]?.order ?? 0

      const [newPart] = await db
        .insert(storyPart)
        .values({
          content: 'hello',
          order: 5,
          likes: 0,
          // storyId: story.id,
          // content: nextPartContent,
          // order: parts.length + 1,
        })
        .returning()

      return newPart
    }),
}
