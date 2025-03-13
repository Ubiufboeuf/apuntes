import { client } from '@/db/client'
import { getSeccionByMateriaLink, nameToLink } from '@/lib/utils'
import { compareNotasFromDB } from '@/mocks/notas'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { Temporal } from 'temporal-polyfill'

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

    if (dbHasNota) {
      await client.execute({
        sql: `
          UPDATE notas
          SET notaAsText = ?,
              lastUpdate = ?
          WHERE id = ?
        `,
        args: [notaAsText, lastUpdate, id]
      })
    } else {
      await client.execute({
        sql: 'INSERT INTO notas(id, notaAsText, creationDate, lastUpdate, materiaName, notaName) VALUES(?, ?, ?, ?, ?, ?)',
        args: [id, notaAsText, creationDate, lastUpdate, materiaName, notaName]
      })
    }
  }

  return <BlockNoteView editor={editor} onChange={handleChange} />
}
