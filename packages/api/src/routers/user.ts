import { db, eq } from '@story-brew/db'
import { user } from '@story-brew/db/schema/auth'
import { stories } from '@story-brew/db/schema/story'
import { protectedProcedure } from '..'

export const userRouter = {
  getAllAuthors: protectedProcedure.query(async () => {
    const authors = await db
      .selectDistinct({
        id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(user)
      .innerJoin(stories, eq(stories.userId, user.id))

    return authors
  }),
}
