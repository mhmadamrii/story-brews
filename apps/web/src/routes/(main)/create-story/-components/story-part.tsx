'use no memo'

import { Button } from '@story-brew/ui/components/ui/button'
import { useEffect, useState } from 'react'
import { CircleX, PencilLine, Plus } from 'lucide-react'
import { Textarea } from '@story-brew/ui/components/ui/textarea'
import { ScrollArea, ScrollBar } from '@story-brew/ui/components/ui/scroll-area'
import { ReadOnlyEditor } from '@story-brew/editor/read-only-editor'

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
  const [initialEditorContent, setInitialEditorContent] = useState(currentPart.content)

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
    if (contentParts.length === 1) return
    const updatedParts = contentParts.filter((_, i) => i !== index)
    setContentParts(updatedParts)
    setCurrentPartIndex(Math.max(0, Math.min(currentPartIndex, updatedParts.length - 1)))
  }

  console.log('current part', currentPart.content)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Part {currentPartIndex + 1} of {contentParts.length}
          </label>
          <Button onClick={() => onActivateCreativeMode(true)} size="icon">
            <PencilLine />
          </Button>
        </div>
        <ScrollArea className="h-[200px] w-full">
          <ReadOnlyEditor initialValue={currentPart.content} />
        </ScrollArea>
        <h2 className="text-sm font-semibold text-foreground">Story Parts</h2>
        <ScrollArea className="pb-4 w-full whitespace-nowrap">
          <div className="flex gap-2">
            {contentParts.map((part, index) => (
              <div
                key={part.id}
                className={`p-3 w-40 rounded-lg border transition-colors cursor-pointer ${
                  currentPartIndex === index ? 'bg-accent border-primary' : ''
                }`}
                onClick={() => setCurrentPartIndex(index)}
              >
                <div className="flex justify-between h-full group relative">
                  <div className="w-full">
                    <div className="font-medium text-foreground">Part {index + 1}</div>
                    <div className="text-xs text-muted-foreground truncate line-clamp-2 mt-1">
                      {part.content.length > 0 ? part.content.substring(0, 50) : 'Empty'}
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeletePart(index)
                    }}
                    variant="destructive"
                    size="icon"
                    disabled={contentParts.length === 1}
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer absolute top-0 right-0"
                  >
                    <CircleX size={15} />
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
