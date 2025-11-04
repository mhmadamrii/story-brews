import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/utils/trpc'
import { PopularStories } from './-components/popular-stories'
import { Button } from '@story-brew/ui/components/ui/button'
import { Bookmark, Eye, Heart, User } from 'lucide-react'
import { formatDate } from '@story-brew/ui/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@story-brew/ui/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@story-brew/ui/components/ui/select'

export const Route = createFileRoute('/(main)/home/')({
  component: RouteComponent,
})

type StoryData = {
  id: string
  content: string | null
  title: string
  createdAt: string
  updatedAt: string
  userId: string | null
  likes: number
  author: string
}

function RouteComponent() {
  const [stories, setStories] = useState<Array<StoryData>>()
  const [likedStories, setLikedStories] = useState(new Set())
  const [savedStories, setSavedStories] = useState(new Set())

  const trpc = useTRPC()
  const navigate = useNavigate()

  const { data: storiesData } = useQuery(trpc.storyRouter.getAllStories.queryOptions())

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  const handleViewDetails = (id: string) => {
    navigate({
      to: `/stories/${id}`,
    })
  }

  const toggleLike = (id: string) => {
    setLikedStories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
        setStories(
          stories?.map((story) => (story.id === id ? { ...story, likes: story.likes - 1 } : story))
        )
      } else {
        newSet.add(id)
        setStories(
          stories?.map((story) => (story.id === id ? { ...story, likes: story.likes + 1 } : story))
        )
      }
      return newSet
    })
  }

  const toggleSave = (id: string) => {
    setSavedStories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (storiesData) {
      console.log('stories data', storiesData)
      setStories(storiesData.map((s) => ({ ...s.stories, likes: 5, author: s.user.name })))
    }
  }, [storiesData])

  return (
    <div className="w-full px-4 pt-4">
      <section className="flex flex-col gap-4">
        <PopularStories />
        <div className="flex gap-2 w-full justify-end items-center">
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 grid-rows-5 gap-4">
          {stories?.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>{item.author}</span>
                  <span className="text-gray-400">•</span>
                  <span>{formatDate(item.createdAt)}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="text-gray-700 dark:text-gray-300">
                  {truncateText(item.content ?? '')}
                </p>
                {item?.content!.length > 150 && (
                  <button
                    onClick={() => handleViewDetails(item.id)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm mt-2 font-medium cursor-pointer"
                  >
                    See details
                  </button>
                )}
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(item.id)}
                    className={likedStories.has(item.id) ? 'text-red-500' : ''}
                  >
                    <Heart
                      className={`w-5 h-5 ${likedStories.has(item.id) ? 'fill-current' : ''}`}
                    />
                    <span className="ml-1">{item.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSave(item.id)}
                    className={savedStories.has(item.id) ? 'text-blue-600' : ''}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${savedStories.has(item.id) ? 'fill-current' : ''}`}
                    />
                  </Button>
                </div>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(item.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Read
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
