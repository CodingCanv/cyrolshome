import { Link } from 'react-router-dom'
import { SPAZI } from '@/lib/spazi'
import './SpaziPage.css'

export function SpaziPage() {
  return (
    <div className="spazi-page">
      <h1>Spazi</h1>
      <p className="spazi-intro">Scegli uno spazio per vedere e gestire i compiti.</p>
      <ul className="spazi-list">
        {SPAZI.map((s) => (
          <li key={s.id}>
            <Link to={`/spazi/${s.id}`} className="spazi-card">
              <span className="spazi-card-name">{s.nome}</span>
              <span className="spazi-card-arrow">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
