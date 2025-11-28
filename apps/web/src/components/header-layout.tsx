import { SidebarTrigger } from '@story-brew/ui/components/animate-ui/components/radix/sidebar'

export function HeaderLayout({ title }: { title: string }) {
  return (
    <header className="flex justify-between items-center border-b absolute top-0 rounded-t-lg right-0 w-full px-4 py-2 bg-card z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      <div id="header-action-root" />
    </header>
  )
}
