import { useTRPC } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { StoryCard } from './-components/story-card'

export const Route = createFileRoute('/(main)/my-stories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()

  const { data: myStories } = useQuery(trpc.storyRouter.getAllMyStories.queryOptions())

  console.log('mystories', myStories)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {myStories
        ?.map((item) => ({
          id: item.id,
          title: item.title,
          synopsis: item.synopsis,
          impressions: 30,
          likes: item.likes ?? 0,
          parts: 2,
          readingTimeMinutes: 20,
        }))
        .map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
    </div>
  )
}
