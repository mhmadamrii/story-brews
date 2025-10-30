import { Another } from '@/components/another'
import { useTRPC } from '@/utils/trpc'
import { Button } from '@story-brew/ui/components/ui/button'
import { Input } from '@story-brew/ui/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/(main)/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const [blockContent, setBlockContent] = useState('')

  const { data } = useQuery(trpc.storyRouter.getAllMyStories.queryOptions())
  const { data: storyBlocks } = useQuery(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())

  const { mutate, isPending } = useMutation(
    trpc.storyRouter.createStoryBlock.mutationOptions({
      onSuccess: (res) => {
        console.log('success', res)
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
      },
    })
  )

  console.log('data', storyBlocks)
  return (
    <section>
      <h1>My Stories</h1>
      <div className="w-full flex flex-col gap-4">
        {storyBlocks?.map((item) => (
          <div key={item.id}>
            <h1>{item.content}</h1>
          </div>
        ))}
      </div>
      <Another />
      <div className="w-4xl flex flex-col px-4 gap-4">
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
    </section>
  )
}
