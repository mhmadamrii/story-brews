import { getUser } from '@/functions/get-user'
import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { SidebarProvider, SidebarTrigger } from '@story-brew/ui/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ScrollArea } from '@story-brew/ui/components/ui/scroll-area'

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
        <ScrollArea className="border my-2 py-2 ml-2 mr-2 rounded-lg bg-[#121212] h-[calc(100vh-15px)] w-full">
          <SidebarTrigger />
          {isLoading ? (
            <div className="w-full flex justify-center items-center h-[calc(100vh-15px)]">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <Outlet />
          )}
        </ScrollArea>
      </SidebarProvider>
    </main>
  )
}
