import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/my-stories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(main)/my-stories/"!</div>
}
