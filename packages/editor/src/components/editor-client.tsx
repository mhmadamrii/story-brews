'use client'

import React from 'react'

const TipTapEditor = React.lazy(() => import('./editor'))

export const EditorClient = ({
  initialContent,
  onChange,
}: {
  initialContent: string
  onChange: (content: string) => void
}) => {
  return <TipTapEditor initialContent={initialContent} onChange={onChange} />
}
