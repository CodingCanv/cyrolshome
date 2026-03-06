/**
 * Assegnazione fissa: Cyrolino, Cyrolina, entrambi (obbligatoria per ogni compito).
 */

export type AssegnatoId = 'cyrolino' | 'cyrolina' | 'entrambi'

export const ASSEGNATI_OPTIONS: { value: AssegnatoId; label: string }[] = [
  { value: 'cyrolino', label: 'Cyrolino' },
  { value: 'cyrolina', label: 'Cyrolina' },
  { value: 'entrambi', label: 'Entrambi' },
]

export function getAssegnatoLabel(value: string | null): string {
  if (!value) return '—'
  const o = ASSEGNATI_OPTIONS.find((x) => x.value === value)
  return o?.label ?? value
}
