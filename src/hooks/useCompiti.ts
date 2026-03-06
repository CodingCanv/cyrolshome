import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Compito, CompitoInsert, CompitoUpdate } from '@/types'
import type { SpazioId } from '@/types'

export function useCompiti(spazioId?: SpazioId | null) {
  const [compiti, setCompiti] = useState<Compito[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    let q = supabase
      .from('compiti')
      .select('*')
      .order('data_inizio', { ascending: false })
    if (spazioId) {
      q = q.eq('spazio_id', spazioId)
    }
    const { data, error: e } = await q
    if (e) {
      setError(e.message)
      setCompiti([])
    } else {
      setCompiti((data as Compito[]) ?? [])
    }
    setLoading(false)
  }, [spazioId])

  useEffect(() => {
    fetch()
  }, [fetch])

  const add = async (payload: CompitoInsert, creatoDa: string) => {
    const { data: session } = await supabase.auth.getUser()
    const creatoDaUid = session?.user?.id ?? creatoDa
    if (!creatoDaUid) {
      throw new Error('Sessione scaduta: esci e accedi di nuovo per aggiungere un compito.')
    }
    const row = {
      spazio_id: payload.spazio_id,
      titolo: payload.titolo,
      data_inizio: payload.data_inizio,
      data_fine: payload.data_fine ?? null,
      costo: payload.costo ?? null,
      eseguito: payload.eseguito ?? false,
      assegnato_a: payload.assegnato_a,
      eseguito_da: payload.eseguito === true ? (payload.eseguito_da ?? null) : null,
      creato_da: creatoDaUid,
    }
    const { data, error: e } = await supabase.from('compiti').insert(row)
      .select()
      .single()
    if (e) throw new Error(e.message)
    await fetch()
    return data as Compito
  }

  const update = async (id: string, payload: CompitoUpdate) => {
    const updateRow: Record<string, unknown> = {
      ...payload,
      aggiornato_il: new Date().toISOString(),
    }
    const { error: e } = await supabase.from('compiti').update(updateRow)
      .eq('id', id)
    if (e) throw new Error(e.message)
    await fetch()
  }

  const remove = async (id: string) => {
    const { error: e } = await supabase.from('compiti').delete().eq('id', id)
    if (e) throw e
    await fetch()
  }

  return { compiti, loading, error, refetch: fetch, add, update, remove }
}
