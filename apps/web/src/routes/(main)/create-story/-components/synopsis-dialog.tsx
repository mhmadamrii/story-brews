import { Button } from '@story-brew/ui/components/ui/button'
import { useState } from 'react'
import { Label } from '@story-brew/ui/components/ui/label'
import { BookOpenCheck } from 'lucide-react'
import { Textarea } from '@story-brew/ui/components/ui/textarea'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@story-brew/ui/components/ui/dialog'
import { cn } from '@/lib/utils'

export function SynopsisDialog({
  synopsis,
  onSynopsisChange,
  handleGenerateSynopsis,
}: {
  synopsis: string
  handleGenerateSynopsis: () => void
  onSynopsisChange: React.Dispatch<React.SetStateAction<string>>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isApplied, setIsApplied] = useState(false)

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Button
        className="w-full sm:w-1/2 cursor-pointer"
        variant="secondary"
        onClick={() => setIsOpen(true)}
      >
        Create Synopsis
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create A Synopsis for Your Story</DialogTitle>
          <DialogDescription
            className={cn('', {
              'text-green-500': isApplied,
            })}
          >
            {!isApplied ? 'Please apply the synopsis to your story.' : 'Applied to your story.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>Synopsis</Label>
          <Textarea
            onChange={(e) => onSynopsisChange(e.target.value)}
            value={synopsis}
            className="w-full h-[200px]"
          />
        </div>
        <div className="w-full flex gap-2">
          <Button
            variant="secondary"
            onClick={handleGenerateSynopsis}
            className="w-full sm:w-1/2 cursor-pointer"
          >
            Generate Synopsis
          </Button>
          <Button
            onClick={() => setIsApplied(!isApplied)}
            className="w-full sm:w-1/2 cursor-pointer flex gap-2 items-center justify-center"
          >
            <BookOpenCheck className={cn('', {})} />
            {isApplied ? 'Applied' : 'Apply'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
