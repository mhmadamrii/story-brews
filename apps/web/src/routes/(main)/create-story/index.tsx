import { createFileRoute } from '@tanstack/react-router'
import { EmptyBlock } from './-components/empty-block'
import { useTRPC } from '@/utils/trpc'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@story-brew/ui/components/ui/button'
import { Input } from '@story-brew/ui/components/ui/input'
import { Textarea } from '@story-brew/ui/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader, PencilLine, Plus, Trash } from 'lucide-react'
import { useRef, useState } from 'react'
import { generateStoryWithAI } from '@story-brew/ai'
import { Label } from '@story-brew/ui/components/ui/label'
import { ScrollArea } from '@story-brew/ui/components/ui/scroll-area'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@story-brew/ui/components/ui/card'

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
  {
    id: 8,
    name: 'Horror',
  },
]

export const Route = createFileRoute('/(main)/create-story/')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const customPrompt = useRef<HTMLTextAreaElement | null>(null)
  const storyRef = useRef<HTMLTextAreaElement | null>(null)
  const titleRef = useRef<HTMLInputElement | null>(null)

  const [selectedCategory, setSelectedCategory] = useState(0)
  const [lang, setLang] = useState<'en' | 'id'>('en')
  const [isOpen, setIsOpen] = useState(false)

  const { data: storyBlocks } = useQuery(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())

  const { mutate: createStory } = useMutation(
    trpc.storyRouter.createWholeStore.mutationOptions({
      onSuccess: (res) => {
        toast.success('Story created successfully')
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

  const handleGenerate = async () => {
    console.log('aleez', STORY_CATEGORY[selectedCategory]?.name)
    const res = await generateStoryWithAI({
      category: STORY_CATEGORY[selectedCategory - 1].name,
      customPrompt: customPrompt.current?.value,
      storyBlocks: storyBlocks?.map((item) => item.content) || [],
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
    <section className="flex flex-col gap-3 w-full px-4 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Every line was once a thought. Every thought, a story.</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>
            <Button className="cursor-pointer flex items-center gap-2" onClick={handleCreateStory}>
              <PencilLine />
              Publish
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
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
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className="cursor-pointer"
                  >
                    <Plus />
                  </Button>
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
                  <Textarea ref={customPrompt} className="w-full min-h-[200px]" />
                </div>
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
              <div className="flex flex-col gap-2">
                <Label>Content</Label>
                <Textarea ref={storyRef} className="w-full h-[330px]" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Epilog</Label>
                <Textarea className="w-full h-[200px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <GenerateDialog
        storyBlocksLength={storyBlocks?.length!}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </section>
  )
}

function GenerateDialog({
  isOpen,
  setIsOpen,
  storyBlocksLength,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  storyBlocksLength: number
}) {
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const [blockContent, setBlockContent] = useState('')

  const { mutate, isPending } = useMutation(
    trpc.storyRouter.createStoryBlock.mutationOptions({
      onSuccess: (res) => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
        setIsOpen(false)
      },
    })
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-h-full">
        <DialogHeader>
          <DialogTitle>Create new block</DialogTitle>
          <DialogDescription>New block is used to add context to your story</DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <Input
            value={blockContent}
            onChange={(e) => setBlockContent(e.target.value)}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button
            className="w-full cursor-pointer"
            disabled={isPending}
            onClick={() =>
              mutate({
                content: blockContent,
                order: storyBlocksLength + 1,
              })
            }
          >
            {isPending && <Loader className="animate-spin" />}
            Create block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
