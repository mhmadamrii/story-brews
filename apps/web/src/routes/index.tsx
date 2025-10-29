import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/utils/trpc'
import { Button } from '@story-brew/ui/components/ui/button'
import { getGroqChatCompletion } from '@story-brew/ai'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const trpc = useTRPC()
  const healthCheck = useQuery(trpc.healthCheck.queryOptions())

  const handleCompletion = async () => {
    const res = await getGroqChatCompletion()
    console.log(res)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <Button className="cursor-pointer" onClick={handleCompletion}>
        Hello world
      </Button>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck.data ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-muted-foreground text-sm">
              {healthCheck.isLoading
                ? 'Checking...'
                : healthCheck.data
                  ? 'Connected'
                  : 'Disconnected'}
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
