import { useState } from 'react'
import { Snippet, useSnippetStore } from '../store/snippetStore'
import { twMerge } from 'tailwind-merge'
import { readTextFile } from '@tauri-apps/api/fs'
import { FiX } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

interface Props {
  snippet: Snippet
}

const SelectedItem = ({ snippet }: Props) => {
  // ESTADOS
  const [isHover, setIsHover] = useState<boolean>(false)

  // USE SNIPPET STORE
  const selectedsSnippets = useSnippetStore((state) => state.selectedsSnippets)
  const selectedSnippet = useSnippetStore((state) => state.selectedSnippet)
  const setSelectedSnippet = useSnippetStore((state) => state.setSelectedSnippet)
  const removeSelectedsSnippets = useSnippetStore((state) => state.removeSelectedsSnippets)
  const isSaved = useSnippetStore((state) => state.isSaved)

  // ButtonClose
  const ButtonClose = () => (
    <button
      className='text-zinc-400 hover:bg-red-500  hover:text-white active:scale-90 transition-all rounded-full w-[25px] h-[25px] flex items-center justify-center'
      onClick={async (e) => {
        e.stopPropagation()

        if (!isSaved) {
          toast(
            `Guarda el snippet antes de ${
              selectedSnippet?.path !== snippet.path ? 'cambiar de snippet' : 'cerrar el snippet'
            }`,
            {
              icon: '⚠️'
            }
          )
        } else {
          removeSelectedsSnippets(snippet)
          const snippetsActuales = selectedsSnippets.filter((s) => s.path !== snippet.path)
          if (snippetsActuales.length === 0) {
            setSelectedSnippet(null)
          } else {
            const snippetUltimo = snippetsActuales[snippetsActuales.length - 1]
            const readSnippet = await readTextFile(snippetUltimo.path)
            setSelectedSnippet({ ...snippetUltimo, code: readSnippet })
          }
        }
      }}
    >
      <FiX className='block w-[16px] h-[16px]' />
    </button>
  )

  return (
    <div
      className={twMerge(
        'flex items-center border-r border-r-zinc-800 gap-4 py-2 pl-5 pr-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all cursor-pointer select-none',
        snippet.name === selectedSnippet?.name ? 'bg-zinc-700 text-white' : ''
      )}
      onClick={async () => {
        if (!isSaved) {
          if (selectedSnippet?.path !== snippet.path) {
            toast('Guarda el snippet actual antes de cambiar de snippet', {
              icon: '⚠️'
            })
          }
        } else {
          const readSnippet = await readTextFile(snippet.path)
          setSelectedSnippet({ ...snippet, code: readSnippet })
        }
      }}
    >
      <span className='text-base font-bold truncate'>{snippet.name}</span>

      <div
        className='w-[25px] h-[25px] flex items-center justify-center'
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {isHover ? (
          <ButtonClose />
        ) : selectedSnippet?.path == snippet.path && !isSaved ? (
          <div className='bg-white rounded-full w-3 h-3' />
        ) : (
          <ButtonClose />
        )}
      </div>
    </div>
  )
}

export default SelectedItem
