import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Tooltip, TooltipContent, TooltipTrigger } from '@story-brew/ui/components/ui/tooltip'
import { SynopsisDialog } from './-components/synopsis-dialog'
import { StoryBlockDialog } from './-components/story-block-dialog'
import { EmptyBlock } from './-components/empty-block'
import { StoryPart } from './-components/story-part'
import { useTRPC } from '@/utils/trpc'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@story-brew/ui/components/ui/button'
import { Input } from '@story-brew/ui/components/ui/input'
import { Textarea } from '@story-brew/ui/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCheck, CircleQuestionMark, PencilLine, Plus, Trash, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { generateStoryWithGemini, generateSynopsisWithGemini } from '@story-brew/ai/gemini-story'
import { Label } from '@story-brew/ui/components/ui/label'
import { ScrollArea } from '@story-brew/ui/components/ui/scroll-area'
import { STORY_CATEGORY } from '@/lib/constants'
import { useHeader } from '@/lib/header-context'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@story-brew/ui/components/ui/select'

export type ContentPart = Array<{
  id: string
  order: number
  content: string
}>

export const Route = createFileRoute('/(main)/create-story/')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { setHeaderAction, setTitle } = useHeader()

  const [title, setTitleState] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [lang, setLang] = useState<'en' | 'id'>('en')
  const [isOpen, setIsOpen] = useState(false)
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [contentParts, setContentParts] = useState<ContentPart>([
    {
      id: Date.now().toString(),
      content: '',
      order: 1,
    },
  ])

  const { data: storyBlocks } = useQuery(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())

  const { mutate: createStory } = useMutation(
    trpc.storyRouter.createWholeStory.mutationOptions({
      onSuccess: () => {
        toast.success('Story created successfully')
        navigate({
          to: '/my-stories',
        })
      },
    })
  )

  const { mutate: deleteStoryBlock } = useMutation(
    trpc.storyRouter.deleteStoryBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
      },
    })
  )

  const { mutate: deleteAllBlocks } = useMutation(
    trpc.storyRouter.deleteAllStoryBlocks.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
      },
    })
  )

  const handleGenerate = async () => {
    const previousContent = contentParts
      .slice(0, currentPartIndex)
      .map((part) => part.content)
      .join('\n\n')

    const res = await generateStoryWithGemini({
      category: STORY_CATEGORY[selectedCategory - 1].name,
      customPrompt,
      storyBlocks: storyBlocks?.map((item) => item.content) || [],
      lang,
      previousContent,
    })

    if (res) {
      const updatedParts = [...contentParts]
      updatedParts[currentPartIndex].content = res
      setContentParts(updatedParts)
    }
  }

  const handleGenerateSynopsis = async () => {
    if (!contentParts[currentPartIndex].content) {
      toast.error('Please generate the story content first')
      return
    }

    const res = await generateSynopsisWithGemini(
      contentParts.map((part) => part.content).join('\n'),
      lang
    )

    if (res) {
      setSynopsis(res)
    }
  }

  const handleCreateStory = useCallback(() => {
    createStory({
      title,
      synopsis,
      contentParts,
    })
  }, [contentParts, createStory, synopsis, title])

  const isPublishable =
    selectedCategory !== 0 &&
    storyBlocks?.length! > 0 &&
    title.length > 0 &&
    synopsis.length > 0 &&
    contentParts[0].content.length > 0

  useEffect(() => {
    setTitle('Story Editor')
    setHeaderAction(
      <Button
        className="cursor-pointer flex items-center gap-2"
        onClick={handleCreateStory}
        disabled={!isPublishable}
      >
        <PencilLine />
        Publish
      </Button>
    )

    return () => {
      setHeaderAction(null)
      setTitle('Story Brew')
    }
  }, [handleCreateStory, isPublishable, setHeaderAction, setTitle])

  return (
    <section className="flex flex-col gap-3 w-full px-4 py-4">
      <div className="w-full flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <div className="flex gap-2 flex-wrap">
              {STORY_CATEGORY.map((item) => (
                <div
                  className={cn(
                    'py-2 bg-accent cursor-pointer hover:text-black hover:bg-accent-foreground px-3 border rounded-full',
                    {
                      'bg-accent-foreground text-black': selectedCategory === item.id,
                    }
                  )}
                  key={item.id}
                  onClick={() => setSelectedCategory(item.id)}
                >
                  <h1>{item.name}</h1>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Story Blocks</Label>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteAllBlocks()}
                      className="cursor-pointer"
                    >
                      <Trash2 />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove All</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setIsOpen(true)}
                      className="cursor-pointer"
                    >
                      <Plus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add New Block</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <ScrollArea className="h-[200px] border rounded-sm py-1 px-2">
              {storyBlocks?.length == 0 && <EmptyBlock />}
              <div className="w-full flex flex-col gap-2">
                {storyBlocks?.map((item) => (
                  <div key={item.id} className="flex w-full justify-between items-center">
                    <h1>{item.content}</h1>
                    <Button
                      onClick={() => deleteStoryBlock({ id: item.id })}
                      className="cursor-pointer"
                      size="icon"
                      variant="ghost"
                    >
                      <Trash className="cursor-pointer" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              <Label>Select Language</Label>
              <Select onValueChange={(value) => setLang(value as 'en' | 'id')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Indonesia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label>Custom Context</Label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full min-h-[200px]"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerate} className="cursor-pointer w-full sm:w-1/2">
                Generate Story
              </Button>
              <SynopsisDialog
                synopsis={synopsis}
                handleGenerateSynopsis={handleGenerateSynopsis}
                onSynopsisChange={setSynopsis}
              />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 h-full flex flex-col gap-3">
          <h1>Generated Story</h1>
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input
              className="w-full"
              value={title}
              onChange={(e) => setTitleState(e.target.value)}
            />
          </div>
          <StoryPart
            contentParts={contentParts}
            setContentParts={setContentParts}
            currentPartIndex={currentPartIndex}
            setCurrentPartIndex={setCurrentPartIndex}
          />
          <div id="requirements">
            <ul className="list-inside list-disc">
              <li
                className={cn(
                  'flex gap-2 items-center justify-between hover:underline cursor-pointer text-muted-foreground',
                  {
                    'text-green-500': selectedCategory !== 0,
                  }
                )}
              >
                Story Category <CheckCheck size={15} />
              </li>
              <li
                onClick={() => setIsOpen(true)}
                className={cn(
                  'flex gap-2 items-center justify-between hover:underline cursor-pointer text-muted-foreground',
                  {
                    'text-green-500': storyBlocks?.length! > 0,
                  }
                )}
              >
                Story Block <CheckCheck size={15} />
              </li>
              <li
                onClick={() => setLang('en')}
                className="flex gap-2 items-center justify-between hover:underline cursor-pointer text-green-500"
              >
                Select Language <CheckCheck size={15} />
              </li>
              <li
                className={cn(
                  'flex gap-2 items-center justify-between hover:underline cursor-pointer text-muted-foreground',
                  {
                    'text-green-500': customPrompt.length > 0,
                  }
                )}
              >
                Custom Context <CircleQuestionMark size={15} />
              </li>
              <li
                className={cn(
                  'flex gap-2 items-center justify-between hover:underline cursor-pointer text-muted-foreground',
                  {
                    'text-green-500': title.length > 0,
                  }
                )}
              >
                Story Title <CheckCheck size={15} />
              </li>
              <li className="flex gap-2 items-center justify-between hover:underline cursor-pointer text-green-500">
                Story Parts <CircleQuestionMark size={15} />
              </li>
              <li
                className={cn(
                  'flex gap-2 items-center justify-between hover:underline cursor-pointer text-muted-foreground',
                  {
                    'text-green-500': synopsis.length > 0,
                  }
                )}
              >
                Story Synopsis <CheckCheck size={15} />
              </li>
              <li
                className={cn(
                  'flex gap-2 items-center justify-between hover:underline cursor-pointer text-muted-foreground',
                  {
                    'text-green-500': contentParts[0].content.length > 0,
                  }
                )}
              >
                Generated Story <CheckCheck size={15} />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <StoryBlockDialog
        storyBlocksLength={storyBlocks?.length!}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </section>
  )
}
