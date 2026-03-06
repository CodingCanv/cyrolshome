import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import './HomePage.css'

const CYROLINO_EMAIL = 'riccardo.orifici@outlook.it'

export function HomePage() {
  const { user } = useAuth()
  const isCyrolino = user?.email?.toLowerCase() === CYROLINO_EMAIL
  const saluto = user
    ? (isCyrolino ? 'Benvenuto Cyrolino' : 'Benvenuta Cyrolina')
    : 'Benvenuto'

  return (
    <div className="home-page">
      <div className="home-hero">
        <img src="/images/hero.png" alt="Cyrols's Home" className="home-hero-img" />
      </div>
      <h1>{saluto}</h1>
      <p className="home-intro">
        Usa il menu per andare su <strong>Spazi</strong> (lavori per stanza), <strong>Calendario</strong> o <strong>Report</strong> (cose fatte, da fare, spese).
      </p>
      <div className="home-actions">
        <Link to="/spazi" className="home-card">
          <span className="home-card-icon">🏠</span>
          <span className="home-card-label">Spazi e lavori</span>
        </Link>
        <Link to="/calendario" className="home-card">
          <span className="home-card-icon">📅</span>
          <span className="home-card-label">Calendario</span>
        </Link>
        <Link to="/report" className="home-card">
          <span className="home-card-icon">📊</span>
          <span className="home-card-label">Report</span>
        </Link>
      </div>
    </div>
  )
}
