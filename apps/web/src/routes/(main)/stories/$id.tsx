import { useTRPC } from '@/utils/trpc'
import { Avatar, AvatarFallback, AvatarImage } from '@story-brew/ui/components/ui/avatar'
import { useQuery } from '@tanstack/react-query'
import { CreativeMode } from '../create-story/-components/creative-mode'
import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '@story-brew/ui/components/ui/badge'
import { formatDate } from '@story-brew/ui/lib/utils'
import { Separator } from '@story-brew/ui/components/ui/separator'
import { ReadOnlyEditor } from '@story-brew/editor/read-only-editor'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@story-brew/ui/components/ui/tabs'
import { Button } from '@story-brew/ui/components/ui/button'
import { motion, AnimatePresence } from 'motion/react'

import {
  BookOpen,
  Calendar,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Copy,
  Trash,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@story-brew/ui/components/ui/card'

export const Route = createFileRoute('/(main)/stories/$id')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const session = context.session
    return { session }
  },
})

function RouteComponent() {
  const trpc = useTRPC()
  const { session } = Route.useLoaderData()
  const { id } = Route.useParams()

  const [layoutMode, setLayoutMode] = useState<'scroll' | 'paginate'>('scroll')
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)

  const { data: story } = useQuery(
    trpc.storyRouter.getStoryById.queryOptions({
      id,
    })
  )

  console.log('story', story?.user.id === session?.user.id)

  const handleNextPart = () => {
    if (story?.parts && currentPartIndex < story.parts.length - 1) {
      setCurrentPartIndex((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevPart = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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
            <div className="flex flex-col gap-4">
              {story?.image && (
                <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-3xl font-bold leading-tight">{story?.title}</CardTitle>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {story?.parts.length} Bagian
                </Badge>
              </div>
            </div>
            <Separator />
            <p className="italic">{story?.synopsis}</p>
          </CardHeader>
        </Card>
        <div className="flex justify-end">
          <Tabs value={layoutMode} onValueChange={(v) => setLayoutMode(v as 'scroll' | 'paginate')}>
            <TabsList>
              <TabsTrigger value="scroll" className="flex items-center gap-2">
                <ScrollText className="w-4 h-4" />
                Scroll
              </TabsTrigger>
              <TabsTrigger value="paginate" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Paginated
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div>
          {layoutMode === 'scroll' ? (
            <div className="space-y-4">
              {story?.parts.map((part, index) => (
                <Card key={part?.id}>
                  <CardHeader>
                    <CardTitle>Part {index + 1}</CardTitle>
                  </CardHeader>
                  {isEditing ? (
                    <CreativeMode
                      initialValue={part?.content ?? ''}
                      onChange={(value) => {
                        console.log(value)
                      }}
                      onDeactivateCreativeMode={() => {
                        setIsEditing(false)
                      }}
                    />
                  ) : (
                    <CardContent>
                      <ReadOnlyEditor initialValue={part?.content ?? ''} />
                    </CardContent>
                  )}

                  {story?.user.id === session?.user.id && (
                    <CardFooter className="flex justify-end gap-2">
                      <Button className="cursor-pointer" variant="secondary" size="icon">
                        <Trash />
                      </Button>
                      <Button className="cursor-pointer" variant="ghost" size="icon">
                        <Copy />
                      </Button>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer"
                        variant="ghost"
                        size="icon"
                      >
                        <Pencil />
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {story?.parts[currentPartIndex] && (
                  <motion.div
                    key={story.parts[currentPartIndex].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Part {currentPartIndex + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ReadOnlyEditor initialValue={story.parts[currentPartIndex].content} />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevPart}
                  disabled={currentPartIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Part
                </Button>
                <span className="text-sm text-muted-foreground font-medium">
                  Part {currentPartIndex + 1} of {story?.parts.length}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextPart}
                  disabled={!story?.parts || currentPartIndex === story.parts.length - 1}
                  className="gap-2"
                >
                  Next Part
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
