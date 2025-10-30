import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section>
      <h1>My Stories</h1>
    </section>
  )
}
