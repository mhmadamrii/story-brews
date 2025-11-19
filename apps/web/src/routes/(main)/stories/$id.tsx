import { useTRPC } from '@/utils/trpc'
import { Avatar, AvatarFallback, AvatarImage } from '@story-brew/ui/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@story-brew/ui/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Calendar } from 'lucide-react'
import { Badge } from '@story-brew/ui/components/ui/badge'
import { formatDate } from '@story-brew/ui/lib/utils'
import { Separator } from '@story-brew/ui/components/ui/separator'
import { ReadOnlyEditor } from '@story-brew/editor/read-only-editor'

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
    <div className="px-4 py-2">
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-8">
          <Avatar>
            <AvatarImage src={story?.user?.image || ''} />
            <AvatarFallback>{story?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-muted-foreground">
              by <span className="font-bold">{story?.user?.name}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatDate(story?.createdAt ?? new Date().toString())}
              </span>
            </div>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-3xl font-bold leading-tight">{story?.title}</CardTitle>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <BookOpen className="w-3 h-3 mr-1" />
                {story?.parts.length} Bagian
              </Badge>
            </div>
            <Separator />
            <p className="italic">{story?.synopsis}</p>
          </CardHeader>
        </Card>
        <div>
          {story?.parts.map((part, index) => (
            <Card key={part?.id} className="mb-4">
              <CardHeader>
                <CardTitle>Part {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <ReadOnlyEditor initialValue={part?.content ?? ''} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
