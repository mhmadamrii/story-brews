import { createContext, useContext, useState } from 'react'

type HeaderContextType = {
  title: string
  setTitle: (title: string) => void
  headerAction: React.ReactNode
  setHeaderAction: (action: React.ReactNode) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('Story Brew')
  const [headerAction, setHeaderAction] = useState<React.ReactNode>(null)

  return (
    <HeaderContext.Provider value={{ title, setTitle, headerAction, setHeaderAction }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}
