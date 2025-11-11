import { EditorClient } from '@/components/editor/editor-client'
import { Suspense } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@story-brew/ui/components/ui/dialog'

export function EditorDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="min-w-5xl p-0">
        <DialogHeader></DialogHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <EditorClient initialContent={'hello world'} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}
