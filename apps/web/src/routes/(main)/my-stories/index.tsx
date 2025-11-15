import { useTRPC } from '@/utils/trpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { StoryCard } from './-components/story-card'

export const Route = createFileRoute('/(main)/my-stories/')({
  component: RouteComponent,
})

interface Story {
  id: string
  title: string
  synopsis: string
  impressions: number
  likes: number
  parts: number
  readingTimeMinutes: number
}

const stories: Story[] = [
  {
    id: '1',
    title: 'The Lost Kingdom',
    synopsis:
      'A thrilling adventure through an enchanted forest where a young hero discovers the secrets of an ancient civilization.',
    impressions: 12500,
    likes: 3420,
    parts: 24,
    readingTimeMinutes: 180,
  },
  {
    id: '2',
    title: 'Echoes of Tomorrow',
    synopsis:
      'A sci-fi narrative exploring the consequences of time travel and the choices that shape our destiny across parallel universes.',
    impressions: 8900,
    likes: 2100,
    parts: 18,
    readingTimeMinutes: 145,
  },
  {
    id: '3',
    title: 'The Silent Ocean',
    synopsis:
      'A mysterious tale of a lighthouse keeper who uncovers strange signals from the depths of the sea, leading to unexpected revelations.',
    impressions: 15300,
    likes: 4560,
    parts: 32,
    readingTimeMinutes: 240,
  },
  {
    id: '4',
    title: 'Midnight in the City',
    synopsis:
      'An urban romance following two strangers who meet in a late-night diner and discover that fate works in mysterious ways.',
    impressions: 9800,
    likes: 2800,
    parts: 16,
    readingTimeMinutes: 120,
  },
]

function RouteComponent() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: myStories } = useQuery(trpc.storyRouter.getAllMyStories.queryOptions())

  const { mutate: deleteStory } = useMutation(
    trpc.storyRouter.deleteStory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStories.queryOptions())
      },
    })
  )

  console.log('mystories', myStories)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} onDelete={() => deleteStory({ id: story.id })} />
      ))}
    </div>
  )
}
