import { Label } from '@story-brew/ui/components/ui/label'
import { Button } from '@story-brew/ui/components/ui/button'
import { StoryPart } from './story-part'
import { Image as ImageIcon, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react'
import { Input } from '@story-brew/ui/components/ui/input'
import { Textarea } from '@story-brew/ui/components/ui/textarea'
import { useCreateStoryContext } from '../-context/create-story-context'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@story-brew/ui/components/ui/card'

export function StoryEditor() {
  const {
    title,
    setTitleState,
    synopsis,
    setSynopsis,
    coverImage,
    setCoverImage,
    isGeneratingCover,
    isUploading,
    handleGenerateSynopsis,
    handleGenerateCover,
    handleFileChange,
    handleUploadClick,
    fileInputRef,
  } = useCreateStoryContext()

  return (
    <div className="lg:col-span-8 space-y-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Story Editor</CardTitle>
          <CardDescription>Write and edit your story content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Story Title</Label>
            <Input
              className="text-lg font-medium h-10"
              placeholder="Enter your story title..."
              value={title}
              onChange={(e) => setTitleState(e.target.value)}
            />
          </div>
          <div className="border rounded-md p-4 bg-muted/10">
            <StoryPart />
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Synopsis</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={handleGenerateSynopsis}
                >
                  Auto-generate
                </Button>
              </div>
              <Textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Story synopsis..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Cover Image</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs gap-1"
                onClick={handleGenerateCover}
                disabled={!synopsis || isGeneratingCover}
              >
                {isGeneratingCover ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Generate Cover
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs gap-1"
                onClick={handleUploadClick}
                disabled={isUploading || isGeneratingCover}
              >
                {isUploading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Upload className="h-3 w-3" />
                )}
                Upload
              </Button>
            </div>
            {coverImage ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                <img src={coverImage} alt="Story cover" className="h-full w-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => setCoverImage(null)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center rounded-md border border-dashed bg-muted/50 text-muted-foreground">
                <ImageIcon className="mb-2 h-8 w-8 opacity-50" />
                <p className="text-xs">No cover image generated</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
