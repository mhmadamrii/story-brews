import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/bookmark/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(main)/bookmark/"!</div>
}
