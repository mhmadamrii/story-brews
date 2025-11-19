import { protectedProcedure, publicProcedure, router } from '../index'
import { bookmarkRouter } from './bookmark'
import { storyRouter } from './story'
import { userRouter } from './user'

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
})
export type AppRouter = typeof appRouter
