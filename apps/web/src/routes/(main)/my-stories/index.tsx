import { useTRPC } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { StoryCard } from './-components/story-card'
import { EmptyData } from '@/components/empty-data'
import { BookmarkX } from 'lucide-react'

export const Route = createFileRoute('/(main)/my-stories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()

  const { data: myStories } = useQuery(trpc.storyRouter.getAllMyStories.queryOptions())

  console.log('mystories', myStories)

  if (!myStories || myStories.length === 0) {
    return (
      <EmptyData
        title="No stories yet"
        description="Start creating your own stories and share them with the world."
        icon={<BookmarkX className="h-12 w-12 text-muted-foreground" />}
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-4">
      {myStories
        ?.map((item) => ({
          id: item.id,
          title: item.title,
          synopsis: item.synopsis,
          impressions: item.impression ?? 0,
          likes: item.likes ?? 0,
          parts: item.partsCount,
          readingTimeMinutes: 20,
        }))
        .map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
    </div>
  )
}
