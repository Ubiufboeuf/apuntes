export type NombreDeMateria = string
export type LinkDeMateria = string
export type SeccionDeMaterias = string

export type Materia = {
  nombre: NombreDeMateria,
  link: LinkDeMateria
}

export type MateriasPorSeccion = {
  title: SeccionDeMaterias
  materias: Materia[]
}

export type Nota = {
  readonly id: number
  nombre: string
  link: string
  content: Array<T>
  lastModified?: string
}

export type MateriaConNotas = {
  nombre: string
  link: string
  notas: Nota[]
}
