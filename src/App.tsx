import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { createDir } from '@tauri-apps/api/fs'
import { desktopDir, join } from '@tauri-apps/api/path'
import { useSnippetStore } from './store/snippetStore'
import SnippetForm from './components/SnippetForm'
import SnippetList from './components/SnippetList'
import SnippetEditor from './components/SnippetEditor'
import SnippetSelecteds from './components/SnippetSelecteds'
import Intro from './components/Intro'

const App = () => {
  // USE SNIPPET STORE
  const selectedSnippet = useSnippetStore((state) => state.selectedSnippet)

  // Efecto para crear la carpeta snippets
  useEffect(() => {
    const initApp = async () => {
      const path = await desktopDir()
      // Crear la carpeta snippets
      try {
        await createDir(await join(path, 'snippets'))
      } catch (error) {}
    }
    initApp()
  }, [])

  return (
    <>
      <div className='h-screen scroll-auto text-white grid grid-cols-12'>
        <div className='col-span-3 bg-zinc-900 w-full overflow-auto'>
          <div className='sticky top-0'>
            <SnippetForm />
            <SnippetList />
          </div>
        </div>

        <div className='col-span-9 bg-neutral-950 overflow-hidden select-none'>
          <SnippetSelecteds />

          {selectedSnippet ? <SnippetEditor snippet={selectedSnippet} /> : <Intro />}
        </div>
      </div>

      <Toaster
        position='bottom-right'
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: 14,
            border: '1px solid #3d3d3d',
            color: '#fff',
            background: '#2c2c2c'
          }
        }}
      />
    </>
  )
}

export default App
