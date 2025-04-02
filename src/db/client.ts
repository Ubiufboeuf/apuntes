import { getMateriaByLink, getSeccionByMateriaLink, nameToLink } from '@/lib/utils'
import { descomprimirTexto } from '@/lib/zip'
import { createClient } from '@libsql/client'

type DBNota = {
  id: string
  notaAsText: string
  creationDate: string
  lastUpdate: string
  materiaName: string
  notaName: string
}

const url = import.meta.env.PUBLIC_DB_URL
const authToken = import.meta.env.PUBLIC_DB_AUTH_TOKEN

// export const client = createClient({ url, authToken })
export const client = createClient({ url: 'http://127.0.0.1:8080' })
// const serverURL = 'http://localhost:1234'

export async function getNotaContent ({ id }: { id: string }) {
  const { rows } = await client.execute('SELECT * FROM notas')
  const row = rows.find(r => r.id == id)
  if (!row) return
  const initialContent = JSON.parse(row?.notaAsText?.toString() || '[{}]')
  // return [initialContent, row?.notaAsBlob]
  return initialContent
}

export async function saveNewNota ({ id, notaAsText, creationDate, lastUpdate, materiaName, notaName }: DBNota) {
  await client.execute({
    sql: 'INSERT INTO notas(id, notaAsText, creationDate, lastUpdate, materiaName, notaName) VALUES(?, ?, ?, ?, ?, ?)',
    args: [id, notaAsText, creationDate, lastUpdate, materiaName, notaName]
  })
}

export async function saveNotaContent ({ notaAsText, lastUpdate, id, notaBlob }: { notaAsText: string, lastUpdate: string, id: string, notaBlob: string }) {
  await client.execute({
    sql: `
      UPDATE notas
      SET notaAsText = ?,
          lastUpdate = ?,
          notaAsBlob = ?
      WHERE id = ?
    `,
    args: [notaAsText, lastUpdate, notaBlob, id]
  })
}

export async function verifyExistNota (id: string) {
  const { rows } = await client.execute({
    sql: 'SELECT id FROM notas WHERE id = ?',
    args: [id]
  })
  console.log('exist',rows)
  return !!rows[0]
}

export async function verifyExistNotaStrictless ({ materiaName, notaName }: { materiaName: string, notaName: string }) {
  console.log({ materiaName, notaName })
  try {
    const { rows } = await client.execute({
      sql: 'SELECT id FROM notas WHERE materiaName = ? AND notaName = ?',
      args: [materiaName, notaName]
    })
    console.log('existstrictless',rows)
    console.log(!!rows[0])
    return !!rows[0]
  } catch {
    console.error('Error verificando si existe la nota strictless')
    return false
  }
}

export async function getNotasFromDBByMateriaLink (materiaLink: string) {
  const materiaName = getMateriaByLink(materiaLink)
  if (!materiaName) return
  const { rows } = await client.execute({
    sql: 'SELECT id, notaName, lastUpdate FROM notas WHERE materiaName = ?',
    args: [materiaName]
  })
  return rows
}

export async function getNotasFromDBByMateriaName (materiaName: string) {
  if (!materiaName) return
  const { rows } = await client.execute({
    sql: 'SELECT notaName FROM notas WHERE materiaName = ?',
    args: [materiaName]
  })
  return rows
}

export async function getNotaPrevNext ({ materiaName }: { materiaName: string }) {
  const { rows } = await client.execute({
    sql: 'SELECT id, notaName, lastUpdate FROM notas WHERE materiaName = ?',
    args: [materiaName]
  })
  return rows
}

export async function borrarNotaConNotaName ({ notaName }: { notaName: string }) {
  await client.execute({
    sql: 'DELETE FROM notas WHERE notaName = ?',
    args: [notaName]
  })
  return
}

export async function renombrarNotaConId ({ currentId, newName }: { currentId: string, newName: string }) {
  if (!newName) return
  const partsCurrentId = currentId.split('/')
  const newId = `${nameToLink(partsCurrentId[0])}/${nameToLink(partsCurrentId[1])}/${encodeURIComponent(newName)}`
  await client.execute({
    sql: `
      UPDATE notas
      SET notaName = ?,
          id = ?
      WHERE id = ?
      AND NOT EXISTS (SELECT 1 FROM notas WHERE id = ?);
    `,
    args: [newName, newId, currentId, newId]
  })
  return
}

export async function moverNotaDeMateria ({ currentId, newMateria }: { currentId: string, newMateria: string }) {
  console.log({newMateria})
  if (!newMateria) return
  const partsCurrentId = currentId.split('/')
  const newSeccion = nameToLink(getSeccionByMateriaLink(nameToLink(newMateria)) || '')
  const newId = `${newSeccion}/${nameToLink(newMateria)}/${encodeURIComponent(partsCurrentId[2])}`
  console.log({currentId, newId, newMateria})
  await client.execute({
    sql: `
      UPDATE notas
      SET materiaName = ?,
          id = ?
      WHERE id = ?
      AND NOT EXISTS (SELECT 1 FROM notas WHERE id = ?);
    `,
    args: [newMateria, newId, currentId, newId]
  })
  return
}

export async function compareNotasFromDB ({ notaFullLink, materiaName }: { notaFullLink: string, materiaName: string }) {
  const { rows } = await client.execute({
    sql: 'SELECT id FROM notas WHERE id = ? AND materiaName = ?',
    args: [notaFullLink, materiaName]
  })
  return rows.length > 0
}
