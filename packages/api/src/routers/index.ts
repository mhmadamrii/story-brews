import { protectedProcedure, publicProcedure, router } from '../index'
import { storyRouter } from './story'

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
})
export type AppRouter = typeof appRouter
