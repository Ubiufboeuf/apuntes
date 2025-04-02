/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { IconReplace } from './Icons'
import { getSeccionByMateriaLink, nameToLink } from '@/lib/utils'
import { materias, options } from './CrearNota'
import { moverNotaDeMateria } from '@/db/client'

export function MoverNotas ({ notas }) {
  const dialogRef = useRef()
  const materiaSelectRef = useRef()
  const [notaName, setNotaName] = useState()
  const [materiaName, setMateriaName] = useState()

  useEffect(() => {
    const url = new URL(window.location.href)
    const materiaName = url.searchParams.get('materiaName')
    setMateriaName(materiaName)
  }, [])

  const moverNota = (_notaName) => () => {
    setNotaName(_notaName)
    dialogRef.current.classList.add('dialogActive')
  }

  async function moverNotaConfirmado () {
    if (!materiaSelectRef.current) return
    const newName = materiaSelectRef.current.selectedOptions[0].value
    if (!newName) return
    console.log('llegó')
    const url = new URL(window.location.href)
    const materiaName = url.searchParams.get('materiaName')
    const materiaLink = nameToLink(materiaName)
    const currentId = `${nameToLink(getSeccionByMateriaLink(materiaLink))}/${materiaLink}/${encodeURIComponent(notaName)}`
    moverNotaDeMateria({ currentId, newMateria: newName }).then(() => {
      // window.location.reload()
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
          <h2 className='text-lg text-secondary-content'>Mover nota</h2>
          <h2 className='text-lg text-secondary-content'>Nota: {notaName}</h2>
          <h1 className='text-xl font-bold text-primary-content break-all text-pretty'>Materia: {materiaName}</h1>
          <p className='text-secondary-content'>La nueva materia es: </p>
          <select
            ref={materiaSelectRef}
            className='h-10 mb-6 max-w-96 [&:hover:not(&:focus)]:bg-secondary rounded-xl transition-colors px-2 focus:outline-0 border border-transparent focus:border-accent-primary [&>*]:bg-secondary'
            defaultValue={materias.includes(materiaName) ? materiaName : 'default'}
          >
            <option value='default' disabled>Selecciona una materia</option>
            {
              options.map((option, idx) => (
                <optgroup key={`movernotas-${option.group}-${idx}-group`} label={option.group}>
                  {
                    option.opciones.map((op, i) => <option key={`movernotas-${op}-${i}-${idx}-${option.group}-group`} value={op}>{op}</option>)
                  }
                </optgroup>
              ))
            }
          </select>
          <div className='w-full h-full flex flex-1 items-center justify-center gap-6'>
            <button
              className='btnCancel h-12 w-32 cursor-pointer bg-tertiary transition-colros focus:outline-0 border border-transparent focus:border-accent-primary rounded-xl'
              onClick={handleCloseDialogFromBtn}
            >
              Cancelar
            </button>
            <button
              className='h-12 w-32 cursor-pointer bg-accent-tertiary transition-colros focus:outline-0 border border-transparent focus:border-accent-primary rounded-xl'
              onClick={moverNotaConfirmado}
            >
              ¿Seguro?
            </button>
          </div>
        </div>
      </dialog>
      <div className='flex flex-col gap-2'>
        {
          notas.map((nota, idx) => {
            return (
              <article key={`renombrarnotas-${nota.notaName}-${idx}`} className='w-fit flex gap-2 px-4 h-full items-center'>
                <button
                  className='size-7 min-h-7 min-w-7 sm:min-w-10 sm:min-h-10 sm:size-10 bg-secondary hover:bg-neutral-700 transition-colors rounded sm:rounded-lg flex items-center justify-center'
                  onClick={moverNota(nota.notaName)}
                >
                  <div className='size-4 sm:size-6'>
                    <IconReplace />
                  </div>
                </button>
                <span className='w-fit md:line-clamp-2 line-clamp-3' title={nota.notaName}>{nota.notaName}</span>
              </article>
            )
          })
        }
      </div>
    </>
  )
}
