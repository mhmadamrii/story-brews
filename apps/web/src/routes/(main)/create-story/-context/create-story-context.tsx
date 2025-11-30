import { useNavigate } from '@tanstack/react-router'
import { useTRPC } from '@/utils/trpc'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef, useState, createContext, useContext, type ReactNode } from 'react'
import { generateStoryWithGemini, generateSynopsisWithGemini } from '@story-brew/ai/gemini-story'
import { STORY_CATEGORY } from '@/lib/constants'
import { generateImageWithGemini } from '@story-brew/ai/gemini-image'
import { uploadToCloudinary } from '@/components/claudinary/upload'

export type ContentPart = Array<{
  id: string
  order: number
  content: string
}>

interface CreateStoryContextType {
  title: string
  setTitleState: (title: string) => void
  customPrompt: string
  setCustomPrompt: (prompt: string) => void
  synopsis: string
  setSynopsis: (synopsis: string) => void
  selectedCategory: number
  setSelectedCategory: (category: number) => void
  lang: 'en' | 'id'
  setLang: (lang: 'en' | 'id') => void
  coverImage: string | null
  setCoverImage: (image: string | null) => void
  isGeneratingCover: boolean
  isUploading: boolean
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  currentPartIndex: number
  setCurrentPartIndex: (index: number) => void
  isCreativeMode: boolean
  setIsCreativeMode: (isCreativeMode: boolean) => void
  isGenerating: boolean
  contentParts: ContentPart
  setContentParts: React.Dispatch<React.SetStateAction<ContentPart>>
  storyBlocks: any[] | undefined
  createStory: any
  deleteAllBlocks: () => void
  deleteStoryBlock: any
  handleGenerate: () => Promise<void>
  handleGenerateSynopsis: () => Promise<void>
  handleGenerateCover: () => Promise<void>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleUploadClick: () => void
  handleContentChange: (newContent: string) => void
  handleCreateStory: () => void
  handleAddPart: () => void
  handleDeletePart: (index: number) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isPublishable: boolean
  shouldDisableConfig: boolean
}

const CreateStoryContext = createContext<CreateStoryContextType | undefined>(undefined)

export function CreateStoryProvider({ children }: { children: ReactNode }) {
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

  const { mutate: deleteAllBlocks } = useMutation(
    trpc.storyRouter.deleteAllStoryBlocks.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.storyRouter.getAllMyStoryBlocks.queryOptions())
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
      category: STORY_CATEGORY[selectedCategory - 1].name,
    })
  }, [contentParts, createStory, synopsis, title, coverImage, selectedCategory])

  const handleAddPart = () => {
    const newPart = {
      id: Date.now().toString(),
      order: contentParts.length + 1,
      content: '',
    }
    const newIndex = contentParts.length
    setContentParts([...contentParts, newPart])
    setCurrentPartIndex(newIndex)
  }

  const handleDeletePart = (index: number) => {
    if (contentParts.length === 1) return
    const updatedParts = contentParts.filter((_, i) => i !== index)
    setContentParts(updatedParts)
    setCurrentPartIndex(Math.max(0, Math.min(currentPartIndex, updatedParts.length - 1)))
  }

  const isPublishable =
    selectedCategory !== 0 &&
    storyBlocks?.length! > 0 &&
    title.length > 0 &&
    synopsis.length > 0 &&
    contentParts[currentPartIndex].content.length > 0

  const shouldDisableConfig = currentPartIndex > 0 && contentParts[0].content.length > 0

  return (
    <CreateStoryContext.Provider
      value={{
        title,
        setTitleState,
        customPrompt,
        setCustomPrompt,
        synopsis,
        setSynopsis,
        selectedCategory,
        setSelectedCategory,
        lang,
        setLang,
        coverImage,
        setCoverImage,
        isGeneratingCover,
        isUploading,
        isOpen,
        setIsOpen,
        currentPartIndex,
        setCurrentPartIndex,
        isCreativeMode,
        setIsCreativeMode,
        isGenerating,
        contentParts,
        setContentParts,
        storyBlocks,
        createStory,
        deleteAllBlocks,
        deleteStoryBlock,
        handleGenerate,
        handleGenerateSynopsis,
        handleGenerateCover,
        handleFileChange,
        handleUploadClick,
        handleContentChange,
        handleCreateStory,
        handleAddPart,
        handleDeletePart,
        fileInputRef,
        isPublishable,
        shouldDisableConfig,
      }}
    >
      {children}
    </CreateStoryContext.Provider>
  )
}

export function useCreateStoryContext() {
  const context = useContext(CreateStoryContext)
  if (context === undefined) {
    throw new Error('useCreateStoryContext must be used within a CreateStoryProvider')
  }
  return context
}
