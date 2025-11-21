import { Heart, Eye, BookOpen, Clock, ChevronRight, BookmarkMinus } from 'lucide-react'
import { Button } from '@story-brew/ui/components/ui/button'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/utils/trpc'
import { toast } from 'sonner'

interface Story {
  id: string
  title: string
  synopsis: string
  impressions?: number
  likes?: number
  parts?: number
  readingTimeMinutes?: number
}

interface BookmarkCardProps {
  story: Story
}

export function BookmarkCard({ story }: BookmarkCardProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate: toggleBookmark } = useMutation(
    trpc.bookmarkRouter.toggleBookmark.mutationOptions({
      onSuccess: () => {
        toast.success('Bookmark removed')
        queryClient.invalidateQueries(trpc.bookmarkRouter.getAllBookmarks.queryOptions())
      },
      onError: () => {
        toast.error('Failed to remove bookmark')
      },
    })
  )

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent p-4">
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-1" title={story.title}>
          {story.title}
        </h3>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]">{story.synopsis}</p>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="text-xs font-medium">
              {story.impressions ? (story.impressions / 1000).toFixed(1) + 'K' : '0'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="text-xs font-medium">{story.likes || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-medium">{story.parts || 0} parts</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">{story.readingTimeMinutes || 0} min</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-3 flex gap-2 bg-muted/10">
        <Button variant="outline" size="sm" className="flex-1 group/btn" asChild>
          <Link
            to={`/stories/$id`}
            params={{ id: story.id }}
            className="inline-flex items-center justify-center gap-2"
          >
            Read Story
            <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => toggleBookmark({ storyId: story.id })}
          title="Remove Bookmark"
        >
          <BookmarkMinus className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
