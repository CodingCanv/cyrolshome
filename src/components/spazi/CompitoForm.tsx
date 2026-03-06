import { useState, useEffect } from 'react'
import type { Compito, CompitoInsert } from '@/types'
import type { SpazioId } from '@/types'
import { ASSEGNATI_OPTIONS } from '@/lib/utenti'
import './CompitoForm.css'

interface CompitoFormProps {
  spazioId: SpazioId
  compito?: Compito | null
  onSubmit: (data: CompitoInsert & { id?: string }) => void
  onCancel: () => void
}

const defaultDate = () => new Date().toISOString().slice(0, 10)

export function CompitoForm({ spazioId, compito, onSubmit, onCancel }: CompitoFormProps) {
  const [titolo, setTitolo] = useState('')
  const [dataInizio, setDataInizio] = useState(defaultDate())
  const [dataFine, setDataFine] = useState('')
  const [costo, setCosto] = useState('')
  const [eseguito, setEseguito] = useState(false)
  const [assegnatoA, setAssegnatoA] = useState<string>('')
  const [eseguitoDa, setEseguitoDa] = useState<string>('')

  useEffect(() => {
    if (compito) {
      setTitolo(compito.titolo)
      setDataInizio(compito.data_inizio.slice(0, 10))
      setDataFine(compito.data_fine?.slice(0, 10) ?? '')
      setCosto(compito.costo != null ? String(compito.costo) : '')
      setEseguito(compito.eseguito)
      setAssegnatoA(compito.assegnato_a)
      setEseguitoDa(compito.eseguito_da ?? '')
    }
  }, [compito])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!assegnatoA) return
    const isEdit = Boolean(compito)
    const eseguitoValue = isEdit ? eseguito : false
    const eseguitoDaValue: 'cyrolino' | 'cyrolina' | 'entrambi' | null = isEdit && eseguitoValue
      ? (eseguitoDa && ['cyrolino', 'cyrolina', 'entrambi'].includes(eseguitoDa) ? eseguitoDa as 'cyrolino' | 'cyrolina' | 'entrambi' : null)
      : null
    const payload = {
      ...(compito?.id && { id: compito.id }),
      spazio_id: spazioId,
      titolo: titolo.trim(),
      data_inizio: dataInizio,
      data_fine: dataFine || null,
      costo: costo ? parseFloat(costo) : null,
      eseguito: eseguitoValue,
      assegnato_a: assegnatoA as 'cyrolino' | 'cyrolina' | 'entrambi',
      eseguito_da: eseguitoDaValue,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="compito-form">
      <label htmlFor="titolo">Titolo *</label>
      <input
        id="titolo"
        type="text"
        value={titolo}
        onChange={(e) => setTitolo(e.target.value)}
        required
        placeholder="Es. Verniciare parete"
      />
      <label htmlFor="data_inizio">Data inizio *</label>
      <input
        id="data_inizio"
        type="date"
        value={dataInizio}
        onChange={(e) => setDataInizio(e.target.value)}
        required
      />
      <label htmlFor="data_fine">Data fine (opzionale)</label>
      <input
        id="data_fine"
        type="date"
        value={dataFine}
        onChange={(e) => setDataFine(e.target.value)}
      />
      <label htmlFor="costo">Costo (€, opzionale)</label>
      <input
        id="costo"
        type="number"
        step="0.01"
        min="0"
        value={costo}
        onChange={(e) => setCosto(e.target.value)}
        placeholder="0"
      />
      <label htmlFor="assegnato_a">Assegnato a *</label>
      <select
        id="assegnato_a"
        value={assegnatoA}
        onChange={(e) => setAssegnatoA(e.target.value)}
        required
      >
        <option value="">Seleziona…</option>
        {ASSEGNATI_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {compito && (
        <>
          <div className="compito-form-row">
            <input
              id="eseguito"
              type="checkbox"
              checked={eseguito}
              onChange={(e) => setEseguito(e.target.checked)}
            />
            <label htmlFor="eseguito">Eseguito</label>
          </div>
          {eseguito && (
            <>
              <label htmlFor="eseguito_da">Eseguito da</label>
              <select
                id="eseguito_da"
                value={eseguitoDa}
                onChange={(e) => setEseguitoDa(e.target.value)}
              >
                <option value="">—</option>
                {ASSEGNATI_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </>
      )}
      <div className="compito-form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Annulla
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={!assegnatoA}
          title={!assegnatoA ? 'Seleziona prima "Assegnato a"' : ''}
        >
          {compito ? 'Salva' : 'Aggiungi'}
        </button>
      </div>
    </form>
  )
}
