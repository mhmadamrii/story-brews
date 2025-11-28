import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { BookmarkCard } from './-components/bookmark-card'
import { Loader2, BookmarkX } from 'lucide-react'
import { EmptyData } from '@/components/empty-data'

export const Route = createFileRoute('/(main)/bookmark/')({
  component: RouteComponent,
  staticData: {
    title: 'Bookmarks',
  },
})

function RouteComponent() {
  const trpc = useTRPC()

  const { data: bookmarks, isLoading } = useQuery(
    trpc.bookmarkRouter.getAllBookmarks.queryOptions()
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <EmptyData
        title="No bookmarks yet"
        description="Start exploring stories and bookmark your favorites to read them later."
        icon={<BookmarkX className="h-12 w-12 text-muted-foreground" />}
      />
    )
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
      >
        {bookmarks.map(({ bookmark, story }) => (
          <BookmarkCard
            key={bookmark.id}
            story={{
              ...story,
              impressions: 0, // Placeholder as schema might not have these yet or they are in a separate table
              likes: story.likes || 0,
              parts: 0, // Placeholder
              readingTimeMinutes: 5, // Placeholder
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
