import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(play)/play/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 h-screen">
      <h1>This is PLAY SCREEN</h1>
      <Link to="/again">Again</Link>
    </div>
  )
}
