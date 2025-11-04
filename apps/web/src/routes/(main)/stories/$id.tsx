import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/stories/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  console.log('route by id', id)

  return (
    <div>
      <h1>Story by id</h1>
    </div>
  )
}
