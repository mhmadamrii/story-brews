import { BookMarked, BookOpenText, Home, PencilLine, Settings } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@story-brew/ui/components/ui/sidebar'

export function AppSidebar() {
  const items = [
    {
      title: 'Home / Explore',
      url: '/home',
      icon: Home,
    },
    {
      title: 'My Stories',
      url: '/my-stories',
      icon: BookOpenText,
    },
    {
      title: 'My Bookmarks',
      url: '/bookmark',
      icon: BookMarked,
    },
    {
      title: 'Create a Story',
      url: '/create-story',
      icon: PencilLine,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ]

  return (
    <Sidebar className="border-l-0 border-t-2 border-transparent">
      <SidebarContent className="border-r-0">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarTrigger />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
