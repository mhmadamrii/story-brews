import { useTRPC } from '@/utils/trpc'
import { Avatar, AvatarFallback, AvatarImage } from '@story-brew/ui/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@story-brew/ui/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/stories/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()

  const { id } = Route.useParams()

  const { data: story, isLoading } = useQuery(
    trpc.storyRouter.getStoryById.queryOptions({
      id,
    })
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!story) {
    return <div>Story not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Avatar>
            <AvatarImage src={story.user?.image || ''} />
            <AvatarFallback>{story.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{story.title}</h2>
            <p className="text-muted-foreground">By {story.user?.name}</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Synopsis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{story.synopsis}</p>
          </CardContent>
        </Card>

        <div>
          {story.parts.map((part, index) => (
            <Card key={part?.id} className="mb-4">
              <CardHeader>
                <CardTitle>Part {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{part?.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
