import { desc, eq, sql, db } from '@story-brew/db'
import { stories } from '@story-brew/db/schema/story'
import { protectedProcedure, router } from '../index'

export const analyticsRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const [stats] = await db
      .select({
        totalViews: sql<number>`sum(${stories.impression})`.mapWith(Number),
        totalLikes: sql<number>`sum(${stories.likes})`.mapWith(Number),
        totalStories: sql<number>`count(${stories.id})`.mapWith(Number),
      })
      .from(stories)
      .where(eq(stories.userId, userId))

    const topStories = await db
      .select({
        id: stories.id,
        title: stories.title,
        views: stories.impression,
        likes: stories.likes,
        createdAt: stories.createdAt,
      })
      .from(stories)
      .where(eq(stories.userId, userId))
      .orderBy(desc(stories.impression))
      .limit(5)

    return {
      stats: {
        totalViews: stats?.totalViews || 0,
        totalLikes: stats?.totalLikes || 0,
        totalStories: stats?.totalStories || 0,
      },
      topStories,
    }
  }),
})
