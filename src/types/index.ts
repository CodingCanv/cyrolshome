export type SpazioId =
  | 'ingresso'
  | 'cucina'
  | 'soggiorno'
  | 'terrazzo'
  | 'bagno'
  | 'cameretta'
  | 'camera'
  | 'balcone-piccolo'
  | 'varie'

export interface Spazio {
  id: SpazioId
  nome: string
}

export type AssegnatoId = 'cyrolino' | 'cyrolina' | 'entrambi'

export interface Compito {
  id: string
  spazio_id: SpazioId
  titolo: string
  data_inizio: string
  data_fine: string | null
  costo: number | null
  eseguito: boolean
  assegnato_a: AssegnatoId
  eseguito_da: AssegnatoId | null
  creato_da: string
  creato_il: string
  aggiornato_il: string
}

export interface CompitoInsert {
  spazio_id: SpazioId
  titolo: string
  data_inizio: string
  data_fine?: string | null
  costo?: number | null
  eseguito?: boolean
  assegnato_a: AssegnatoId
  eseguito_da?: AssegnatoId | null
}

export interface CompitoUpdate {
  titolo?: string
  data_inizio?: string
  data_fine?: string | null
  costo?: number | null
  eseguito?: boolean
  assegnato_a?: AssegnatoId
  eseguito_da?: AssegnatoId | null
}
