import { useTRPC } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@story-brew/ui/components/ui/select'

export const authorSearchSchema = z.object({
  author: z.string().optional(),
})

export function StoryFilter() {
  const trpc = useTRPC()
  const navigate = useNavigate({ from: '/home' })

  const { data: authors } = useQuery(trpc.userRouter.getAllAuthors.queryOptions())

  const handleSearchChange = (authorId: string) => {
    console.log(authorId)
    navigate({
      to: '/home',
      search: (s) => ({ ...s, author: authorId }),
    })
  }

  return (
    <div className="flex gap-2 w-full justify-end items-center">
      <div className="flex gap-2">
        <Select onValueChange={handleSearchChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Author" />
          </SelectTrigger>
          <SelectContent>
            {authors?.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
