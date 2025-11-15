import { useTRPC } from '@/utils/trpc'
import { StoryGrid } from './-components/story-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/my-stories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: myStories } = useQuery(trpc.storyRouter.getAllMyStories.queryOptions())

  const { mutate: deleteStory, isPending } = useMutation(
    trpc.storyRouter.deleteStory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStories.queryOptions())
      },
    })
  )

  console.log('mystories', myStories)

  return (
    <div>
      <StoryGrid />
    </div>
  )
}
