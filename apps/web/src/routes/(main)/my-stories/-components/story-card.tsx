import { Heart, Eye, BookOpen, Clock, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@story-brew/ui/components/ui/button'

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
  onDelete: () => void
}

export function StoryCard({ story, onDelete }: StoryCardProps) {
  const handleDelete = () => {
    if (
      confirm(`Are you sure you want to delete "${story.title}"? This action cannot be undone.`)
    ) {
      onDelete()
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="border-b border-border from-primary/5 to-primary/10 p-4">
        <h3 className="text-balance font-semibold text-card-foreground line-clamp-2">
          {story.title}
        </h3>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{story.synopsis}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-border px-4 py-3">
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
      </div>
      <div className="border-t border-border px-4 py-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <a href={`/story/${story.id}`} className="inline-flex items-center justify-center gap-2">
            Details
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
        <button
          onClick={handleDelete}
          className="inline-flex items-center justify-center rounded-lg bg-destructive/10 p-2 text-destructive transition-colors hover:bg-destructive/20"
          aria-label="Delete story"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
