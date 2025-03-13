import { client } from '@/db/client'
import type { MateriaConNotas } from '@/env'
import { Temporal } from 'temporal-polyfill'

const materiaConNotas: MateriaConNotas[] = [
  {
    nombre: 'Sociología',
    link: 'sociologia',
    notas: []
  },
  {
    nombre: 'Cálculo',
    link: 'calculo',
    notas: []
  },
  {
    nombre: 'Emprendurismo y Gestión',
    link: 'emprendurismo_y_gestion',
    notas: []
  },
  {
    nombre: 'Filosofía',
    link: 'filosofia',
    notas: []
  },
  {
    nombre: 'Física Mecánica Clásica',
    link: 'fisica_mecanica_clasica',
    notas: []
  },
  {
    nombre: 'Ingeniería de Software',
    link: 'ingenieria_de_software',
    notas: []
  },
  {
    nombre: 'Inglés',
    link: 'ingles',
    notas: []
  },
  {
    nombre: 'Tutoría Proyecto UTULAB',
    link: 'tutoria_proyecto_utulab',
    notas: []
  },
  {
    nombre: 'Matemática CTS',
    link: 'matematica_cts',
    notas: []
  },
  {
    nombre: 'Programación Full Stack',
    link: 'programacion_full_stack',
    notas: [
      {
        id: 1,
        nombre: 'Comienzo',
        link: 'comienzo',
        content: [
          {
            
          }
        ],
        lastModified: Temporal.Now.instant().toString()
      },
      {
        id: 2,
        nombre: 'Prueba',
        link: 'prueba',
        content: [],
        lastModified: Temporal.Now.instant().toString()
      }
    ]
  },
  {
    nombre: 'Administración Sistemas Operativos',
    link: 'administracion_sistemas_operativos',
    notas: [
      {
        id: 1,
        nombre: 'Comienzo',
        link: 'comienzo',
        content: [],
        lastModified: Temporal.Now.instant().toString()
      },
      {
        id: 2,
        nombre: '',
        link: '',
        content: [],
        lastModified: Temporal.Now.instant().toString()
      },
      {
        id: 3,
        nombre: 'prueba astro en set:html',
        link: 'prueba_astro_en_set:html',
        content: [],
        lastModified: Temporal.Now.instant().toString()
      }
    ]
  },
  {
    nombre: 'Inteligencia Artificial',
    link: 'inteligencia_artificial',
    notas: []
  }
]

export async function getNotasByMateriaLink (link: string) {
  return materiaConNotas.find(m => m.link === link)?.notas
}

export function findNotaByMateriaLinkAndNotaLink({ materiaLink, notaLink }: { materiaLink: string, notaLink: string }) {
  const materia = materiaConNotas.find(m => m.link === materiaLink)
  return materia?.notas.find(n => n.link === notaLink)
}

export function findNotaByMateriaLinkAndNotaId ({ materiaLink, notaId }: { materiaLink: string, notaId: number }) {
  return materiaConNotas.find(m => m.link === materiaLink)?.notas.find(n => n.id === notaId)
}

export function findMateriaByNotaLink (link: string) {
  return materiaConNotas.find(m => m.notas.some(n => n.link === link))
}

export function getNewNotaIdBymateriaLink (materiaLink: string) {
  return materiaConNotas.find(m => m.link === materiaLink)?.notas.length || 1
}

export async function compareNotasFromDB ({ notaFullLink, materiaName }: { notaFullLink: string, materiaName: string }) {
  const { rows } = await client.execute({
    sql: 'SELECT * FROM notas WHERE id = ? AND materiaName = ?',
    args: [notaFullLink, materiaName]
  })
  return rows.length > 0
}

