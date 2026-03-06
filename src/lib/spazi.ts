import type { Spazio, SpazioId } from '@/types'

export const SPAZI: Spazio[] = [
  { id: 'ingresso', nome: 'Ingresso' },
  { id: 'cucina', nome: 'Cucina' },
  { id: 'soggiorno', nome: 'Soggiorno' },
  { id: 'terrazzo', nome: 'Terrazzo' },
  { id: 'bagno', nome: 'Bagno' },
  { id: 'cameretta', nome: 'Cameretta' },
  { id: 'camera', nome: 'Camera' },
  { id: 'balcone-piccolo', nome: 'Balcone piccolo' },
  { id: 'varie', nome: 'Varie' },
]

export const SPAZI_MAP: Record<SpazioId, string> = SPAZI.reduce(
  (acc, s) => ({ ...acc, [s.id]: s.nome }),
  {} as Record<SpazioId, string>
)

export function getSpazioNome(id: SpazioId): string {
  return SPAZI_MAP[id] ?? id
}
