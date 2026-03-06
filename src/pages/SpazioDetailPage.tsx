import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useCompiti } from '@/hooks/useCompiti'
import { getSpazioNome } from '@/lib/spazi'
import { getAssegnatoLabel } from '@/lib/utenti'
import type { SpazioId } from '@/types'
import type { Compito } from '@/types'
import { CompitoForm } from '@/components/spazi/CompitoForm'
import './SpazioDetailPage.css'

export function SpazioDetailPage() {
  const { spazioId } = useParams<{ spazioId: string }>()
  const id = spazioId as SpazioId
  const { user } = useAuth()
  const { compiti, loading, error, add, update, remove } = useCompiti(id)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Compito | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const nomeSpazio = getSpazioNome(id)

  const handleSubmit = async (data: { id?: string; spazio_id: SpazioId; titolo: string; data_inizio: string; data_fine?: string | null; costo?: number | null; eseguito?: boolean; assegnato_a?: string | null; eseguito_da?: string | null }) => {
    setFormError(null)
    const creatoDa = user?.id ?? ''
    try {
      if (data.id) {
        await update(data.id, {
          titolo: data.titolo,
          data_inizio: data.data_inizio,
          data_fine: data.data_fine ?? null,
          costo: data.costo ?? null,
          eseguito: data.eseguito ?? false,
          assegnato_a: (data.assegnato_a as 'cyrolino' | 'cyrolina' | 'entrambi') ?? undefined,
          eseguito_da: (data.eseguito_da as 'cyrolino' | 'cyrolina' | 'entrambi' | null) ?? null,
        })
      } else {
        if (!data.assegnato_a) {
          setFormError('Seleziona a chi è assegnato il compito.')
          return
        }
        await add(
          {
            spazio_id: data.spazio_id,
            titolo: data.titolo,
            data_inizio: data.data_inizio,
            data_fine: data.data_fine ?? null,
            costo: data.costo ?? null,
            eseguito: data.eseguito ?? false,
            assegnato_a: data.assegnato_a as 'cyrolino' | 'cyrolina' | 'entrambi',
            eseguito_da: (data.eseguito_da as 'cyrolino' | 'cyrolina' | 'entrambi' | null) ?? null,
          },
          creatoDa
        )
      }
      setModalOpen(false)
      setEditing(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Errore durante il salvataggio.'
      setFormError(msg)
    }
  }

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (c: Compito) => {
    setEditing(c)
    setModalOpen(true)
  }

  const handleDelete = async (c: Compito) => {
    if (window.confirm(`Eliminare "${c.titolo}"?`)) await remove(c.id)
  }

  return (
    <div className="spazio-detail-page">
      <nav className="breadcrumb">
        <Link to="/spazi">Spazi</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{nomeSpazio}</span>
      </nav>
      <div className="spazio-detail-header">
        <h1>{nomeSpazio}</h1>
        <button type="button" className="btn-primary" onClick={openAdd}>
          Aggiungi compito
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <p>Caricamento…</p>
      ) : compiti.length === 0 ? (
        <p className="empty-msg">Nessun compito. Aggiungine uno.</p>
      ) : (
        <ul className="compiti-list">
          {compiti.map((c) => (
            <li key={c.id} className="compito-card">
              <div className="compito-main">
                <span className={`compito-stato ${c.eseguito ? 'fatto' : 'da-fare'}`}>
                  {c.eseguito ? '✓ Fatto' : 'Da fare'}
                </span>
                <h3 className="compito-titolo">{c.titolo}</h3>
                <div className="compito-meta">
                  <span>{c.data_inizio.slice(0, 10)}</span>
                  {c.data_fine && <span> → {c.data_fine.slice(0, 10)}</span>}
                  {c.costo != null && c.costo > 0 && (
                    <span className="compito-costo">{c.costo} €</span>
                  )}
                </div>
                <div className="compito-chi">
                  {c.assegnato_a && !c.eseguito && (
                    <span>Assegnato a: {getAssegnatoLabel(c.assegnato_a)}</span>
                  )}
                  {c.eseguito_da && (
                    <span>Eseguito da: {getAssegnatoLabel(c.eseguito_da)}</span>
                  )}
                </div>
              </div>
              <div className="compito-actions">
                <button type="button" className="btn-icon" onClick={() => openEdit(c)} aria-label="Modifica">
                  Modifica
                </button>
                <button type="button" className="btn-icon btn-danger" onClick={() => handleDelete(c)} aria-label="Elimina">
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => { setModalOpen(false); setEditing(null); setFormError(null) }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Modifica compito' : 'Nuovo compito'}</h2>
            {formError && <p className="error-msg" style={{ marginTop: 0 }}>{formError}</p>}
            <CompitoForm
              spazioId={id}
              compito={editing}
              onSubmit={handleSubmit}
              onCancel={() => { setModalOpen(false); setEditing(null); setFormError(null) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
