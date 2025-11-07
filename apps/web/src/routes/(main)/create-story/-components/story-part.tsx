import { Button } from '@story-brew/ui/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Textarea } from '@story-brew/ui/components/ui/textarea'
import { ScrollArea, ScrollBar } from '@story-brew/ui/components/ui/scroll-area'
import type { ContentPart } from '..'

export function StoryPart({
  contentParts,
  setContentParts,
  currentPartIndex,
  setCurrentPartIndex,
}: {
  contentParts: ContentPart
  setContentParts: React.Dispatch<React.SetStateAction<ContentPart>>
  currentPartIndex: number
  setCurrentPartIndex: React.Dispatch<React.SetStateAction<number>>
}) {
  const currentPart = contentParts[currentPartIndex]

  const handleContentChange = (content: string) => {
    const updatedParts = [...contentParts]
    updatedParts[currentPartIndex].content = content
    setContentParts(updatedParts)
  }

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
    if (contentParts.length === 1) return // Prevent deleting the last part
    const updatedParts = contentParts.filter((_, i) => i !== index)
    setContentParts(updatedParts)
    // Adjust current index if needed
    setCurrentPartIndex(Math.max(0, Math.min(currentPartIndex, updatedParts.length - 1)))
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Part {currentPartIndex + 1} of {contentParts.length}
            </label>
            <div className="text-xs text-muted-foreground">
              {currentPart.content.length} characters
            </div>
          </div>
          <Textarea
            value={currentPart.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Write your story here..."
            className="w-full h-64 p-4 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Story Parts</h2>
        <ScrollArea className="pb-4 w-full whitespace-nowrap">
          <div className="flex gap-2">
            {contentParts.map((part, index) => (
              <div
                key={part.id}
                className={`p-3 w-40 rounded-lg border transition-colors cursor-pointer ${
                  currentPartIndex === index
                    ? 'bg-accent border-primary'
                    : 'bg-background border-input hover:bg-secondary'
                }`}
                onClick={() => setCurrentPartIndex(index)}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="font-medium text-foreground">Part {index + 1}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {part.content.length > 0 ? part.content.substring(0, 50) : 'Empty'}
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeletePart(index)
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 mt-2 w-full"
                    disabled={contentParts.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div
              onClick={handleAddPart}
              className="flex justify-center border rounded-md flex-col items-center border-dashed w-40 cursor-pointer bg-muted"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
