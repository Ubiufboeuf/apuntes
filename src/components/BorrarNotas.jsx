/* eslint-disable react/prop-types */
import { IconDelete } from '@/components/Icons'
import { useRef, useState } from 'react'
import { borrarNotaConNotaName } from '@/db/client'

export function BorrarNotas ({ notas }) {
  const dialogRef = useRef()
  const [notaName, setNotaName] = useState()

  const borrarNota = (_notaName) => () => {
    setNotaName(_notaName)
    dialogRef.current.classList.add('dialogActive')
  }

  async function borrarNotaConfirmado () {
    borrarNotaConNotaName({ notaName }).then(() => {
      window.location.reload()
    })
  }

  function handleCloseDialog (event) {
    const { target, currentTarget } = event
    if (target !== currentTarget) return
    dialogRef.current.classList.remove('dialogActive')
  }

  function handleCloseDialogFromBtn () {
    dialogRef.current.classList.remove('dialogActive')
  }

  return (
    <>
      <dialog
        ref={dialogRef}
        className='h-screen w-screen absolute left-0 top-0 hidden [&.dialogActive]:flex items-center justify-center backdrop-blur-md bg-transparent'
        onClick={handleCloseDialog}
      >
        <div className='h-72 min-h-fit w-lg flex flex-col bg-secondary rounded-xl p-4 px-6 gap-2'>
          <h2 className='text-lg text-secondary-content'>Borrar nota</h2>
          <h1 className='text-xl font-bold text-primary-content break-all text-pretty'>Nota: {notaName}</h1>
          <div className='w-full h-full flex flex-1 items-center justify-center gap-6'>
            <button
              className='btnCancel h-12 w-32 cursor-pointer bg-tertiary transition-colros focus:outline-0 border border-transparent focus:border-accent-primary rounded-xl'
              onClick={handleCloseDialogFromBtn}
            >
              Cancelar
            </button>
            <button
              className='h-12 w-32 cursor-pointer bg-red-600 transition-colros focus:outline-0 border border-transparent focus:border-accent-primary rounded-xl'
              onClick={borrarNotaConfirmado}
            >
              ¿Seguro?
            </button>
          </div>
        </div>
      </dialog>
      <div className='flex flex-col gap-2'>
        {
          notas && notas.length > 0 ? (
            notas.map((nota, idx) => (
              <article key={`borrarnotas-${nota.notaName}-${idx}`} className='w-fit flex gap-2 px-4 h-full items-center'>
                <button
                  className='size-7 min-h-7 min-w-7 sm:min-w-10 sm:min-h-10 sm:size-10 bg-secondary hover:bg-red-600 transition-colors rounded sm:rounded-lg flex items-center justify-center'
                  onClick={borrarNota(nota.notaName)}
                >
                  <div className='size-4 sm:size-6'>
                    <IconDelete />
                  </div>
                </button>
                <span className='w-fit md:line-clamp-2 line-clamp-3' title={nota.notaName}>{nota.notaName}</span>
              </article>
            ))
          ) : (
            <span className='text-secondary-content'>No hay notas</span>
          )
        }
      </div>
    </>
  )
}
