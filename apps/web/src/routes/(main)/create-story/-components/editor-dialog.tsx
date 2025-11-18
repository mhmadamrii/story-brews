import { EditorClient } from '@story-brew/editor/editor'
import { Suspense } from 'react'
import { ScrollArea } from '@story-brew/ui/components/ui/scroll-area'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@story-brew/ui/components/ui/dialog'

export function EditorDialog({
  initialValue,
  onChange,
}: {
  initialValue: string
  onChange: (content: string) => void
}) {
  return (
    <Dialog>
      <DialogTrigger>Creative Mode</DialogTrigger>
      <DialogContent className="min-w-full sm:min-w-5xl">
        <DialogHeader>
          <DialogTitle>Here it is a tagline</DialogTitle>
          <DialogDescription>Here it is a description</DialogDescription>
        </DialogHeader>
        <div className="border border-red-500">
          <ScrollArea className="h-[70vh]">
            <Suspense fallback={<div className="h-[300px] w-full">Loading...</div>}>
              <EditorClient initialContent={initialValue} onChange={onChange} />
            </Suspense>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
