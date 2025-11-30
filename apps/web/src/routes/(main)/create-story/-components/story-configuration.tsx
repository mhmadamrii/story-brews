import { ReadinessIndicator } from './readiness-indicator'
import { useCreateStoryContext } from '../-context/create-story-context'
import { Tooltip, TooltipContent, TooltipTrigger } from '@story-brew/ui/components/ui/tooltip'
import { ScrollArea } from '@story-brew/ui/components/ui/scroll-area'
import { STORY_CATEGORY } from '@/lib/constants'
import { cn } from '@story-brew/ui/lib/utils'
import { useTRPC } from '@/utils/trpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Label } from '@story-brew/ui/components/ui/label'
import { Button } from '@story-brew/ui/components/ui/button'
import { Loader2, Plus, Trash, Trash2 } from 'lucide-react'
import { EmptyBlock } from './empty-block'
import { Textarea } from '@story-brew/ui/components/ui/textarea'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@story-brew/ui/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@story-brew/ui/components/ui/select'

// StoryBlock type removed; using any for storyBlocks

// Props are removed; component will use context

export function StoryConfiguration() {
  const {
    selectedCategory,
    setSelectedCategory,
    storyBlocks,
    deleteAllBlocks,
    setIsOpen,
    lang,
    setLang,
    customPrompt,
    setCustomPrompt,
    handleGenerate,
    isGenerating,
    title,
    synopsis,
    coverImage,
    contentParts,
    currentPartIndex,
    shouldDisableConfig,
  } = useCreateStoryContext()

  const queryClient = useQueryClient()

  const trpc = useTRPC()

  const { mutate: deleteStoryBlock } = useMutation(
    trpc.storyRouter.deleteStoryBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
      },
    })
  )

  return (
    <div id="left-section" className="lg:col-span-4 space-y-6 sticky">
      <ReadinessIndicator
        checks={[
          {
            label: 'Select Category',
            isValid: selectedCategory !== 0,
          },
          {
            label: 'Add Story Blocks',
            isValid: (storyBlocks?.length || 0) > 0,
            onClick: () => setIsOpen(true),
          },
          {
            label: 'Select Language',
            isValid: true,
            onClick: () => setLang('en'),
          },
          {
            label: 'Custom Context (Optional)',
            isValid: true,
          },
          {
            label: 'Story Title',
            isValid: title.length > 0,
          },
          {
            label: 'Story Synopsis',
            isValid: synopsis.length > 0,
          },
          {
            label: 'Cover Image',
            isValid: !!coverImage,
          },
          {
            label: 'Generated Content',
            isValid: contentParts[currentPartIndex].content.length > 0,
          },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Story Configuration</CardTitle>
          <CardDescription>Setup your story parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={cn('space-y-6', shouldDisableConfig && 'pointer-events-none opacity-50')}>
            <div className="space-y-3">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {STORY_CATEGORY.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCategory(item.id)}
                    className={cn(
                      'cursor-pointer rounded-md border p-3 text-center text-sm transition-all hover:border-primary',
                      selectedCategory === item.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card hover:bg-accent'
                    )}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Story Blocks</Label>
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteAllBlocks()}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove All</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsOpen(true)}
                      >
                        <Plus size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add New Block</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <ScrollArea className="h-[180px] rounded-md border bg-muted/30 p-2">
                {storyBlocks?.length === 0 && <EmptyBlock />}
                <div className="space-y-2">
                  {storyBlocks?.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between rounded-md border bg-card p-2 text-sm shadow-sm"
                    >
                      <span className="line-clamp-1">{item.content}</span>
                      <Button
                        onClick={() => deleteStoryBlock({ id: item.id })}
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select onValueChange={(value) => setLang(value as 'en' | 'id')} value={lang}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="id">Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Custom Context</Label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add specific instructions or context for the AI..."
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              disabled={
                (!selectedCategory || !storyBlocks?.length || isGenerating) && !shouldDisableConfig
              }
              onClick={handleGenerate}
              className="w-full cursor-pointer flex items-center justify-center gap-2"
              size="lg"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : shouldDisableConfig ? (
                `Generate Part ${currentPartIndex + 1}`
              ) : (
                'Generate Story Part'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
