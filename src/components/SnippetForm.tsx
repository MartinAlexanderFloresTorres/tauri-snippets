import { useState } from 'react'
import { writeTextFile } from '@tauri-apps/api/fs'
import { desktopDir, join } from '@tauri-apps/api/path'
import { useSnippetStore } from '../store/snippetStore'
import { toast } from 'react-hot-toast'

const SnippetForm = () => {
  // ESTADOS
  const [snippetName, setSnippetName] = useState<string>('')

  // USE SNIPPET STORE
  const addSnippet = useSnippetStore((state) => state.addSnippet)
  const snippets = useSnippetStore((state) => state.snippets)

  // HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!snippetName) return toast('Debes escribir un nombre para el snippet', { icon: '⚠️' })

    if (snippetName.includes(' '))
      return toast('El nombre del snippet no puede contener espacios', { icon: '⚠️' })

    if (snippetName.length > 20)
      return toast('El nombre del snippet no puede contener más de 20 caracteres', { icon: '⚠️' })

    // Verificar si el snippet ya existe
    const snippetExists = snippets.find((snippet) => snippet.name.trim() === snippetName.trim())

    if (snippetExists) return toast('El snippet ya existe', { icon: '⚠️' })

    // Obtener el path del escritorio
    const path = await desktopDir()

    // Crear el snippet
    const snippet = { name: snippetName, path: await join(path, 'snippets', snippetName) }

    // Crear el archivo
    await writeTextFile(snippet.path, ``)

    // Agregar el snippet al store
    addSnippet(snippet)

    // Limpiar el input
    setSnippetName('')
  }

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <input
        className='bg-neutral-950 p-4 w-full outline-none border border-neutral-800 placeholder-neutral-500 focus:placeholder-neutral-200 text-neutral-200'
        type='text'
        value={snippetName}
        onChange={(e) => setSnippetName(e.target.value)}
        id='snippetName'
        placeholder='Crea un snippet.js'
      />
    </form>
  )
}

export default SnippetForm
