import type { Materia, MateriasPorSeccion } from '@/env'
import { Temporal } from 'temporal-polyfill'

export const materiasPorSeccion: MateriasPorSeccion[] = [
  {
    title: 'Matemáticas',
    materias: [
      { nombre: 'Matemática CTS', link: 'matematica_cts' },
      { nombre: 'Cálculo', link: 'calculo' },
      { nombre: 'Física Mecánica Clásica', link: 'fisica_mecanica_clasica' }
    ]
  },
  {
    title: 'Humanidades y Ciencias Sociales',
    materias: [
      { nombre: 'Inglés', link: 'ingles' },
      { nombre: 'Filosofía', link: 'filosofia' },
      { nombre: 'Sociología', link: 'sociologia' }
    ]
  },
  {
    title: 'Informática',
    materias: [
      { nombre: 'Programación Full Stack', link: 'programacion_full_stack' },
      { nombre: 'Ingeniería de Software', link: 'ingenieria_de_software' },
      { nombre: 'Administración Sistemas Operativos', link: 'administracion_sistemas_operativos' },
      { nombre: 'Inteligencia Artificial', link: 'inteligencia_artificial' }
    ]
  },
  {
    title: 'Proyectos y Negocios',
    materias: [
      { nombre: 'Tutoría Proyecto UTULAB', link: 'tutoria_proyecto_utulab' },
      { nombre: 'Emprendurismo y Gestión', link: 'emprendurismo_y_gestion' }
    ]
  }
]

export const materias: Materia[] = [
  { nombre: 'Matemática CTS', link: 'matematica_cts' },
  { nombre: 'Cálculo', link: 'calculo' },
  { nombre: 'Física Mecánica Clásica', link: 'fisica_mecanica_clasica' },
  { nombre: 'Inglés', link: 'ingles' },
  { nombre: 'Filosofía', link: 'filosofia' },
  { nombre: 'Sociología', link: 'sociologia' },
  { nombre: 'Programación Full Stack', link: 'programacion_full_stack' },
  { nombre: 'Ingeniería de Software', link: 'ingenieria_de_software' },
  { nombre: 'Administración Sistemas Operativos', link: 'administracion_sistemas_operativos' },
  { nombre: 'Inteligencia Artificial', link: 'inteligencia_artificial' },
  { nombre: 'Tutoría Proyecto UTULAB', link: 'tutoria_proyecto_utulab' },
  { nombre: 'Emprendurismo y Gestión', link: 'emprendurismo_y_gestion' }
]

export function linkToName (link: string) {
  return link.includes('_') ? (
    link
      .split('_')
      .map(part => part === '' ? '' : `${part[0]?.toUpperCase()}${part?.substring(1,part.length)}`)
      .join(' ')
  ) : (
    `${link[0]?.toUpperCase()}${link?.substring(1,link.length)}`
  )
}

export function getSeccionNameByLink (link: string) {
  if (link === 'matematicas') return 'Matemáticas'
  if (link === 'humanidades_y_ciencias_sociales') return 'Humanidades y Ciencias Sociales'
  if (link === 'informatica') return 'Informática'
  if (link === 'proyectos_y_negocios') return 'Proyectos y Negocios'
}

export function getMateriaByLink (link: string) {
  const materias: { [key: string]: string } = {
    'sociologia': 'Sociología',
    'calculo': 'Cálculo',
    'emprendurismo_y_gestion': 'Emprendurismo y Gestión',
    'filosofia': 'Filosofía',
    'fisica_mecanica_clasica': 'Física Mecánica Clásica',
    'ingenieria_de_software': 'Ingeniería de Software',
    'ingles': 'Inglés',
    'tutoria_proyecto_utulab': 'Tutoría Proyecto UTULAB',
    'matematica_cts': 'Matemática CTS',
    'programacion_full_stack': 'Programación Full Stack',
    'administracion_sistemas_operativos': 'Administración Sistemas Operativos',
    'inteligencia_artificial': 'Inteligencia Artificial'
  }

  if (materias[link]) return materias[link]
}

export function nameToLink (name: string) {
  return name
    .toLowerCase()
    .split(' ')
    .join('_')
    .replaceAll('á', 'a')
    .replaceAll('é', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('ú', 'u')
}

export function getSeccionByMateriaLink(link: string) {
  const secciones: { [key: string]: string } = {
    'matematica_cts': 'Matemáticas',
    'calculo': 'Matemáticas',
    'fisica_mecanica_clasica': 'Matemáticas',
    'ingles':'Humanidades y Ciencias Sociales',
    'filosofia':'Humanidades y Ciencias Sociales',
    'sociologia':'Humanidades y Ciencias Sociales',
    'programacion_full_stack': 'Informática',
    'ingenieria_de_software': 'Informática',
    'administracion_sistemas_operativos': 'Informática',
    'inteligencia_artificial': 'Informática',
    'tutoria_proyecto_utulab': 'Proyectos y Negocios',
    'emprendurismo_y_gestion': 'Proyectos y Negocios'
  }

  if (secciones[link]) return secciones[link]
}

export function parseStringToDate(str: string | undefined = '') {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ]
  try {
    const now = Temporal.Now.zonedDateTime(str)
    return `${now.day} de ${months[now.month - 1]}, ${now.year}`
  } catch {
    return ''
  }
}

export function getMateriaByPath (path: string) {
  path = path.startsWith('/') ? path.substring(1, path.length) : path
  const link = path.split('/')
  return { nombre: getMateriaByLink(link[1]), link: `/${link[0]}/${link[1]}` }
}

export const secciones = [
  { nombre: 'Matemáticas', link: 'matematicas' },
  { nombre: 'Humanidades y Ciencias Sociales', link: 'humanidades_y_ciencias_sociales' },
  { nombre: 'Informática', link: 'informatica' },
  { nombre: 'Proyectos y Negocios', link: 'proyectos_y_negocios' }
]

export function getPathByPathname(pathname: string) {
  return pathname.startsWith('/') ? pathname.substring(1, pathname.length).split('/') : pathname.split('/')
}
