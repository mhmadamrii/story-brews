import { useTRPC } from '@/utils/trpc'
import { STORY_CATEGORY } from '@/lib/constants'
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
  category: z.string().optional(),
})

export function StoryFilter() {
  const trpc = useTRPC()
  const navigate = useNavigate({ from: '/home' })

  const { data: authors } = useQuery(trpc.userRouter.getAllAuthors.queryOptions())

  const handleSearchChange = (val: string, type: 'author' | 'category') => {
    switch (type) {
      case 'author':
        navigate({
          to: '/home',
          search: (s) => ({ ...s, author: val }),
        })
        break
      case 'category':
        navigate({
          to: '/home',
          search: (s) => ({ ...s, category: STORY_CATEGORY[Number(val)]?.name }),
        })
        break
      default:
        break
    }
  }

  return (
    <div className="flex gap-2 w-full justify-end items-center">
      <div className="flex gap-2">
        <Select onValueChange={(val) => handleSearchChange(val, 'author')}>
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
        <Select onValueChange={(val) => handleSearchChange(val, 'category')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {STORY_CATEGORY?.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
