import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from '@/utils/trpc'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@story-brew/ui/components/ui/card'

export const Route = createFileRoute('/(public)/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="container mx-auto px-4 border border-red-500 py-2 flex gap-2 flex-wrap">
      {Array.from({ length: 10 }).map((_, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent className="w-full sm:w-[200px]">
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
