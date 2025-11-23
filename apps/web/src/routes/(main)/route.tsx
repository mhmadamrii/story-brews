import { getUser } from '@/functions/get-user'
import {
  createFileRoute,
  Outlet,
  redirect,
  useMatches,
  useRouterState,
} from '@tanstack/react-router'
import { Loader } from 'lucide-react'
import { SidebarProvider } from '@story-brew/ui/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ScrollArea } from '@story-brew/ui/components/ui/scroll-area'
import { HeaderLayout } from '@/components/header-layout'

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

function MainLayout() {
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const matches = useMatches()

  // Get the last match that has a title in staticData
  const title =
    (
      matches
        .slice()
        .reverse()
        .find((match) => (match.staticData as any)?.title)?.staticData as any
    )?.title || 'Story Brew'

  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <div className="border mt-2 py-0 px-2 ml-2 mr-1 rounded-md bg-[#121212] h-[calc(100vh-15px)] w-full relative">
          <HeaderLayout title={title} />
          <ScrollArea className="h-full pt-15">
            {isLoading ? (
              <div className="w-full flex justify-center items-center h-[calc(100vh-15px)]">
                <Loader className="animate-spin" />
              </div>
            ) : (
              <Outlet />
            )}
          </ScrollArea>
        </div>
      </SidebarProvider>
    </main>
  )
}

function RouteComponent() {
  return <MainLayout />
}
