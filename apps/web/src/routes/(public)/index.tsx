import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="absolute gap-2 w-full">
      <div className="min-h-screen w-full relative right-0 left-0 bottom-0 top-0 bg-black">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000',
          }}
        />
      </div>
    </div>
  )
}
