import { useTRPC } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'

export function Another() {
  const trpc = useTRPC()
  const { data: storyBlocks } = useQuery(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
  console.log('storyBlocks', storyBlocks)
  return (
    <div>
      <h1>Hello world</h1>
    </div>
  )
}
