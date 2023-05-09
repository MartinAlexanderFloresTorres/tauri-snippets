import { create } from 'zustand'

export type Snippet = {
  name: string
  path: string
  code?: string
}

export interface SnippetStore {
  snippets: Snippet[]
  setSnippets: (snippet: Snippet[]) => void
  addSnippet: (snippet: Snippet) => void
  removeSnippet: (snippet: Snippet) => void
  editSnippet: (snippet: Snippet, path: String) => void

  selectedSnippet: Snippet | null
  setSelectedSnippet: (snippet: Snippet | null) => void

  selectedsSnippets: Snippet[] | []
  removeSelectedsSnippets: (snippet: Snippet) => void
  addSelectedsSnippets: (snippet: Snippet) => void
  setSelectedsSnippets: (snippets: Snippet[] | []) => void

  isSaved: boolean
  setIsSaved: (isSaved: boolean) => void
}

export const useSnippetStore = create<SnippetStore>((set) => ({
  snippets: [],
  setSnippets: (snippets) => set({ snippets }),
  addSnippet: (snippet) => set((state) => ({ snippets: [...state.snippets, snippet] })),
  removeSnippet: (snippet) =>
    set((state) => ({ snippets: state.snippets.filter((s) => s.path !== snippet.path) })),
  editSnippet: (newSnippet, path) =>
    set((state) => ({
      snippets: state.snippets.map((s) => (s.path === path ? newSnippet : s))
    })),
  selectedSnippet: null,
  setSelectedSnippet: (snippet) => {
    set({ selectedSnippet: snippet })
  },
  selectedsSnippets: [],
  removeSelectedsSnippets: (snippet) =>
    set((state) => ({
      selectedsSnippets: state.selectedsSnippets.filter((s) => s.path !== snippet.path)
    })),

  addSelectedsSnippets: (snippet) =>
    set((state) => {
      const alreadySelected = state.selectedsSnippets.find((s) => s.path === snippet.path)
      if (alreadySelected) return state
      return { selectedsSnippets: [...state.selectedsSnippets, snippet] }
    }),
  setSelectedsSnippets: (snippets) => set({ selectedsSnippets: snippets }),

  isSaved: true,
  setIsSaved: (isSaved) => set({ isSaved })
}))
