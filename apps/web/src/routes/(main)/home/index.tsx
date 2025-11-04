import { createFileRoute } from '@tanstack/react-router'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@story-brew/ui/components/ui/select'

export const Route = createFileRoute('/(main)/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="border border-red-500 w-full px-4 pt-4">
      <h1>Every line was once a thought. Every thought, a story.</h1>
      <section className="flex flex-col gap-4">
        <div className="flex gap-2 w-full justify-end">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-3 grid-rows-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
                <CardAction>Card Action</CardAction>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
