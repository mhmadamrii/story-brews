import { EditorClient } from '@story-brew/editor'
import { Button } from '@story-brew/ui/components/ui/button'
import { ChevronLeft, File, Sparkles } from 'lucide-react'
import { Suspense } from 'react'

export function CreativeMode({
  initialValue,
  onChange,
  onDeactivateCreativeMode,
  onSave,
}: {
  initialValue: string
  onChange: (content: string) => void
  onDeactivateCreativeMode: (isCreativeMode: boolean) => void
  onSave?: () => void
}) {
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onDeactivateCreativeMode(false)}
            size="icon"
            variant="secondary"
            className="flex items-center gap-2 cursor-pointer"
          >
            <ChevronLeft />
          </Button>

          <h1 className="text-lg font-semibold text-foreground">Creative Mode</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="flex items-center gap-2 cursor-pointer">
            <Sparkles />
            Re-generate
          </Button>
          {onSave && (
            <Button onClick={onSave} className="cursor-pointer flex items-center gap-2">
              <File />
              Save
            </Button>
          )}
        </div>
      </div>

      <Suspense fallback={<div className="h-[300px] w-full">Loading...</div>}>
        <EditorClient initialContent={initialValue} onChange={onChange} />
      </Suspense>
    </div>
  )
}
