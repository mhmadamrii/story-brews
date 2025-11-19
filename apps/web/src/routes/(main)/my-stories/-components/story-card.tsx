import { Heart, Eye, BookOpen, Clock, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@story-brew/ui/components/ui/button'
import { useState } from 'react'
import { AlertDeleteStory } from './alert-delete-story'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'

interface Story {
  id: string
  title: string
  synopsis: string
  impressions: number
  likes: number
  parts: number
  readingTimeMinutes: number
}

interface StoryCardProps {
  story: Story
}

export function StoryCard({ story }: StoryCardProps) {
  const [isOpenDelete, setIsOpenDelete] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -1 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <motion.div
        variants={itemVariants}
        className="border-b border-border from-primary/5 to-primary/10 p-4"
      >
        <h3 className="text-balance font-semibold text-card-foreground line-clamp-2">
          {story.title}
        </h3>
      </motion.div>
      <motion.div variants={itemVariants} className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{story.synopsis}</p>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-3 border-t border-border px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {(story.impressions / 1000).toFixed(1)}K
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 transition-colors fill-destructive text-destructive" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{30}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{story.parts}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {story.readingTimeMinutes} min
            </span>
          </div>
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="border-t border-border px-4 py-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link
            to={`/stories/$id`}
            params={{ id: story.id }}
            className="inline-flex items-center justify-center gap-2"
          >
            Details
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        <AlertDeleteStory isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} storyId={story.id} />
      </motion.div>
    </motion.div>
  )
}
