import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

export function HeaderAction({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const root = document.getElementById('header-action-root')

  if (!mounted || !root) return null

  return createPortal(children, root)
}
