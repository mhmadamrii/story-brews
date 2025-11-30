import { protectedProcedure, publicProcedure, router } from '../index'
import { bookmarkRouter } from './bookmark'
import { storyRouter } from './story'
import { userRouter } from './user'
import { analyticsRouter } from './analytics'
import { aiRouter } from './ai'

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return 'OK'
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: 'This is private',
      user: ctx.session.user,
    }
  }),
  storyRouter,
  bookmarkRouter,
  userRouter,
  aiRouter,
  analytics: analyticsRouter,
})
export type AppRouter = typeof appRouter
