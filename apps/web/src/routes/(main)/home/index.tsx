import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/utils/trpc'
import { PopularStories } from './-components/popular-stories'
import { Button } from '@story-brew/ui/components/ui/button'
import { Bookmark, Eye, Heart, User } from 'lucide-react'
import { formatDate } from '@story-brew/ui/lib/utils'
import { authorSearchSchema, StoryFilter } from './-components/story-filter'
import { motion } from 'motion/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@story-brew/ui/components/ui/card'

export const Route = createFileRoute('/(main)/home/')({
  component: RouteComponent,
  validateSearch: authorSearchSchema,
  staticData: {
    title: 'Every line was once a thought. Every thought, a story.',
  },
})

type StoryData = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  userId: string | null
  likes: number
  author: string
  synopsis: string
  isBookmarked: boolean
  image: string | null
}

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const [stories, setStories] = useState<Array<StoryData>>()
  const [likedStories, setLikedStories] = useState(new Set())
  const [savedStories, setSavedStories] = useState(new Set())
  console.log('stories', stories)

  const { data: storiesData } = useQuery(trpc.storyRouter.getAllStories.queryOptions())

  const { mutate: bookmarkStory } = useMutation(
    trpc.bookmarkRouter.toggleBookmark.mutationOptions({
      onSuccess: (r) => {
        console.log('r', r)
        queryClient.invalidateQueries()
        toast.success(`Story ${r.bookmarked ? 'saved' : 'removed'} successfully`)
      },
    })
  )

  const { mutate: likeStory } = useMutation(
    trpc.storyRouter.toggleLike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries()
      },
    })
  )

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  const handleViewDetails = (id: string) => {
    navigate({
      to: `/stories/${id}`,
    })
  }

  const toggleLike = (id: string) => {
    likeStory({ storyId: id })

    setLikedStories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
        setStories(
          stories?.map((story) => (story.id === id ? { ...story, likes: story.likes - 1 } : story))
        )
      } else {
        newSet.add(id)
        setStories(
          stories?.map((story) => (story.id === id ? { ...story, likes: story.likes + 1 } : story))
        )
      }
      return newSet
    })
  }

  const toggleSave = (id: string) => {
    bookmarkStory({
      storyId: id,
    })

    setSavedStories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (storiesData) {
      setStories(
        storiesData.map((s) => ({
          ...s.stories,
          likes: s.stories.likes ?? 0,
          author: s.user.name,
          // content: s.story_part.content,
          image: s.stories.image,
          synopsis: s.stories.synopsis,
          isBookmarked: s.bookmark?.id ? true : false,
        }))
      )
      setLikedStories(new Set(storiesData.filter((s) => s.isLiked).map((s) => s.stories.id)))
    }
  }, [storiesData])

  return (
    <div className="w-full px-4 pt-4">
      <section className="flex flex-col gap-4">
        <PopularStories />
        <StoryFilter />
        {stories && (
          <motion.div
            id="story-list"
            className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
          >
            {stories.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card className="flex flex-col h-full pt-0 overflow-hidden group">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={item.image || '/placeholder-cover-image.png'}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold line-clamp-1">{item.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span>{item.author}</span>
                      <span className="text-gray-400">•</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      {truncateText(item.synopsis ?? '')}
                    </p>
                    {item?.synopsis!.length > 150 && (
                      <button
                        onClick={() => handleViewDetails(item.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mt-2 font-medium cursor-pointer"
                      >
                        See details
                      </button>
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(item.id)}
                        className={cn(
                          'cursor-pointer',
                          likedStories.has(item.id) && 'text-red-500'
                        )}
                      >
                        <Heart
                          className={cn('w-5 h-5', likedStories.has(item.id) && 'fill-current')}
                        />
                        <span className="ml-1">{item.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSave(item.id)}
                        className={cn(
                          'cursor-pointer',
                          savedStories.has(item.id) || (item.isBookmarked && 'text-blue-600')
                        )}
                      >
                        <Bookmark
                          className={cn(
                            'w-5 h-5',
                            (savedStories.has(item.id) || item.isBookmarked) && 'fill-current'
                          )}
                        />
                      </Button>
                    </div>
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(item.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Read
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
