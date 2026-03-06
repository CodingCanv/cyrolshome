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

export type AssegnatoId = 'cyrolino' | 'cyrolina' | 'entrambi'

export interface Database {
  public: {
    Tables: {
      spazi: {
        Row: { id: SpazioId; nome: string }
        Insert: { id: SpazioId; nome: string }
        Update: { nome?: string }
      }
      compiti: {
        Row: {
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
        Insert: {
          spazio_id: SpazioId
          titolo: string
          data_inizio: string
          data_fine?: string | null
          costo?: number | null
          eseguito?: boolean
          assegnato_a: AssegnatoId
          eseguito_da?: AssegnatoId | null
          creato_da: string
        }
        Update: {
          titolo?: string
          data_inizio?: string
          data_fine?: string | null
          costo?: number | null
          eseguito?: boolean
          assegnato_a?: AssegnatoId
          eseguito_da?: AssegnatoId | null
          aggiornato_il?: string
        }
      }
    }
  }
}
