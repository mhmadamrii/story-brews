import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@story-brew/ui/components/ui/avatar'
import {
  ChartColumn,
  BookMarked,
  BookOpenText,
  Home,
  PencilLine,
  ChevronsUpDown,
  LogOut,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@story-brew/ui/components/animate-ui/components/radix/sidebar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@story-brew/ui/components/animate-ui/primitives/radix/dropdown-menu'

export function AppSidebar() {
  const items = [
    {
      title: 'Home & Explore',
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
      title: 'Analytics',
      url: '/analytics',
      icon: ChartColumn,
    },
  ]

  return (
    <Sidebar className="border-l-0 border-t-2 border-transparent">
      <SidebarContent className="border-r-0">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">user</span>
                    <span className="truncate text-xs">user@gmail.com</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
