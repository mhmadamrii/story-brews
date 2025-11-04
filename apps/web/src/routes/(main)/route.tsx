import { getUser } from '@/functions/get-user'
import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { SidebarProvider, SidebarTrigger } from '@story-brew/ui/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

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

  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        {isLoading ? (
          <div className="w-full flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <Outlet />
        )}
      </SidebarProvider>
    </main>
  )
}
