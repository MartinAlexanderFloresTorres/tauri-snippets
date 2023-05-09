import { useState } from 'react'
import { readTextFile, writeTextFile, removeFile } from '@tauri-apps/api/fs'
import { twMerge } from 'tailwind-merge'
import { toast } from 'react-hot-toast'
import { FiTrash, FiEdit, FiFile } from 'react-icons/fi'
import { Snippet, useSnippetStore } from '../store/snippetStore'
import Swal from 'sweetalert2'

interface Props {
  snippet: Snippet
}

const SnippetItem = ({ snippet }: Props) => {
  // ESTADOS
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>(snippet.name)
  const [isHover, setIsHover] = useState<boolean>(false)

  // USE SNIPPET STORE
  const selectedsSnippets = useSnippetStore((state) => state.selectedsSnippets)
  const addSelectedsSnippets = useSnippetStore((state) => state.addSelectedsSnippets)
  const setSelectedSnippet = useSnippetStore((state) => state.setSelectedSnippet)
  const selectedSnippet = useSnippetStore((state) => state.selectedSnippet)
  const removeSnippet = useSnippetStore((state) => state.removeSnippet)
  const editSnippet = useSnippetStore((state) => state.editSnippet)

  const removeSelectedsSnippets = useSnippetStore((state) => state.removeSelectedsSnippets)
  const setSelectedsSnippets = useSnippetStore((state) => state.setSelectedsSnippets)
  const isSaved = useSnippetStore((state) => state.isSaved)
  const setIsSaved = useSnippetStore((state) => state.setIsSaved)

  // handleDelete
  const handleDelete = async (snippet: Snippet): Promise<void> => {
    if (!isSaved && selectedSnippet?.path !== snippet.path) {
      toast(`Guarda los cambios antes de eliminar`, {
        icon: '⚠️'
      })
      return
    }

    Swal.fire({
      title: 'Eliminar snippet',
      text: '¿Estás seguro de eliminar este snippet? Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Eliminar el archivo
        await removeFile(snippet.path)

        // Eliminar el snippet de la lista
        setSelectedSnippet(null)

        // Eliminar el snippet de la lista
        removeSnippet(snippet)

        // Eliminar el snippet de la lista de seleccionados
        removeSelectedsSnippets(snippet)

        // Resetear el estado de guardado
        setIsSaved(true)

        // Mostrar notificación
        toast.success(`Snippet ${snippet.name} eliminado`)
      }
    })
  }

  // handleRename
  const handleRename = async (snippet: Snippet): Promise<void> => {
    if (!selectedSnippet) return

    // Renombrar el archivo
    await removeFile(snippet.path)

    // Renombrar el snippet
    const path = snippet.path.replace(snippet.name, newName)

    // Guardar el archivo con el nuevo nombre
    await writeTextFile(path, `${selectedSnippet.code}`)

    // Editar el snippet
    editSnippet({ name: newName, path }, snippet.path)

    // Editar el snippet seleccionado
    const newSelectedsSnippets = selectedsSnippets.map((s) => {
      if (s.path === snippet.path) {
        return { ...s, name: newName, path }
      }
      return s
    })

    setSelectedsSnippets(newSelectedsSnippets)

    // Seleccionar el snippet renombrado
    setSelectedSnippet({ ...selectedSnippet, name: newName, path })

    // Mostrar notificación
    toast.success(`Snippet renombrado`)
  }

  const handleClickSnippet = async (
    e: React.MouseEvent<HTMLDivElement>,
    snippet: Snippet
  ): Promise<void> => {
    if (!isSaved && selectedSnippet?.path !== snippet.path) {
      toast(`Guarda el snippet antes de  cambiar de snippet`, {
        icon: '⚠️'
      })
    } else {
      addSelectedsSnippets(snippet)

      const readSnippet = await readTextFile(snippet.path)
      setSelectedSnippet({ ...snippet, code: readSnippet })

      const target = e.target as HTMLElement

      if (
        target.tagName !== 'INPUT' &&
        target.tagName !== 'SPAN' &&
        target.tagName !== 'BUTTON' &&
        target.tagName !== 'svg'
      ) {
        setIsEditing(false)
      }
    }
  }
  return (
    <div
      className={twMerge(
        'outline-none border-b border-b-zinc-800 px-4 h-[50px] cursor-pointer hover:bg-zinc-800 transition-colors active:bg-zinc-900 select-none text-sm font-semibold flex items-center justify-between gap-2',
        snippet.name === selectedSnippet?.name ? 'bg-zinc-700' : ''
      )}
      onClick={(e) => handleClickSnippet(e, snippet)}
      onDoubleClick={(e) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <FiFile className='w-5 h-5 block min-h-min min-w-min text-zinc-300' />

      {isEditing && snippet.path === selectedSnippet?.path ? (
        <form
          className='block w-full select-none'
          onSubmit={(e) => {
            e.preventDefault()
            setIsEditing(false)
            handleRename(snippet)
          }}
        >
          <input
            type='text'
            className='w-full px-2 py-1 block outline-none select-none border rounded border-zinc-400 bg-transparent text-sm font-semibold text-white'
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </form>
      ) : (
        <span className='text-zinc-400 truncate w-full'>{snippet.name}</span>
      )}

      {(selectedSnippet?.path === snippet.path || isHover) && (
        <div className='flex items-center w-fit gap-1'>
          {(!isHover || selectedSnippet?.path === snippet.path) && (
            <button
              className='text-zinc-400 hover:bg-zinc-700 hover:text-white active:scale-90 transition-all rounded-full w-[30px] h-[30px] flex items-center justify-center'
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(!isEditing)
              }}
            >
              <FiEdit />
            </button>
          )}

          <button
            className='text-zinc-400 hover:bg-zinc-700 hover:text-white active:scale-90 transition-all rounded-full w-[30px] h-[30px] flex items-center justify-center'
            onClick={async (e) => {
              e.stopPropagation()
              handleDelete(snippet)
            }}
          >
            <FiTrash className='block w-[15px] h-[15px]' />
          </button>
        </div>
      )}
    </div>
  )
}

export default SnippetItem
