const Intro = () => {
  return (
    <div className='text-center flex items-center justify-center flex-col gap-2 h-full'>
      <img src='/icon.png' alt='logo' className='w-[60px] h-[60px] object-contain' />
      <h1 className='text-4xl font-bold text-zinc-100'>Snippets</h1>

      <div className='py-10'>
        <p className='text-base font-semibold text-zinc-300 mb-3'>
          Crea un snippet{' '}
          <span className='text-base font-semibold text-zinc-300'>
            <kbd className='bg-slate-700 py-1 px-2 rounded-lg select-none'>
              <label htmlFor='snippetName' className='cursor-pointer'>
                Aquí
              </label>
            </kbd>
          </span>
        </p>

        <p className='text-base font-semibold text-zinc-300 mb-3'>
          Selecciona un snippet{' '}
          <span className='text-base font-semibold text-zinc-300'>
            <kbd className='bg-slate-700 py-1 px-2 rounded-lg'>Snippet</kbd> +{' '}
            <kbd className='bg-slate-700 py-1 px-2 rounded-lg'>Click</kbd>
          </span>
        </p>

        <p className='text-base font-semibold text-zinc-300 mb-3'>
          Presiona doble click para renombrar{' '}
          <span className='text-base font-semibold text-zinc-300'>
            <kbd className='bg-slate-700 py-1 px-2 rounded-lg'>Snippet</kbd>
          </span>
        </p>

        <p className='text-base font-semibold text-zinc-300 mb-3'>
          Presiona <kbd className='bg-slate-700 py-1 px-2 rounded-lg'>Esc</kbd> para cerrar todas
          los snippets
        </p>

        <p className='text-base font-semibold text-zinc-300'>
          Presiona <kbd className='bg-slate-700 py-1 px-2 rounded-lg'>Ctrl</kbd> +{' '}
          <kbd className='bg-slate-700 py-1 px-2 rounded-lg'>S</kbd> para Guardar
        </p>
      </div>

      <a
        href='https://whitecode.online'
        target='_blank'
        rel='referrer'
        className='text-base font-semibold text-blue-200 hover:text-blue-300 transition-all'
      >
        whitecode.online
      </a>
    </div>
  )
}

export default Intro
