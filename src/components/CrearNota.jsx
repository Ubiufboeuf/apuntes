/* eslint-disable react/prop-types */

import { saveNewNota, verifyExistNota } from '@/db/client'
import { getSeccionByMateriaLink, nameToLink } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import { Temporal } from 'temporal-polyfill'

const options = [
  {
    group: 'Matemáticas',
    opciones: ['Matemática CTS', 'Cálculo', 'Física Mecánica Cĺasica']
  },
  {
    group: 'Humanidades y Ciencias Sociales',
    opciones: ['Inglés', 'Filosofía', 'Sociología']
  },
  {
    group: 'Informática',
    opciones: ['Programación Full Stack', 'Ingeniería de Software', 'Administración de Sistemas Operativos', 'Inteligencia Artificial']
  },
  {
    group: 'Proyectos y Negocios',
    opciones: ['Tutoría Proyecto UTULAB', 'Emprendurismo y Gestión']
  }
]

const materias = ['Matemática CTS', 'Cálculo', 'Física Mecánica Cĺasica', 'Inglés', 'Filosofía', 'Sociología', 'Programación Full Stack', 'Ingeniería de Software', 'Administración de Sistemas Operativos', 'Inteligencia Artificial', 'Tutoría Proyecto UTULAB', 'Emprendurismo y Gestión']

export function CrearNota ({ _notaName, _materiaName }) {
  const notaNameRef = useRef()
  const materiaSelectRef = useRef()
  const msgRef = useRef()

  useEffect(() => {
    const url = new URL(window.location.href)
    const existNota = url.searchParams.get('existNota')
    if (!existNota) {
      checkIfNotaExist()
    }
  }, [])

  async function checkIfNotaExist() {
    const materiaName = materiaSelectRef.current.selectedOptions[0].value
    const notaName = notaNameRef.current.value || _notaName
    const id = `${nameToLink(getSeccionByMateriaLink(nameToLink(materiaName)) || '')}/${nameToLink(materiaName)}/${encodeURIComponent(notaName)}`
    const existNota = await verifyExistNota(id)
    if (existNota) {
      window.location.search = `materiaName=${materiaName}&notaName=${notaName}&existNota=true`
    }
  }

  async function crearNota () {
    msgRef.current.textContent = ''

    const notaAsText = ''
    const creationDate = Temporal.Now.instant().toString()
    const lastUpdate = creationDate
    const materiaName = materiaSelectRef.current.selectedOptions[0].value
    const notaName = notaNameRef.current.value || _notaName
    const id = `${nameToLink(getSeccionByMateriaLink(nameToLink(materiaName)) || '')}/${nameToLink(materiaName)}/${encodeURIComponent(notaName)}`
    if (materiaName === 'default') { 
      msgRef.current.textContent = 'Materia inválida'
      return
    }
    await saveNewNota({ id, notaAsText, creationDate, lastUpdate, materiaName, notaName })
    
  }

  return (
    <>
      <input
        id='input_nota_name'
        ref={notaNameRef}
        placeholder={`Nota por defecto: ${_notaName}`}
        className='h-14 mb-2 text-xl px-7 font-bold focus:outline-0 focus:border-accent-primary border border-transparent transition-colors [&:hover:not(&:focus)]:bg-secondary rounded-xl'
      />
      <select
        ref={materiaSelectRef}
        className='h-10 mb-6 max-w-96 [&:hover:not(&:focus)]:bg-secondary rounded-xl transition-colors px-7 focus:outline-0 border border-transparent focus:border-accent-primary [&>*]:bg-secondary'
        defaultValue={materias.includes(_materiaName) ? _materiaName : 'default'}
      >
        <option value='default' disabled>Selecciona una materia</option>
        {
          options.map(option => (
            <optgroup key={crypto.randomUUID()} label={option.group}>
              {
                option.opciones.map(op => <option key={crypto.randomUUID()} value={op}>{op}</option>)
              }
            </optgroup>
          ))
        }
      </select>
      <button
        className='w-fit px-8 mb-6 hover:bg-secondary active:bg-primary h-10 rounded-xl cursor-pointer focus:outline-0 focus:border-accent-primary border border-transparent transition-colors'
        onClick={crearNota}
      >
        Crear nota
      </button>
      <p
        ref={msgRef}
        className='text-red-500 px-8'
      />
    </>
  )
}
