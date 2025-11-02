import { useTRPC } from '@/utils/trpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@story-brew/ui/components/ui/button'
import { Loader } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@story-brew/ui/components/ui/card'

export const Route = createFileRoute('/(main)/my-stories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: myStories } = useQuery(trpc.storyRouter.getAllMyStories.queryOptions())

  const { mutate: deleteStory, isPending } = useMutation(
    trpc.storyRouter.deleteStory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStories.queryOptions())
      },
    })
  )

  console.log('mystories', myStories)

  return (
    <div className="mx-auto container">
      <h1>My Stories</h1>
      <div className="flex-col flex gap-2">
        {myStories?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent className="w-full sm:w-[200px]">{item.content}</CardContent>
            <CardFooter>
              <Button
                className="cursor-pointer"
                onClick={() => deleteStory({ id: item.id })}
                variant="destructive"
              >
                {isPending && <Loader className="animate-spin" />}
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
