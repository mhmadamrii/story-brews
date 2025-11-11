import { useTRPC } from '@/utils/trpc'
import { Button } from '@story-brew/ui/components/ui/button'
import { Input } from '@story-brew/ui/components/ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Loader } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@story-brew/ui/components/ui/dialog'

export function StoryBlockDialog({
  isOpen,
  setIsOpen,
  storyBlocksLength,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  storyBlocksLength: number
}) {
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  const [blockContent, setBlockContent] = useState('')

  const { mutate, isPending } = useMutation(
    trpc.storyRouter.createStoryBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
        setIsOpen(false)
      },
    })
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-h-full">
        <DialogHeader>
          <DialogTitle>Create new block</DialogTitle>
          <DialogDescription>New block is used to add context to your story</DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <Input
            value={blockContent}
            onChange={(e) => setBlockContent(e.target.value)}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button
            className="w-full cursor-pointer"
            disabled={isPending}
            onClick={() =>
              mutate({
                content: blockContent,
                order: storyBlocksLength + 1,
              })
            }
          >
            {isPending && <Loader className="animate-spin" />}
            Create block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
