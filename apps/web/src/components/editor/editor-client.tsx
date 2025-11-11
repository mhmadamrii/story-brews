'use client'

import React from 'react'

const TipTapEditor = React.lazy(() => import('./index'))

export const EditorClient = ({ initialContent }: { initialContent: string }) => {
  return <TipTapEditor initialContent={initialContent} />
}
