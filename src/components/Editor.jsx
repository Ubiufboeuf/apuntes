import { saveNewNota, saveNotaContent } from '@/db/client'
import { getSeccionByMateriaLink, nameToLink } from '@/lib/utils'
import { compareNotasFromDB } from '@/db/client'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { Temporal } from 'temporal-polyfill'
import { comprimirTexto } from '@/lib/zip'

async function uploadFile(file) {
  const body = new FormData()
  body.append('file', file)
 
  const options = { method: 'POST', body }
  const ret = await fetch('https://tmpfiles.org/api/v1/upload', options)
  return (await ret.json()).data.url.replace(
    'tmpfiles.org/',
    'tmpfiles.org/dl/'
  )
}

/* eslint-disable react/prop-types */
export function Editor({ initialContent, materiaName, notaName }) {
  const editor = useCreateBlockNote({ initialContent, uploadFile })
  const id = `${nameToLink(getSeccionByMateriaLink(nameToLink(materiaName)) || '')}/${nameToLink(materiaName)}/${encodeURIComponent(notaName)}`

  async function handleChange (event) {
    const notaAsText = JSON.stringify(event.document)
    const creationDate = Temporal.Now.instant().toString()
    const lastUpdate = Temporal.Now.instant().toString()

    const dbHasNota = await compareNotasFromDB({ materiaName, notaFullLink: id })

    const contenidoComprimido = comprimirTexto(notaAsText)
    if (dbHasNota) {
      await saveNotaContent({ id, lastUpdate, notaAsText, notaBlob: contenidoComprimido })
    } else {
      await saveNewNota({ creationDate, id, lastUpdate, materiaName, notaAsText, notaName, notaAsBlob: contenidoComprimido })
    }
  }

  return <BlockNoteView editor={editor} onChange={handleChange} />
}
