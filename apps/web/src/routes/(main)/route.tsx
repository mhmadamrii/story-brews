import { getUser } from '@/functions/get-user'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getUser()
    return { session }
  },
})

function RouteComponent() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })

  console.log(isLoading)
  return (
    <main>
      <Outlet />
    </main>
  )
}
