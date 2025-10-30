import { useTRPC } from '@/utils/trpc'
import { cn } from '@/lib/utils'
import { Button } from '@story-brew/ui/components/ui/button'
import { Input } from '@story-brew/ui/components/ui/input'
import { Textarea } from '@story-brew/ui/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loader, Trash } from 'lucide-react'
import { useRef, useState } from 'react'
import { generateStoryWithAI } from '@story-brew/ai'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@story-brew/ui/components/ui/dialog'

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
]

export const Route = createFileRoute('/(main)/home/')({
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

  console.log('data', storyBlocks)
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
  const customPrompt = useRef<HTMLTextAreaElement | null>(null)
  const [selectedCategory, setSelectedCategory] = useState(0)

  console.log('STORY_CATEGORY[selectedCategory]', STORY_CATEGORY[selectedCategory])

  const handleGenerate = async () => {
    const res = await generateStoryWithAI({
      category: STORY_CATEGORY[selectedCategory].name,
      customPrompt: customPrompt.current?.value,
      storyBlocks: piecesOfStories || [],
    })
    console.log('response generation', res)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate a new story</DialogTitle>
          <DialogDescription>
            <div className="w-full flex flex-col gap-2">
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

              <div className="w-full flex flex-col gap-2">
                <Textarea ref={customPrompt} className="w-full" />
                <Button onClick={handleGenerate} className="w-full cursor-pointer">
                  Generate
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
