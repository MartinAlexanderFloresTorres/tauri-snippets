import { useEffect } from 'react'
import { readDir } from '@tauri-apps/api/fs'
import { desktopDir, join } from '@tauri-apps/api/path'
import { Snippet, useSnippetStore } from '../store/snippetStore'
import SnippetItem from './SnippetItem'

const SnippetList = () => {
  // useSnippetStore
  const setSnippets = useSnippetStore((state) => state.setSnippets)
  const snippets = useSnippetStore((state) => state.snippets)

  // Obtener los snippets
  useEffect(() => {
    const getSnippets = async () => {
      try {
        const path = await desktopDir()
        const snippets = await readDir(await join(path, 'snippets'))
        setSnippets(snippets as Snippet[])
      } catch (error) {}
    }
    getSnippets()
  }, [])

  return (
    <div>
      {snippets.map((snippet) => (
        <SnippetItem key={snippet.name} snippet={snippet} />
      ))}
    </div>
  )
}

export default SnippetList
