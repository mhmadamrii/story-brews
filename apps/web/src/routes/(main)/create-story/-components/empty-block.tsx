import { List } from 'lucide-react'

export function EmptyBlock() {
  return (
    <div className="w-full h-[180px] flex flex-col justify-center items-center gap-2">
      <List />
      <h1 className="text-muted-foreground">There is no block story yet</h1>
    </div>
  )
}
