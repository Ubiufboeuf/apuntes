import pako from 'pako'

export function comprimirTexto(texto) {
  const gzipped = pako.gzip(texto)
  return gzipped
}

export function descomprimirTexto(texto) {
  return pako.ungzip(texto, { to: 'string' })
}
