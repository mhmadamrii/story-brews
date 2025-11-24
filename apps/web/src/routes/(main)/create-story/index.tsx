import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CreativeMode } from './-components/creative-mode'
import { Tooltip, TooltipContent, TooltipTrigger } from '@story-brew/ui/components/ui/tooltip'
import { StoryBlockDialog } from './-components/story-block-dialog'
import { EmptyBlock } from './-components/empty-block'
import { StoryPart } from './-components/story-part'
import { useTRPC } from '@/utils/trpc'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@story-brew/ui/components/ui/button'
import { Input } from '@story-brew/ui/components/ui/input'
import { Textarea } from '@story-brew/ui/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PencilLine, Plus, Trash, Trash2, Loader2, Upload } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { generateStoryWithGemini, generateSynopsisWithGemini } from '@story-brew/ai/gemini-story'
import { Label } from '@story-brew/ui/components/ui/label'
import { ScrollArea } from '@story-brew/ui/components/ui/scroll-area'
import { STORY_CATEGORY } from '@/lib/constants'
import { ReadinessIndicator } from './-components/readiness-indicator'
import { generateImageWithGemini } from '@story-brew/ai/gemini-image'
import { uploadToCloudinary } from '@/components/claudinary/upload'
import { Image as ImageIcon, RefreshCw } from 'lucide-react'
import { HeaderAction } from '@/components/header-portal'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@story-brew/ui/components/ui/select'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@story-brew/ui/components/ui/card'

export type ContentPart = Array<{
  id: string
  order: number
  content: string
}>

export const Route = createFileRoute('/(main)/create-story/')({
  component: RouteComponent,
  staticData: {
    title: 'Story Editor',
  },
})

function RouteComponent() {
  const queryClient = useQueryClient()

  const trpc = useTRPC()
  const navigate = useNavigate()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitleState] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [lang, setLang] = useState<'en' | 'id'>('en')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isGeneratingCover, setIsGeneratingCover] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [isCreativeMode, setIsCreativeMode] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [contentParts, setContentParts] = useState<ContentPart>([
    {
      id: Date.now().toString(),
      content: '',
      order: 1,
    },
  ])

  const { data: storyBlocks } = useQuery(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())

  const { mutate: createStory } = useMutation(
    trpc.storyRouter.createWholeStory.mutationOptions({
      onSuccess: () => {
        toast.success('Story created successfully')
        navigate({
          to: '/my-stories',
        })
      },
    })
  )

  const { mutate: deleteStoryBlock } = useMutation(
    trpc.storyRouter.deleteStoryBlock.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
      },
    })
  )

  const { mutate: deleteAllBlocks } = useMutation(
    trpc.storyRouter.deleteAllStoryBlocks.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
      },
    })
  )

  const handleGenerate = async () => {
    setIsGenerating(true)
    const previousContent = contentParts
      .slice(0, currentPartIndex)
      .map((part) => part.content)
      .join('\n\n')

    try {
      const res = await generateStoryWithGemini({
        category: STORY_CATEGORY[selectedCategory - 1].name,
        customPrompt,
        storyBlocks: storyBlocks?.map((item) => item.content) || [],
        lang,
        previousContent,
      })

      console.log('res', res)

      if (res) {
        const updatedParts = [...contentParts]
        updatedParts[currentPartIndex].content = res
        setContentParts(updatedParts)
        toast.success('Story part generated')
      }
    } catch (error: any) {
      console.error(error)
      toast.error(`Failed to generate story: ${error?.message || 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateSynopsis = async () => {
    if (!contentParts[currentPartIndex].content) {
      toast.error('Please generate the story content first')
      return
    }

    const res = await generateSynopsisWithGemini(
      contentParts.map((part) => part.content).join('\n'),
      lang
    )

    if (res) {
      setSynopsis(res)
    }
  }

  const handleGenerateCover = async () => {
    if (!synopsis) {
      toast.error('Please generate or write a synopsis first')
      return
    }

    setIsGeneratingCover(true)
    try {
      const base64Image = await generateImageWithGemini(synopsis)

      // Convert base64 to blob
      const res = await fetch(`data:image/jpeg;base64,${base64Image}`)
      const blob = await res.blob()
      const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' })

      const url = await uploadToCloudinary(file)
      setCoverImage(url)
      toast.success('Cover image generated and uploaded!')
    } catch (error: any) {
      console.error(error)
      toast.error(`Failed to generate cover: ${error?.message || 'Unknown error'}`)
    } finally {
      setIsGeneratingCover(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setCoverImage(url)
      toast.success('Cover image uploaded successfully!')
    } catch (error: any) {
      console.error(error)
      toast.error(`Failed to upload cover: ${error?.message || 'Unknown error'}`)
    } finally {
      setIsUploading(false)
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleContentChange = (newContent: string) => {
    const updatedParts = [...contentParts]
    updatedParts[currentPartIndex].content = newContent
    setContentParts(updatedParts)
  }

  const handleCreateStory = useCallback(() => {
    createStory({
      title,
      synopsis,
      contentParts,
      coverImage,
    })
  }, [contentParts, createStory, synopsis, title])

  const isPublishable =
    selectedCategory !== 0 &&
    storyBlocks?.length! > 0 &&
    title.length > 0 &&
    synopsis.length > 0 &&
    contentParts[currentPartIndex].content.length > 0

  return (
    <section className="w-full px-4 py-6">
      <HeaderAction>
        <Button
          className="cursor-pointer flex items-center gap-2"
          onClick={handleCreateStory}
          disabled={!isPublishable}
        >
          <PencilLine />
          Publish
        </Button>
      </HeaderAction>
      {!isCreativeMode && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          <div id="left-section" className="lg:col-span-4 space-y-6 sticky">
            <ReadinessIndicator
              checks={[
                {
                  label: 'Select Category',
                  isValid: selectedCategory !== 0,
                },
                {
                  label: 'Add Story Blocks',
                  isValid: (storyBlocks?.length || 0) > 0,
                  onClick: () => setIsOpen(true),
                },
                {
                  label: 'Select Language',
                  isValid: true,
                  onClick: () => setLang('en'),
                },
                {
                  label: 'Custom Context (Optional)',
                  isValid: true,
                },
                {
                  label: 'Story Title',
                  isValid: title.length > 0,
                },
                {
                  label: 'Story Synopsis',
                  isValid: synopsis.length > 0,
                },
                {
                  label: 'Cover Image',
                  isValid: !!coverImage,
                },
                {
                  label: 'Generated Content',
                  isValid: contentParts[currentPartIndex].content.length > 0,
                },
              ]}
            />
            <Card>
              <CardHeader>
                <CardTitle>Story Configuration</CardTitle>
                <CardDescription>Setup your story parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {STORY_CATEGORY.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedCategory(item.id)}
                        className={cn(
                          'cursor-pointer rounded-md border p-3 text-center text-sm transition-all hover:border-primary',
                          selectedCategory === item.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card hover:bg-accent'
                        )}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Story Blocks</Label>
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteAllBlocks()}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove All</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsOpen(true)}
                          >
                            <Plus size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add New Block</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <ScrollArea className="h-[180px] rounded-md border bg-muted/30 p-2">
                    {storyBlocks?.length === 0 && <EmptyBlock />}
                    <div className="space-y-2">
                      {storyBlocks?.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-center justify-between rounded-md border bg-card p-2 text-sm shadow-sm"
                        >
                          <span className="line-clamp-1">{item.content}</span>
                          <Button
                            onClick={() => deleteStoryBlock({ id: item.id })}
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select onValueChange={(value) => setLang(value as 'en' | 'id')} value={lang}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="id">Indonesia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Context</Label>
                    <Textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Add specific instructions or context for the AI..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    disabled={!selectedCategory || !storyBlocks?.length || isGenerating}
                    onClick={handleGenerate}
                    className="w-full cursor-pointer flex items-center justify-center gap-2"
                    size="lg"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Generate Story Part'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <StoryPart
                    contentParts={contentParts}
                    setContentParts={setContentParts}
                    currentPartIndex={currentPartIndex}
                    setCurrentPartIndex={setCurrentPartIndex}
                    onActivateCreativeMode={setIsCreativeMode}
                  />
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
                      <img
                        src={coverImage}
                        alt="Story cover"
                        className="h-full w-full object-cover"
                      />
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
        </div>
      )}
      {isCreativeMode && (
        <CreativeMode
          initialValue={contentParts[currentPartIndex].content}
          onChange={handleContentChange}
          onDeactivateCreativeMode={setIsCreativeMode}
        />
      )}
      <StoryBlockDialog
        storyBlocksLength={storyBlocks?.length!}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </section>
  )
}
