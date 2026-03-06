import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import './ImpostazioniPage.css'

export function ImpostazioniPage() {
  const { updatePassword } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (newPassword.length < 6) {
      setError('La password deve avere almeno 6 caratteri.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Le due password non coincidono.')
      return
    }
    setSubmitting(true)
    try {
      await updatePassword(newPassword)
      setSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'aggiornamento.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="impostazioni-page">
      <h1>Impostazioni</h1>
      <section className="impostazioni-section">
        <h2>Cambia password</h2>
        <form onSubmit={handleSubmit} className="impostazioni-form">
          <label htmlFor="new-password">Nuova password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Almeno 6 caratteri"
          />
          <label htmlFor="confirm-password">Conferma nuova password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Ripeti la password"
          />
          {error && <p className="impostazioni-error">{error}</p>}
          {success && <p className="impostazioni-success">Password aggiornata con successo.</p>}
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Salvataggio…' : 'Salva nuova password'}
          </button>
        </form>
      </section>
    </div>
  )
}
