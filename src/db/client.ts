import { getMateriaByLink } from '@/lib/utils'
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

export const client = createClient({ url, authToken })

export async function getNotaContent ({ notaName, materiaName }: { notaName: string, materiaName: string }) {
  const { rows } = await client.execute('SELECT * FROM notas')
  const row = rows.find(r => r.notaName == notaName && r.materiaName == materiaName)
  const initialContent = JSON.parse(row?.notaAsText?.toString() || '[{}]')
  return initialContent
}

export async function saveNewNota ({ id, notaAsText, creationDate, lastUpdate, materiaName, notaName }: DBNota) {
  client.execute({
    sql: 'INSERT INTO notas(id, notaAsText, creationDate, lastUpdate, materiaName, notaName) VALUES(?, ?, ?, ?, ?, ?)',
    args: [id, notaAsText, creationDate, lastUpdate, materiaName, notaName]
  })
}

export async function verifyExistNota (id: string) {
  const { rows } = await client.execute({
    sql: 'SELECT * FROM notas WHERE id = ?',
    args: [id]
  })
  return !!rows[0]
}

export async function getNotasFromDB (materiaLink: string) {
  const materiaName = getMateriaByLink(materiaLink)
  if (!materiaName) return
  const { rows } = await client.execute({
    sql: 'SELECT * FROM notas WHERE materiaName = ?',
    args: [materiaName]
  })
  return rows
}

export async function getNotaById (id: string) {
  const { rows } = await client.execute({
    sql: 'SELECT * FROM notas WHERE id = ?',
    args: [id]
  })
  return rows[0]
}
