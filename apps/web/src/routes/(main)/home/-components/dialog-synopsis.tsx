import { Badge } from '@story-brew/ui/components/ui/badge'
import { ScrollArea } from '@story-brew/ui/components/ui/scroll-area'
import { Separator } from '@story-brew/ui/components/ui/separator'
import { Calendar, Heart, User, BookOpen } from 'lucide-react'
import { formatDate } from '@story-brew/ui/lib/utils'
import { Button } from '@story-brew/ui/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@story-brew/ui/components/ui/dialog'

interface DialogSynopsisProps {
  children: React.ReactNode
  story: {
    id: string
    title: string
    synopsis: string
    image: string | null
    author: string
    category: string | null
    likes: number
    createdAt: string
  }
}

export function DialogSynopsis({ children, story }: DialogSynopsisProps) {
  const navigate = useNavigate()

  const handleRead = () => {
    navigate({
      to: `/stories/${story.id}`,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col md:flex-row p-0 gap-0 overflow-hidden">
        <div className="relative w-full md:w-[60%] h-48 md:h-full bg-muted shrink-0">
          <img
            src={story.image || '/placeholder-cover-image.png'}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent md:bg-gradient-to-t md:from-background/80 md:to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 md:hidden">
            <Badge className="mb-2">{story.category || 'Story'}</Badge>
            <DialogTitle className="text-2xl font-bold text-white drop-shadow-md line-clamp-2">
              {story.title}
            </DialogTitle>
          </div>
        </div>

        <div className="w-full md:w-[40%] h-full bg-background">
          <ScrollArea className="h-full w-full">
            <div className="p-6 flex flex-col gap-6">
              <div className="hidden md:block space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{story.category || 'Story'}</Badge>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Heart className="w-4 h-4 fill-current text-red-500" />
                    <span>{story.likes}</span>
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold leading-tight">
                  {story.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{story.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(story.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="md:hidden flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{story.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(story.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-current text-red-500" />
                  <span>{story.likes}</span>
                </div>
              </div>

              <Separator />

              <DialogHeader className="px-0">
                <DialogDescription className="text-base leading-relaxed text-foreground">
                  {story.synopsis}
                </DialogDescription>
              </DialogHeader>

              <div className="pt-2">
                <Button onClick={handleRead} className="w-full gap-2" size="lg">
                  <BookOpen className="w-4 h-4" />
                  Baca Sekarang
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
