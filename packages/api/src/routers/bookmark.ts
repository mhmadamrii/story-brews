import z from 'zod'

import { db, eq } from '@story-brew/db'
import { protectedProcedure } from '..'
import { bookmark } from '@story-brew/db/schema/story'

export const bookmarkRouter = {
  getAllBookmarks: protectedProcedure.query(({ ctx }) => {
    return db.select().from(bookmark).where(eq(bookmark.userId, ctx.session.user.id))
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
}
