import { useTRPC } from '@/utils/trpc'
import { Avatar, AvatarFallback, AvatarImage } from '@story-brew/ui/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@story-brew/ui/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Calendar, Heart, User } from 'lucide-react'
import { Badge } from '@story-brew/ui/components/ui/badge'
import { formatDate } from '@story-brew/ui/lib/utils'

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

  console.log('story', story)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!story) {
    return <div>Story not found</div>
  }

  return (
    <div className="px-4 py-8">
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-8">
          <Avatar>
            <AvatarImage src={story.user?.image || ''} />
            <AvatarFallback>{story.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-muted-foreground">By {story.user?.name}</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-3xl font-bold  leading-tight">{story.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm ">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>{story.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(story.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    <span>{9}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <BookOpen className="w-3 h-3 mr-1" />
                {story.parts.length} Bagian
              </Badge>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className=" leading-relaxed italic">{story.synopsis}</p>
            </div>
          </CardHeader>
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
