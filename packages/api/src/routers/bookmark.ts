import z from 'zod'

import { and, db, eq } from '@story-brew/db'
import { protectedProcedure, router } from '..'
import { bookmark, stories } from '@story-brew/db/schema/story'
import { user } from '@story-brew/db/schema/auth'

export const bookmarkRouter = router({
  getAllBookmarks: protectedProcedure.query(({ ctx }) => {
    return db
      .select({
        bookmark: bookmark,
        story: stories,
        user: user,
      })
      .from(bookmark)
      .innerJoin(stories, eq(stories.id, bookmark.storyId))
      .innerJoin(user, eq(user.id, stories.userId))
      .where(eq(bookmark.userId, ctx.session.user.id))
  }),
  addBookmark: protectedProcedure
    .input(
      z.object({
        storyId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return db.insert(bookmark).values({
        storyId: input.storyId,
        userId: ctx.session.user.id,
      })
    }),
  toggleBookmark: protectedProcedure
    .input(z.object({ storyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingBookmark = await db
        .select()
        .from(bookmark)
        .where(and(eq(bookmark.storyId, input.storyId), eq(bookmark.userId, ctx.session.user.id)))

      if (existingBookmark.length > 0) {
        await db.delete(bookmark).where(eq(bookmark.id, existingBookmark[0]!.id))
        return { bookmarked: false }
      } else {
        await db.insert(bookmark).values({ userId: ctx.session.user.id, storyId: input.storyId })
        return { bookmarked: true }
      }
    }),
})
