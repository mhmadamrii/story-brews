import { createFileRoute } from '@tanstack/react-router'
import { CreativeMode } from './-components/creative-mode'
import { CreateStoryProvider, useCreateStoryContext } from './-context/create-story-context'
import { StoryConfiguration } from './-components/story-configuration'
import { StoryBlockDialog } from './-components/story-block-dialog'
import { cn } from '@/lib/utils'
import { Button } from '@story-brew/ui/components/ui/button'
import { PencilLine } from 'lucide-react'
import { HeaderAction } from '@/components/header-portal'
import { StoryEditor } from './-components/story-editor'

export const Route = createFileRoute('/(main)/create-story/')({
  component: RouteComponent,
  staticData: {
    title: 'Story Editor',
  },
})

function RouteComponent() {
  return (
    <CreateStoryProvider>
      <CreateStoryContent />
    </CreateStoryProvider>
  )
}

function CreateStoryContent() {
  const {
    isOpen,
    setIsOpen,
    currentPartIndex,
    isCreativeMode,
    setIsCreativeMode,
    contentParts,
    storyBlocks,
    handleContentChange,
    handleCreateStory,
    isPublishable,
  } = useCreateStoryContext()

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
      <div
        className={cn('grid grid-cols-1 lg:grid-cols-12 gap-6 relative', {
          hidden: isCreativeMode,
        })}
      >
        <StoryConfiguration />
        <StoryEditor />
      </div>
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
