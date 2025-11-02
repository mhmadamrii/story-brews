import { getUser } from '@/functions/get-user'
import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { Loader } from 'lucide-react'

export const Route = createFileRoute('/(main)')({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getUser()
    return { session }
  },
  loader: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: '/login',
      })
    }
  },
})

function RouteComponent() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })

  return <main>{isLoading ? <Loader className="animate-spin" /> : <Outlet />}</main>
}
