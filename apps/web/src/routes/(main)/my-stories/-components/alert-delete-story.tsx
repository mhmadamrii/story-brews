import { Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/utils/trpc'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@story-brew/ui/components/ui/alert-dialog'

export function AlertDeleteStory({
  isOpen,
  setIsOpen,
  storyId,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  storyId: string
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate: deleteStory } = useMutation(
    trpc.storyRouter.deleteStory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStories.queryOptions())
      },
    })
  )

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-lg bg-destructive/10 p-2 text-destructive transition-colors hover:bg-destructive/20"
        aria-label="Delete story"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteStory({ id: storyId })}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
