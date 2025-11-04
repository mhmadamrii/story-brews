import { useTRPC } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/stories/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()

  const { id } = Route.useParams()

  const { data: story } = useQuery(
    trpc.storyRouter.getStoryById.queryOptions({
      id,
    })
  )

  console.log('story', story)

  return (
    <div>
      <h1>Story by id</h1>
      <pre>{JSON.stringify(story, null, 2)}</pre>
    </div>
  )
}
