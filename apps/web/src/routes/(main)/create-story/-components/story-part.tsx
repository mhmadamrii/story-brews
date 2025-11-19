'use no memo'

import { Button } from '@story-brew/ui/components/ui/button'
import { CircleX, PencilLine, Plus } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@story-brew/ui/components/ui/scroll-area'
import { ReadOnlyEditor } from '@story-brew/editor/read-only-editor'
import { Card, CardContent } from '@story-brew/ui/components/ui/card'
import { cn } from '@story-brew/ui/lib/utils'

import type { ContentPart } from '..'

export function StoryPart({
  contentParts,
  currentPartIndex,
  setContentParts,
  setCurrentPartIndex,
  onActivateCreativeMode,
}: {
  contentParts: ContentPart
  currentPartIndex: number
  setContentParts: React.Dispatch<React.SetStateAction<ContentPart>>
  setCurrentPartIndex: React.Dispatch<React.SetStateAction<number>>
  onActivateCreativeMode: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const currentPart = contentParts[currentPartIndex]

  const handleAddPart = () => {
    const newPart = {
      id: Date.now().toString(),
      order: contentParts.length + 1,
      content: '',
    }
    const newIndex = contentParts.length
    setContentParts([...contentParts, newPart])
    setCurrentPartIndex(newIndex)
  }

  const handleDeletePart = (index: number) => {
    if (contentParts.length === 1) return
    const updatedParts = contentParts.filter((_, i) => i !== index)
    setContentParts(updatedParts)
    setCurrentPartIndex(Math.max(0, Math.min(currentPartIndex, updatedParts.length - 1)))
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Part {currentPartIndex + 1} of {contentParts.length}
          </label>
          <Button onClick={() => onActivateCreativeMode(true)} size="icon" variant="outline">
            <PencilLine className="h-4 w-4" />
          </Button>
        </div>
        <Card className="overflow-hidden">
          <ScrollArea className="h-[300px] w-full">
            <div className="p-0">
              <ReadOnlyEditor initialValue={currentPart.content} />
            </div>
          </ScrollArea>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Story Parts</h2>
        <ScrollArea id="story-part-selection" className="w-full whitespace-nowrap pb-4">
          <div className="flex gap-4">
            {contentParts.map((part, index) => (
              <Card
                key={part.id}
                className={cn(
                  'w-48 shrink-0 cursor-pointer transition-all hover:shadow-md',
                  currentPartIndex === index
                    ? 'border-primary bg-accent/50 ring-1 ring-primary/20'
                    : 'hover:border-primary/50'
                )}
                onClick={() => setCurrentPartIndex(index)}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Part {index + 1}</span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePart(index)
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      disabled={contentParts.length === 1}
                    >
                      <CircleX className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-3 h-[4.5em] whitespace-normal break-words">
                    {part.content || <span className="italic opacity-50">Empty part...</span>}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card
              onClick={handleAddPart}
              className="w-48 shrink-0 cursor-pointer border-dashed hover:bg-accent/50 hover:border-primary/50 transition-all flex items-center justify-center"
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-muted-foreground hover:text-primary transition-colors">
                <Plus className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Add Part</span>
              </CardContent>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
