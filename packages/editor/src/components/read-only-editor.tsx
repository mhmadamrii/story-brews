'use client'

/* eslint-disable unicorn/no-null */
/* eslint-disable quotes */
import RichTextEditor, { BaseKit } from 'reactjs-tiptap-editor'

import { Bold } from 'reactjs-tiptap-editor/bold'
import { Clear } from 'reactjs-tiptap-editor/clear'
import { Color } from 'reactjs-tiptap-editor/color'
import { FontSize } from 'reactjs-tiptap-editor/fontsize'
import { FormatPainter } from 'reactjs-tiptap-editor/formatpainter'
import { Heading } from 'reactjs-tiptap-editor/heading'
import { Italic } from 'reactjs-tiptap-editor/italic'
import { TaskList } from 'reactjs-tiptap-editor/tasklist'
import { TextAlign } from 'reactjs-tiptap-editor/textalign'

import 'reactjs-tiptap-editor/style.css'
import '../style.css'

export function ReadOnlyEditor({ initialValue }: { initialValue: string }) {
  console.log('initialValue readonly', initialValue)

  const extensions = [
    BaseKit.configure({
      placeholder: {
        showOnlyCurrent: true,
      },
      characterCount: {
        limit: 50_000,
      },
    }),
    FormatPainter.configure({ spacer: true, toolbar: false }),
    Clear.configure({ toolbar: false }),
    Heading.configure({ spacer: true, toolbar: false }),
    FontSize.configure({ toolbar: false }),
    Bold.configure({ toolbar: false }),
    Italic.configure({ toolbar: false }),
    Color.configure({ spacer: true, toolbar: false }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      spacer: true,
      toolbar: false,
    }),
    TaskList.configure({
      spacer: true,
      toolbar: false,
      taskItem: {
        nested: true,
      },
    }),
  ]

  return (
    <RichTextEditor
      output="html"
      content={initialValue}
      extensions={extensions}
      dark
      disabled
      toolbar={{
        render(props, toolbarItems, dom, containerDom) {
          return ''
        },
      }}
    />
  )
}
