import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCompiti } from '@/hooks/useCompiti'
import { getSpazioNome } from '@/lib/spazi'
import { getAssegnatoLabel } from '@/lib/utenti'
import './ReportPage.css'

export function ReportPage() {
  const { compiti, loading } = useCompiti(null)

  const { fatte, daFare, totaleSpeso, perSpazio } = useMemo(() => {
    const fatte = compiti.filter((c) => c.eseguito)
    const daFare = compiti.filter((c) => !c.eseguito)
    const totaleSpeso = fatte.reduce((sum, c) => sum + (c.costo ?? 0), 0)
    const perSpazio: Record<string, number> = {}
    fatte.forEach((c) => {
      const nome = getSpazioNome(c.spazio_id)
      perSpazio[nome] = (perSpazio[nome] ?? 0) + (c.costo ?? 0)
    })
    return { fatte, daFare, totaleSpeso, perSpazio }
  }, [compiti])

  const proCapite = totaleSpeso / 2

  if (loading) return <p>Caricamento report…</p>

  return (
    <div className="report-page">
      <h1>Report</h1>

      <section className="report-section">
        <h2>Spese</h2>
        <div className="report-spese-box">
          <p className="report-totale">
            Totale: <strong>{totaleSpeso.toFixed(2)} €</strong>
          </p>
          <p className="report-procapite">
            Pro capite (2): <strong>{(proCapite).toFixed(2)} €</strong>
          </p>
        </div>
        {Object.keys(perSpazio).length > 0 && (
          <div className="report-dettaglio">
            <h3>Dettaglio per spazio</h3>
            <ul>
              {Object.entries(perSpazio)
                .sort((a, b) => b[1] - a[1])
                .map(([spazio, tot]) => (
                  <li key={spazio}>
                    <span className="report-spazio-nome">{spazio}</span>
                    <span className="report-spazio-costo">{tot.toFixed(2)} €</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </section>

      <section className="report-section">
        <h2>Cose fatte</h2>
        {fatte.length === 0 ? (
          <p className="report-empty">Nessun compito completato.</p>
        ) : (
          <ul className="report-list">
            {fatte.map((c) => (
              <li key={c.id}>
                <Link to={`/spazi/${c.spazio_id}`} className="report-link">
                  {getSpazioNome(c.spazio_id)}: {c.titolo}
                </Link>
                <span className="report-meta">
                  {c.data_fine?.slice(0, 10) ?? c.data_inizio.slice(0, 10)}
                  {c.costo != null && c.costo > 0 && ` · ${c.costo} €`}
                  {c.eseguito_da && ` · ${getAssegnatoLabel(c.eseguito_da)}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="report-section">
        <h2>Cose da fare</h2>
        {daFare.length === 0 ? (
          <p className="report-empty">Nessun compito in sospeso.</p>
        ) : (
          <ul className="report-list">
            {daFare.map((c) => (
              <li key={c.id}>
                <Link to={`/spazi/${c.spazio_id}`} className="report-link">
                  {getSpazioNome(c.spazio_id)}: {c.titolo}
                </Link>
                <span className="report-meta">
                  {c.data_inizio.slice(0, 10)}
                  {c.assegnato_a && ` · Assegnato a: ${getAssegnatoLabel(c.assegnato_a)}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="report-section">
        <h2>Chi ha fatto / deve fare cosa</h2>
        <div className="report-chi-table-wrap">
          <table className="report-chi-table">
            <thead>
              <tr>
                <th>Compito</th>
                <th>Spazio</th>
                <th>Assegnato a</th>
                <th>Eseguito da</th>
              </tr>
            </thead>
            <tbody>
              {compiti.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/spazi/${c.spazio_id}`}>{c.titolo}</Link>
                  </td>
                  <td>{getSpazioNome(c.spazio_id)}</td>
                  <td>{getAssegnatoLabel(c.assegnato_a)}</td>
                  <td>{getAssegnatoLabel(c.eseguito_da)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
