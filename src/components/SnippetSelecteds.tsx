import { useSnippetStore } from '../store/snippetStore'
import SelectedItem from './SelectedItem'

const SnippetSelecteds = () => {
  const selectedsSnippets = useSnippetStore((state) => state.selectedsSnippets)
  return (
    <div className='w-full'>
      <div className='sticky top-0 z-10 flex items-center justify-start w-full bg-zinc-900 overflow-auto scroll-1'>
        {selectedsSnippets.map((snippet) => (
          <SelectedItem key={snippet.path} snippet={snippet} />
        ))}
      </div>
    </div>
  )
}

export default SnippetSelecteds
