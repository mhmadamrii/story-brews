import { Loader as LoaderIcon } from 'lucide-react'

export function Loader() {
  return (
    <div className="w-full flex justify-center items-center">
      <LoaderIcon className="animate-spin" />
    </div>
  )
}
