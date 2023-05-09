import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { writeTextFile } from '@tauri-apps/api/fs'
import { Snippet, useSnippetStore } from '../store/snippetStore'
import { toast } from 'react-hot-toast'
import { lenguajes } from '../constants/lenguajes'

interface Props {
  snippet: Snippet
}

const SnippetEditor = ({ snippet }: Props) => {
  // ESTADOS
  const [text, setText] = useState<String | undefined>('')

  useEffect(() => {
    setText(snippet?.code)
  }, [snippet.path])

  // USE SNIPPET STORE
  const setSelectedSnippet = useSnippetStore((state) => state.setSelectedSnippet)
  const setSelectedsSnippets = useSnippetStore((state) => state.setSelectedsSnippets)
  const setIsSaved = useSnippetStore((state) => state.setIsSaved)

  const saveSnippet = async (text: String) => {
    await writeTextFile(snippet.path, `${text}`)
    toast.success(`Snippet ${snippet.name} guardado`)
    setIsSaved(true)
  }

  // EFECTO ESCAPE
  useEffect(() => {
    const handleEvents = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setText('')
        setSelectedSnippet(null)
        setSelectedsSnippets([])
      }
      if (e.ctrlKey && e.key === 's') {
        saveSnippet(text ?? '')
      }
    }

    window.addEventListener('keydown', handleEvents)

    return () => {
      window.removeEventListener('keydown', handleEvents)
    }
  }, [text])

  const handleTextChange = (value: string | undefined) => {
    setText(value)
    setIsSaved(false)
  }

  const leng = lenguajes[snippet.name.split('.')[1] as keyof typeof lenguajes] ?? 'plaintext'

  return (
    <Editor
      width={'100%'}
      height={'calc(100vh - 35px)'}
      theme='vs-dark'
      defaultLanguage={leng}
      language={leng}
      options={{ fontSize: 20, padding: { top: 10 } }}
      value={`${text}`}
      onChange={handleTextChange}
      loading={<img src='/icon.png' alt='logo' className='w-[60px] h-[60px] object-contain' />}
    />
  )
}

export default SnippetEditor
