import { Button } from '@story-brew/ui/components/ui/button'
import { Textarea } from '@story-brew/ui/components/ui/textarea'
import { useState } from 'react'
import { useTRPC } from '@/utils/trpc'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@story-brew/ui/components/ui/dialog'

interface DialogNextPartProps {
  storyId: string
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

export function DialogNextPart({ storyId, children, isOpen, onOpenChange }: DialogNextPartProps) {
  const [instruction, setInstruction] = useState('')

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate: generateNextPart, isPending } = useMutation(
    trpc.storyRouter.generateNextPart.mutationOptions({
      onSuccess: () => {
        toast.success('Next part generated successfully!')
        queryClient.invalidateQueries(trpc.storyRouter.getStoryById.queryOptions({ id: storyId }))
        onOpenChange(false)
        setInstruction('')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to generate next part')
      },
    })
  )

  const handleGenerate = () => {
    if (!instruction.trim()) return
    generateNextPart({ storyId, userInstruction: instruction })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Next Part</DialogTitle>
          <DialogDescription>
            Provide instructions for the AI to generate the next part of your story.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="e.g. The protagonist discovers a hidden door..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={5}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isPending || !instruction.trim()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
