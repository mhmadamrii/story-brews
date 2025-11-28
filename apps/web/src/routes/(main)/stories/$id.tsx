import { useTRPC } from '@/utils/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@story-brew/ui/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@story-brew/ui/components/ui/avatar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreativeMode } from '../create-story/-components/creative-mode'
import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '@story-brew/ui/components/ui/badge'
import { cn, formatDate } from '@story-brew/ui/lib/utils'
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
import { AlertDeletePart } from './-components/alert-delete-part'

export const Route = createFileRoute('/(main)/stories/$id')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const session = context.session
    return { session }
  },
})

function RouteComponent() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { session } = Route.useLoaderData()
  const { id } = Route.useParams()

  const [layoutMode, setLayoutMode] = useState<'scroll' | 'paginate'>('scroll')
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [editingPartId, setEditingPartId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')

  const { data: story } = useQuery(
    trpc.storyRouter.getStoryById.queryOptions({
      id,
    })
  )
  const { mutate: updateStoryPart } = useMutation(
    trpc.storyRouter.updateStoryPart.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getStoryById.queryOptions({ id }))
        setEditingPartId(null)
      },
    })
  )
  const { mutate: deleteStoryPart } = useMutation(
    trpc.storyRouter.deleteStoryPart.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getStoryById.queryOptions({ id }))
      },
    })
  )
  const { mutate: duplicateStoryPart } = useMutation(
    trpc.storyRouter.duplicateStoryPart.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getStoryById.queryOptions({ id }))
      },
    })
  )

  const handleSave = (partId: string) => {
    updateStoryPart({ id: partId, content: editingContent })
  }

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
    <div className="px-4 py-2 font-['Merriweather']">
      <div className="w-full flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl shadow-2xl"
        >
          <Card className="border-0 overflow-hidden py-0">
            <motion.div
              className="relative w-full min-h-[500px] overflow-hidden"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              {story?.image ? (
                <>
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90" />
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <motion.div
                  className="flex items-center gap-4 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Avatar className="ring-4 ring-white/20 w-12 h-12">
                    <AvatarImage src={story?.user?.image || ''} />
                    <AvatarFallback className="text-white font-bold">
                      {story?.user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white/90 text-sm">
                      by <span className="font-bold text-white">{story?.user?.name}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-white/70" />
                      <span className="text-xs text-white/70">
                        {formatDate(story?.createdAt ?? new Date().toString())}
                      </span>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-start justify-between gap-4 mb-4"
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight flex-1 drop-shadow-lg">
                    {story?.title}
                  </h1>
                  <Badge
                    variant="outline"
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 shadow-lg shrink-0"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    {story?.parts.length} Bagian
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="w-full"
                >
                  <p className="text-muted-foreground text-lg leading-relaxed italic font-light font-['Merriweather']">
                    {story?.synopsis}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </Card>
        </motion.div>
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
            <div className="space-y-4 flex gap-4 relative">
              <div
                className={cn('w-full sm:w-[70%]', {
                  'sm:w-[100%]': editingPartId,
                })}
              >
                {story?.parts.map((part) => {
                  if (!part) return null
                  return (
                    <div
                      id={`part-${part.id}`}
                      className="flex w-full flex-col mb-5 group scroll-mt-20"
                      key={part.id}
                    >
                      {editingPartId === part.id ? (
                        <div className="min-h-[500px]">
                          <CreativeMode
                            initialValue={part.content ?? ''}
                            onChange={(value) => {
                              setEditingContent(value)
                            }}
                            onDeactivateCreativeMode={() => {
                              setEditingPartId(null)
                            }}
                            onSave={() => handleSave(part.id)}
                          />
                        </div>
                      ) : (
                        <div className="font-['Times_New_Roman']">
                          <ReadOnlyEditor initialValue={part.content ?? ''} />
                        </div>
                      )}
                      {story?.user.id === session?.user.id && !editingPartId && (
                        <div className="flex justify-end gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <AlertDeletePart onConfirm={() => deleteStoryPart({ id: part.id })}>
                            <button className="cursor-pointer">
                              <Trash size={15} className="text-muted-foreground" />
                            </button>
                          </AlertDeletePart>
                          <button
                            className="cursor-pointer"
                            onClick={() => duplicateStoryPart({ id: part.id })}
                          >
                            <Copy size={15} className="text-muted-foreground" />
                          </button>
                          <button
                            className="cursor-pointer"
                            onClick={() => {
                              setEditingPartId(part.id)
                              setEditingContent(part.content)
                            }}
                          >
                            <Pencil size={15} className="text-muted-foreground" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className={cn('w-full sm:w-[30%] relative', { hidden: editingPartId })}>
                <div className="sticky top-24 space-y-4">
                  <h1 className="font-bold text-xl mb-4">Table of Contents</h1>
                  <div className="flex flex-col gap-2 border-l-2 border-muted pl-4">
                    {story?.parts.map((part, index) => (
                      <button
                        className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-1 hover:translate-x-1 duration-200 cursor-pointer"
                        key={part?.id}
                        onClick={() => {
                          document.getElementById(`part-${part?.id}`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          })
                        }}
                      >
                        Part {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
                      <CardContent className="font-['Merriweather']">
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
