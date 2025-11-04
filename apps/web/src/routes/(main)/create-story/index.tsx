import { createFileRoute } from '@tanstack/react-router'

import { useTRPC } from '@/utils/trpc'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@story-brew/ui/components/ui/button'
import { Input } from '@story-brew/ui/components/ui/input'
import { Textarea } from '@story-brew/ui/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, Trash } from 'lucide-react'
import { useRef, useState } from 'react'
import { generateStoryWithAI } from '@story-brew/ai'
import { Label } from '@story-brew/ui/components/ui/label'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@story-brew/ui/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@story-brew/ui/components/ui/select'

const STORY_CATEGORY = [
  {
    id: 1,
    name: 'Adventure',
  },
  {
    id: 2,
    name: 'Comedy',
  },
  {
    id: 3,
    name: 'Drama',
  },
  {
    id: 4,
    name: 'Mystery/Thriller',
  },
  {
    id: 5,
    name: 'Science Fiction',
  },
  {
    id: 6,
    name: 'Sport',
  },
  {
    id: 7,
    name: 'Romance',
  },
]

export const Route = createFileRoute('/(main)/create-story/')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const [blockContent, setBlockContent] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const { data: storyBlocks } = useQuery(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())

  const { mutate, isPending } = useMutation(
    trpc.storyRouter.createStoryBlock.mutationOptions({
      onSuccess: (res) => {
        console.log('success', res)
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
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

  return (
    <section className="flex flex-col gap-3 container mx-auto">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-3xl">My Stories</h1>
        <Button onClick={() => setIsOpen(true)} className="cursor-pointer">
          Create Story
        </Button>
      </div>
      <div className="w-full flex flex-col gap-4">
        {storyBlocks?.map((item) => (
          <div key={item.id} className="flex w-full justify-between">
            <h1>{item.content}</h1>
            <Trash onClick={() => deleteStoryBlock({ id: item.id })} />
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col px-4 gap-4">
        <Input
          value={blockContent}
          onChange={(e) => setBlockContent(e.target.value)}
          className="w-full"
        />
        <Button
          className="w-full"
          disabled={isPending}
          onClick={() =>
            mutate({
              content: blockContent,
              order: storyBlocks?.length! + 1,
            })
          }
        >
          {isPending && <Loader className="animate-spin" />}
          Create block
        </Button>
      </div>
      <GenerateDialog
        piecesOfStories={storyBlocks?.map((item) => item.content)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </section>
  )
}

function GenerateDialog({
  isOpen,
  setIsOpen,
  piecesOfStories,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  piecesOfStories: string[] | undefined
}) {
  const trpc = useTRPC()
  const customPrompt = useRef<HTMLTextAreaElement | null>(null)
  const storyRef = useRef<HTMLTextAreaElement | null>(null)
  const titleRef = useRef<HTMLInputElement | null>(null)

  const [selectedCategory, setSelectedCategory] = useState(0)
  const [lang, setLang] = useState<'en' | 'id'>('en')

  const { mutate: createStory } = useMutation(
    trpc.storyRouter.createWholeStore.mutationOptions({
      onSuccess: (res) => {
        toast.success('Story created successfully')
      },
    })
  )

  const handleGenerate = async () => {
    console.log('aleez', STORY_CATEGORY[selectedCategory]?.name)
    const res = await generateStoryWithAI({
      category: STORY_CATEGORY[selectedCategory - 1].name,
      customPrompt: customPrompt.current?.value,
      storyBlocks: piecesOfStories || [],
      lang,
    })
    console.log('response generation', res)

    if (res && storyRef.current) {
      storyRef.current.value = res
    }
  }

  const handleCreateStory = () => {
    createStory({
      title: titleRef.current?.value || '',
      content: storyRef.current?.value || '',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full sm:max-w-4xl max-h-full sm:max-h-2xl">
        <DialogHeader>
          <DialogTitle>Generate a new story</DialogTitle>
          <DialogDescription>Create a new story with AI</DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-1/2 flex flex-col gap-2">
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
            <div className="w-full flex flex-col gap-4">
              <Select onValueChange={(value) => setLang(value as 'en' | 'id')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Indonesia</SelectItem>
                </SelectContent>
              </Select>
              <Textarea ref={customPrompt} className="w-full" />
              <Button onClick={handleGenerate} className="w-full cursor-pointer">
                Generate
              </Button>
            </div>
          </div>
          <div className="w-full sm:w-1/2 h-full flex flex-col gap-3">
            <h1>Generated Story</h1>
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input className="w-full" ref={titleRef} />
            </div>
            <Textarea ref={storyRef} className="w-full h-[400px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={handleCreateStory}>Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
