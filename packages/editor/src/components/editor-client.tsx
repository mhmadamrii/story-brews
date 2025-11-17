'use client'

import React from 'react'

const TipTapEditor = React.lazy(() => import('./editor'))

export const EditorClient = ({ initialContent }: { initialContent: string }) => {
  return <TipTapEditor initialContent={initialContent} />
}
