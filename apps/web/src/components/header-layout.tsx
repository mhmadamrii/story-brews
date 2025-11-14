import { SidebarTrigger } from '@story-brew/ui/components/ui/sidebar'

export function HeaderLayout({
  title,
  headerAction,
}: {
  title: string
  headerAction: React.ReactNode
}) {
  return (
    <header className="flex justify-between items-center border-b absolute top-0 rounded-t-lg right-0 w-full px-4 py-2 bg-card z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {headerAction}
    </header>
  )
}
